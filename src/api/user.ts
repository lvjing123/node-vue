import { http } from '@/utils/http'
/**
 * @description: 刷新token
 */
export function refreshTokenFuc(refreshToken: string) {
    return http.request(
      {
        url: '/account/token/refresh',
        method: 'POST',
        params: {
          refreshToken,
        },
      },
      {
        isTransformResponse: false,
        isShowMessage: false,
      },
    )
  }
  
  export function checkLoginStatus() {
    return http.request({
      url: `/account/profile`,
      method: 'get',
    })
  }