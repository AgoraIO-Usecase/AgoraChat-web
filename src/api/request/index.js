import axios from 'axios'
import store from '../../redux/store'
import { stipopAppKey } from '../../utils/config'

const request = new axios.create({
  baseURL: 'https://messenger.stipop.io/v1',
  timeout: 500000,
  headers: { 'apikey': stipopAppKey }
})

request.interceptors.request.use(function (config) {
  const { myUserInfo: { agoraId } } = store.getState()
  const { params, url } = config
  if (params) {
    if (params?.pathId) {
      config.url = `${url}${agoraId}`
    } else {
      config.params['userId'] = agoraId
    }
  }
  return config
}, function (error) {
  return Promise.reject(error);
});

request.interceptors.response.use(function (response) {
  const { status, data: { body, header } } = response
  if (status === 200 && header.code === '0000') { // 0000 is request success
    if (Array.isArray(body) && body.length === 0) {
      return header
    } else {
      return body
    }
  } else {
    return response.data
  }
}, function (error) {
  return Promise.reject(error);
})

export default request