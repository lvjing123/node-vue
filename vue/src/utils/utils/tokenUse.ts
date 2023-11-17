import CryptoJS from 'crypto-js'
import { storageGet, storageSet } from '@/composables/useLocalStorage'

const key = '123456' // 这个是加密key 主要是用来 用户名和密码 登陆后，存储在浏览器时，需要加密
// 加密存储到localStorage
export function encryptedLocalStorage(localStorageKey: string, value: Record<string, unknown>) {
    const content = JSON.stringify(value)
    // 加密方法
    const encryptedContent = CryptoJS.AES.encrypt(content, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    const encStr = encryptedContent.ciphertext.toString()
    storageSet(localStorageKey, encStr)
  }
  
  // 解密local storage返回原始值
  export function decryptedLocalStorage(localStorageKey: string, _def: any = '') {
    // 解密方法
    const encStr = storageGet(localStorageKey)
    if (!encStr) return { localStorageKey: _def }
    const decryptedContent = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(encStr), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return JSON.parse(CryptoJS.enc.Utf8.stringify(decryptedContent))
  }