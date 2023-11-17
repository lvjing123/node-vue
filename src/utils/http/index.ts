// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import { VAxios } from './Axios'
import { AxiosTransform } from './axiosTransform'
import axios, { AxiosResponse } from 'axios'
import { checkStatus } from './checkStatus'
import { joinTimestamp, formatRequestDate } from './helper'
import { RequestEnum, ContentTypeEnum } from './httpEnum'
import { isString, isUrl, deepMerge, setObjToUrlParams } from '@/utils/utils/common'
import { RequestOptions, Result, CreateAxiosOptions } from './axiosType'
import { ACCESS_TOKEN, CURRENT_USER, REFRESH_TOKEN } from '@/store/modules/mutation-types'
import { useUserStoreWidthOut } from '@/store/modules/user'
import { checkLoginStatus, refreshTokenFuc } from '@/api/user'
import i18n from '@/i18n/index'
import router from '@/router'
import httpI18n from '@/i18n/http'
import { useLangStoreWidthOut } from '@/store/modules/lang'
import { useUserStore } from '@/store/modules/user'
import { decryptedLocalStorage, encryptedLocalStorage } from '@/utils/utils/tokenUse'
import qs from 'qs'


type Lang = 'zh' | 'en'
const urlPrefix = '/api'

const langStore = useLangStoreWidthOut()

let isRefreshing = false // 标记是否正在刷新 token
let requests: any[] = [] // 存储待重发请求的数组

