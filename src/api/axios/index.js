import axios from 'axios'
import store from '../../redux/store'
import { stipopAppKey } from '../../utils/config'

const request = new axios.create({
  baseURL: 'https://messenger.stipop.io/v1',
  timeout: 500000,
  headers: { 'apikey': stipopAppKey }
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config, 'config')
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
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response, 'response')
  const { status, data: { body, header } } = response
  if (status === 200 && header.code === '0000') {
    if (Array.isArray(body) && body.length === 0) {
      return header
    } else {
      return body
    }
  } else {
    return response.data
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
})

export default request