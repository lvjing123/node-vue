import { http } from '@/utils/http'
/**
 * @description: 刷新token
 */
export function queryAdminPageInfo() {
  return http.request(
    {
      url: '/admin/page',
      method: 'get',
    }
  )
}

export function saveAdminPageInfo(params: any) {
  return http.request(
    {
      url: '/admin/page/save',
      method: 'post',
      params,
    }
  )
}

export function deleteAdminPageInfo(params: any) {
  return http.request(
    {
      url: '/admin/page/delete',
      method: 'delete',
      params,
    }
  )
}

export function editAdminPageInfo(params: any) {
  return http.request(
    {
      url: '/admin/page/edit',
      method: 'post',
      params,
    }
  )
}
