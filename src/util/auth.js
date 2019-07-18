
import Cookies from 'js-cookie'
import store from '@/store'
const TokenKey = 'x-access-token';
var inFifteenMinutes = new Date(new Date().getTime() + 120 * 60 * 1000);
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
    //return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
