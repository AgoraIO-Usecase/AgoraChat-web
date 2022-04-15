import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setMuteDataObj, setGlobalSilentMode, setUnread } from '../../redux/actions'
import { EaseApp } from "luleiyu-agora-chat"
import { setTimeVSNowTime, changeTitle } from '../../utils/notification'

function silentModeRedux (type, data) {
  store.dispatch(setGlobalSilentMode({[type]: data}))
}

function refreshUserGroupStatus (params) {
  const { constacts, groups: { groupList } } = store.getState()
  const conversationList = []
  constacts.forEach(item => {
    conversationList.push({
      id: item,
      type: 'singleChat'
    })
  })
  groupList.forEach(item => {
    conversationList.push({
      id: item.groupid,
      type: 'groupChat'
    })
  })
  getSilentModeForConversations({conversationList}, params)
}

function refreshSilentModeStatus (data, payload) {
  const { muteDataObj } = store.getState()
  if (data.ignoreDuration && !setTimeVSNowTime(data, true)) {
    const collectObj= {}
    const collectObj1= {}
    for (let item in muteDataObj) {
      collectObj[item] = true
      collectObj1[item] = {
        muteFlag: true
      }
    }
    store.dispatch(setMuteDataObj(collectObj))
    EaseApp.changePresenceStatus(collectObj1)
    const { unread } = store.getState()
    for (let item in unread) {
      for (let val in unread[item]) {
        if (!unread[item][val]) {
          unread[item][val] = {
            realNum: 0,
            fakeNum: 0
          }
        }
        unread[item][val].fakeNum = 0
      }
    }
    console.log(unread, 'unread')
    store.dispatch(setUnread(unread))
    changeTitle()
  } else {
    refreshUserGroupStatus(payload)
  }
}

function setSilentModeAllFalse (data, payload) {
  const { myUserInfo: { agoraId } } = store.getState()
  silentModeRedux('global', { [agoraId]: data })
  refreshSilentModeStatus(data, payload)
}

// 设置当前登录用户的免打扰设置。
/**
 * 
 * @param {options: {paramType,remindType,duration,startTime,endTime}} object // 参数集合，paramType,remindType,duration,startTime,endTime
 * @returns
 */