export const responseInterceptorsCatch = (error: any) => {
  const userLang = useLangStoreWidthOut()
  const userStore = useUserStore()
  const lang = userLang.getLang
  // @ts-ignore
  // eslint-disable-next-line prefer-destructuring
  const $message = ElMessage
  // @ts-ignore
  // eslint-disable-next-line prefer-destructuring
  const $notification = window['$notification']
  const { response, code, message } = error || {}
  // TODO 此处要根据后端接口返回格式修改
  const msg: string = response && response.data && response.data.message ? response.data.message : message
  const err: string = error.toString()
  try {
    if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      $message.error(httpI18n.apiTimeOut[lang as Lang], { keepAliveOnHover: true })
      return
    }
    if (err && err.includes('Network Error')) {
      $notification.destroyAll()
      //检查是否已经有提示语
      $notification.warning({
        title: httpI18n.networkErr[lang as Lang],
        content: httpI18n.checkNet[lang as Lang],
        positiveText: httpI18n.confirm[lang as Lang],
        //negativeText: '取消',
        closable: true,
        maskClosable: false,
        onPositiveClick: () => {},
        onNegativeClick: () => {},
      })
      return Promise.reject(error)
    }
  } catch (error) {
    throw new Error(error as any)
  }
  // 请求是否被取消
  const isCancel = axios.isCancel(error)
  if (!isCancel) {
    if (response.data.code === 3001) {
      router.push({ name: 'org-manage' })
    }
    if (response.data.code === 4000) {
      const urlArr = response.config.url.split('/')
      router.push({ path: `/org/${urlArr[3]}/overview` })
      router.push({ path: '/login' })
    }
    if (response.data.code === 5000) {
      const urlArr = response.config.url.split('/')
      router.push({ path: `/project/${urlArr[3]}/${urlArr[5]}/overview` })
    }
    // TODO refresh token
    if (response.config.url === '/api/account/login') {
      return Promise.reject(error)
    }
    if (msg && response.status !== 401) {
      if (response.status === 403) {
        // 分两种情况
        const { method } = response.config
        // 情况1 同一个浏览器，tab1登录了超级管理员，随后tab2再登录了用户，现在去tab1,提示无访问权限
        // 情况2 例如边缘服务的页面
        //可以根据 method 来判断
        if (method == 'get') {
          //页面跳转到无权限页。
          // router.push('/noauth')
        } else {
          // 提示无访问权限
          checkStatus(error.response && error.response.status, msg)
        }
      }
    }
    if (response.config.url.includes('token/refresh')) {
      $message.error(httpI18n.loginTimeOut[lang as Lang])
      // router.push({ path: `/login` })
    }
    if (response.status === 401) {
      if (decryptedLocalStorage(ACCESS_TOKEN)[ACCESS_TOKEN]) {
        // eslint-disable-next-line no-empty
        if (response.config.url === '/api/account/login') {
        } else if (response?.data.code === 6000) {
          // 用户记录不存在
          // 切换后端的环境，此时应该清除登录的信息 再跳转到登录页
          userStore.logout()
          router.push({ path: `/login` })
        } else {
          const { config } = error
          if (!isRefreshing) {
            isRefreshing = true
            const userStore = useUserStoreWidthOut()
            const refreshToken = userStore.getRefreshToken
            const toLogin = () => {
              $message.destroyAll()
              userStore.logout()
              setTimeout(() => {
                router.push({ path: `/login` })
              }, 2000)
            }
            return refreshTokenFuc(refreshToken)
              .then(async (res: any) => {
                const { accessToken, refreshToken } = res
                if (accessToken) {
                  encryptedLocalStorage(ACCESS_TOKEN, {
                    ACCESS: accessToken,
                  })
                  encryptedLocalStorage(REFRESH_TOKEN, {
                    REFRESH: refreshToken,
                  })
                  encryptedLocalStorage(CURRENT_USER, {
                    USER: res,
                  })
                  userStore.setToken(accessToken)
                  userStore.setRefreshToken(refreshToken)
                  try {
                    const data = await checkLoginStatus()
                    //todo 可能要设置 admin,在 transfer getAllUser 函数中有判断
                    const userInfo = decryptedLocalStorage(CURRENT_USER)[CURRENT_USER]
                    userInfo.admin = data.admin
                    encryptedLocalStorage(CURRENT_USER, {
                      USER: userInfo,
                    })
                    userStore.setUserInfo(userInfo)

                    config.headers.Authorization = `Bearer ${accessToken}`
                    // token 刷新后将数组的方法重新执行
                    requests.forEach((cb) => cb(accessToken))
                    requests = [] // 重新请求完清空
                    config.url = config.url.replace(/^\/api/, '')
                    return http.request(config, { isReturnNativeResponse: true })
                  } catch (error) {
                    toLogin()
                  }
                } else {
                  toLogin()
                }
              })
              .catch(() => {
                toLogin()
              })
              .finally(() => {
                isRefreshing = false
              })
          } else {
            // 返回未执行 resolve 的 Promise
            return new Promise((resolve) => {
              // 用函数形式将 resolve 存入，等待刷新后再执行
              requests.push((token: string) => {
                config.headers.Authorization = `Bearer ${token}`
                config.url = config.url.replace(/^\/api/, '')
                resolve(http.request(config, { isReturnNativeResponse: true }))
              })
            })
          }
        }
      } else {
        //  todo ,浏览器开了两个窗口，同一个用户在其中一个窗口退出登录，清除了token，另外一个窗口的接口401，直接跳转到登录
        router.push({ path: `/login` })
      }
    }
  } else {
    return Promise.reject(response?.data)
  }
}

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestData: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const userLang = useLangStoreWidthOut()
    const lang = userLang.getLang
    const {
      isShowMessage = true,
      isShowErrorMessage,
      isShowSuccessMessage,
      successMessageText,
      errorMessageText,
      isTransformResponse,
      isReturnNativeResponse,
    } = options
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data
    }

    //  这里 code，data，message为 后台统一的字段，需要修改为项目自己的接口返回格式
    // fixed js error
    const data = res && res.data
    // @ts-ignore
    // eslint-disable-next-line prefer-destructuring
    const $dialog = window['$dialog']
    // @ts-ignore
    // eslint-disable-next-line prefer-destructuring
    const $message = window['$message']
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(httpI18n.requestError[lang as Lang])
    }
    // @ts-ignore
    const { code, message, error } = data
    if (res.status === 200) {
      if (isShowMessage) {
        if (successMessageText || isShowSuccessMessage) {
          // 是否显示自定义信息提示
          $message.success(successMessageText || message || httpI18n.operationSuc[lang as Lang])
        }
      }
    } else {
      if (code) {
        // 是否显示提示信息
        if (isShowMessage) {
          if (errorMessageText || isShowErrorMessage) {
            // 是否显示自定义信息提示
            $message.error(message || errorMessageText || httpI18n.operationErr[lang as Lang], {
              keepAliveOnHover: true,
            })
          } else if (options.errorMessageMode === 'modal') {
            // errorMessageMode=‘custom-modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
            $dialog.info({
              title: httpI18n.prompt[lang as Lang],
              content: message,
              positiveText: httpI18n.confirm[lang as Lang],
              onPositiveClick: () => {},
            })
          }
        }
      }
    }
    // 接口请求成功，直接返回结果
    if (data && !error) {
      return data
    }
    // 接口请求错误，统一提示错误信息 这里逻辑可以根据项目进行修改
    const errorMsg = message
    if (errorMsg) {
      $message.error(errorMsg, { keepAliveOnHover: true })
    }
    throw new Error(errorMsg)
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options
    const isUrlStr = isUrl(config.url as string)

    if (!isUrlStr && joinPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }
    const params = config.params || {}
    const data = config.data || false
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data
          config.params = params
        } else {
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(config.url as string, Object.assign({}, config.params, config.data))
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config: Recordable, options) => {
    // 请求之前处理config
    const token = decryptedLocalStorage(ACCESS_TOKEN)[ACCESS_TOKEN]
    const acceptDesc = config?.requestOptions?.acceptDesc
    if (acceptDesc) {
      config.headers.Accept = `vnd.emqx.${acceptDesc}.v1+json`
    }
    if (config.requestOptions.isEkuiper) {
      config.url = `/api/edgeservice/proxy/${location.hash.split('/')[5]}${config.url.replace('/api', '')}`
    }
    if (config.url.includes('/v2')) {
      config.url = `/api/edgeservice/proxy/${location.hash.split('/')[5]}${config.url}`
    }
    if (token && config?.requestOptions?.withToken !== false) {
      // jwt token
      config.headers.Authorization = options.authenticationScheme ? `${options.authenticationScheme} ${token}` : token
    }
    if (langStore.getLang) {
      config.headers['Accept-Language'] = langStore.getLang
    }
    if (config.requestOptions.isFormData) {
      config.headers = Object.assign(config.headers || { 'Content-Type': ContentTypeEnum.JSON }, {
        'Content-Type': ContentTypeEnum.FORM_DATA,
      })
    }
    return config
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch,
}

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        timeout: 3 * 10 * 1000,
        authenticationScheme: 'Bearer',
        // 接口前缀
        prefixUrl: urlPrefix,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 数据处理方式
        transform,
        // 请求拦截器
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'none',
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: false,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          // 是否显示错误信息
          isShowErrorMessage: true,
          // 是否是formData 的请求方式
          isFormData: false,
        },
        withCredentials: false,
      },
      opt || {},
    ),
  )
}

export const http = createAxios()

// 项目，多个不同 api 地址，直接在这里导出多个
// src/api ts 里面接口，就可以单独使用这个请求，
// import { httpTwo } from '@/utils/http/axios'
// export const httpTwo = createAxios({
//   requestOptions: {
//     apiUrl: 'http://localhost:9001',
//     urlPrefix: 'api',
//   },
// });
