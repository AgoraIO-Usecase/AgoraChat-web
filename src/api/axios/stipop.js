import request from './index'
import store from '../../redux/store'

// 搜索贴纸接口
export function searchStiPopSticket (params = {}) {
  return request({
    method: 'get',
    url: `/search`,
    params
  })
}
// 历史记录贴纸，使用过的，下载过的
export function usedTickets (params = {}) {
  params.pathId = 1
  return request({
    method: 'get',
    url: `/download/`,
    params
  })
}
// 喜欢的贴纸
export function likeTickets (params = {}) {
  params.pathId = 1
  return request({
    method: 'get',
    url: `/wish/`,
    params
  })
}
// 我的贴纸，（来自于下载的贴纸）
export function myDownloadTickets (params = {}) {
  params.pathId = 1
  return request({
    method: 'get',
    url: `/mysticker/`,
    params
  })
}
// 贴纸市场中的贴纸包
export function ticketsMarket (params = {}) {
  return request({
    method: 'get',
    url: `/package`,
    params
  })
}
// 贴纸包的详细信息
export function getPackInfo (params) {
  return request({
    method: 'get',
    url: `/package/${params.id}`,
    params
  })
}
// 删除贴纸包
export function deletePack (params) {
  const { myUserInfo: { agoraId } } = store.getState()
  return request({
    method: 'put',
    url: `/mysticker/hide/${agoraId}/${params.id}`,
  })
}
// 添加或移除，喜欢的贴纸
export function addOrdelWishPack (params) {
  return request({
    method: 'put',
    url: `/wish/${params.id}`,
    params: {}
  })
}
// 下载贴纸
export function downloadMarketSticker (params = {}) {
  const { myUserInfo: { agoraId } } = store.getState()
  params.userId = agoraId
  params.isPurchase = 'N'
  return request({
    method: 'post',
    url: `/download/${params.id}`,
    params
  })
}
// 最近发送的sticker
export function  recentlySentStickers (params = {}) {
  const { myUserInfo: { agoraId } } = store.getState()
  return request({
    method: 'get',
    url: `/package/send/${agoraId}`,
    params
  })
}

// 发送记录
export function registeringStickerSend (params = {}) {
  return request({
    method: 'post',
    url: `/analytics/send/${params.stickerId}`,
    params
  })
}