export const setSilentModeForAll = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.setSilentModeForAll(payload).then(res => {
      payload.type = 'global'
      setSilentModeAllFalse(res.data, payload)
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 获取当前登录用户的免打扰设置。
/**
 * 
 * @param {} // 推送消息类型
 * @returns 
 */
export const getSilentModeForAll = () => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getSilentModeForAll().then(res => {
      const data = {
        type: res.data.type || 'ALL',
        ...res.data
      }
      setSilentModeAllFalse(data)
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 获取会话的免打扰设置。
/**
 * 
 * @param {conversationId} string // 会话id
 * @param {type} string // 会话类型
 * @returns 
 */
export const getSilentModeForConversation = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getSilentModeForConversation(payload).then(res => {
      console.log(res, 'publishNewPresence')
      refreshUserGroupStatus()
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 设置会话的免打扰。
/**
 * 
 * @param {conversationId} string // 会话id
 * @param {type} string // 会话类型
 * @param {options: {paramType,remindType,duration,startTime,endTime}} object // 参数集合，paramType,remindType,duration,startTime,endTime
 * @returns 
 */
export const setSilentModeForConversation = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.setSilentModeForConversation(payload).then(res => {
      console.log(res, 'publishNewPresence', payload)
      refreshUserGroupStatus(payload)
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 清除会话的离线推送提醒类型设置
/**
 * 
 * @param {conversationId} string // 会话id
 * @param {type} string // 会话类型
 * @returns 
 */
export const clearRemindTypeForConversation = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.clearRemindTypeForConversation(payload).then(res => {
      console.log(res, 'publishNewPresence')
      // const tempObj = {}
      // res.data.forEach(item => {
      //   tempObj[item.group] = item.value
      // })
      // store.dispatch(setMuteDataObj(tempObj))
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 批量获取指定会话的免打扰设置。
/**
 * 
 * @param {conversationList} array // 会话列表
 * @returns 
 */
export const getSilentModeForConversations = (payload, params = {type: '', options:{}}) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getSilentModeForConversations(payload).then(res => {
      const { globalSilentMode: { global }, myUserInfo: { agoraId }, unread } = store.getState()
      console.log(res, 'publishNewPresence')
      const data = res.data
      const tempData = {}
      if (payload.conversationList[0]?.flagType === 'threading') {
        payload.conversationList.forEach(item => {
          tempData[item.id] = data.group[item.id]
        })
      }
      if (Object.keys(data.user).length) {
        silentModeRedux('single', {...data.user})
      }
      if (Object.keys(tempData).length) {
        silentModeRedux('threading', {...tempData})
      } else {
        silentModeRedux('group', {...data.group})
      }
      const tempObj = {
        ...data.user,
        ...data.group
      }
      const collectObj = {}
      const collectObj1 = {}
      const {type, options: { duration }} = params
      console.log(params, global, tempObj, 'params, global, tempObj')
      for (let item in tempObj) {
        // 全局存在时间并时间没过期，单聊，群组存在时间并没过期，单聊，群组存在类型并为none
        if ((global[agoraId].ignoreDuration && !setTimeVSNowTime(global[agoraId], true)) || (tempObj[item].ignoreDuration && !setTimeVSNowTime(tempObj[item], true)) || (tempObj[item].type && tempObj[item].type === 'NONE') || ((!tempObj[item].type || (tempObj[item].type && tempObj[item].type === 'DEFAULT')) && global[agoraId].type === 'NONE')) {
          collectObj[item] = true
          collectObj1[item] = {
            muteFlag: true
          }
          console.log(item, 'tempObj=true')
          if (unread['singleChat'][item]) {
            unread['singleChat'][item].fakeNum = 0
          } else if (unread['groupChat'][item]) {
            unread['groupChat'][item].fakeNum = 0
          } else if (unread['chatRoom'][item]) {
            unread['chatRoom'][item].fakeNum = 0
          }
          console.log(unread, 'unread')
          store.dispatch(setUnread(unread))
        } else {
          console.log(item, 'tempObj=false')
          // 全局没时间或时间过期，单聊，群组没时间或时间过期，单聊，群组没类型或类型不是none,全局类型，总而言之，就是只考虑类型了。
          // if (tempObj[item].type === 'ALL' || ((!tempObj[item].type || tempObj[item].type === 'DEFAULT') && (global.type === 'DEFAULT' || global.type === 'ALL'))) {
          //   collectObj[item] = false
          //   collectObj1[item] = {
          //     muteFlag: false
          //   }
          // } else if (tempObj[item].type === 'AT') {

          // } else {

          // }
          collectObj[item] = false
          collectObj1[item] = {
            muteFlag: false
          }
          if (unread['singleChat'][item]) {
            unread['singleChat'][item].fakeNum = unread['singleChat'][item].realNum
          } else if (unread['groupChat'][item]) {
            unread['groupChat'][item].fakeNum = unread['groupChat'][item].realNum
          } else if (unread['chatRoom'][item]) {
            unread['chatRoom'][item].fakeNum = unread['chatRoom'][item].realNum
          }
          console.log(unread, 'unread')
          store.dispatch(setUnread(unread))
        }
      }
      changeTitle()
      store.dispatch(setMuteDataObj(collectObj))
      EaseApp.changePresenceStatus(collectObj1)
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 设置用户推送翻译语言。
/**
 * 
 * @param {language} string // 语言
 * @returns 
 */
export const setPushPerformLanguage = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.setPushPerformLanguage(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

// 获取用户设置的推送翻译语言。
/**
 * @param 无
 */
export const getPushPerformLanguage = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getPushPerformLanguage(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}