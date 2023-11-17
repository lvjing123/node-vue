import { defineStore } from 'pinia'
import { store } from '@/store'
import { ACCESS_TOKEN, CURRENT_USER, REFRESH_TOKEN, USER_ROLES } from '@/store/modules/mutation-types'

export interface IUserState {
  token: string
  refreshToken: string
  username: string
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: '',
    refreshToken: '',
    username: '',
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },
    // @ts-ignore
    // 登录
    async login(params: any) {
      try {
        const response = ''
        // const response = await login(params)
        // const { accessToken, refreshToken } = response
        // if (accessToken) {
        //   encryptedLocalStorage(ACCESS_TOKEN, {
        //     ACCESS: accessToken,
        //   })
        //   encryptedLocalStorage(REFRESH_TOKEN, {
        //     REFRESH: refreshToken,
        //   })
        //   encryptedLocalStorage(CURRENT_USER, {
        //     USER: response,
        //   })
        //   this.token = accessToken
        //   this.refreshToken = refreshToken
        //   this.setToken(accessToken)
        //   this.setUserInfo(response)
        // }
        return Promise.resolve(response)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    logout(){
      // 退出登陆
    },
    setUserInfo(userInfo: any){

    }
  },
})

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store)
}
