import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setMuteDataObj, setGlobalSilentMode } from '../../redux/actions'
import { EaseApp } from "luleiyu-agora-chat"
import { setTimeVSNowTime } from '../../utils/notification'

function silentModeRedux (type, data) {
  store.dispatch(setGlobalSilentMode({[type]: data}))
}

function refreshSilentModeStatus (data) {
  const { muteDataObj, constacts, groups: { groupList } } = store.getState()  
  if ((data.ignoreDuration && !setTimeVSNowTime(data, true)) || data.type === 'NONE') {
    const collectObj= {}
    const collectObj1= {}
    for (let item in muteDataObj) {
      collectObj[item]= true
      collectObj1[item]= {
        muteFlag: true
      }
    }
    store.dispatch(setMuteDataObj(collectObj))
    EaseApp.changePresenceStatus(collectObj1)
  } else {
    if (data.type !== 'NONE') {
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
      getSilentModeForConversations({conversationList})
    }
  }
}

function setSilentModeAllFalse (data) {
  const { myUserInfo: { agoraId } } = store.getState()
  silentModeRedux('global', { [agoraId]: data })
  refreshSilentModeStatus(data)
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
      setSilentModeAllFalse(res.data)
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
      setSilentModeAllFalse(res.data)
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
      const data = res.data
      let type = payload.type
      if (type === 'singleChat') {
        type = 'single'
      } else if (type === 'groupChat') {
        type = 'group'
      } else if (type === 'threadingChat') {
        type = 'threading'
      }
      if (!data.type && (!data.ignoreDuration || setTimeVSNowTime(data, true))) {
        let { globalSilentMode: { global }, myUserInfo: { agoraId } } = store.getState()
        silentModeRedux(type, {[payload.conversationId]: global[agoraId]})
      } else {
        silentModeRedux(type, {[payload.conversationId]: res.data})
      }
      // const tempObj = {}
      // res.data.forEach(item => {
      //   tempObj[item.user] = item.value
      // })
      // store.dispatch(setMuteDataObj(tempObj))
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
      const data = res.data
      const groupId = payload.conversationId
      const collectObj= {}
      const collectObj1= {}
      if (data.ignoreDuration && !setTimeVSNowTime(data, true)) {
        collectObj[groupId] = true
        collectObj1[groupId] = {
          muteFlag: true
        }
      } else {
        collectObj[groupId] = false
        collectObj1[groupId] = {
          muteFlag: false
        }
      }
      console.log(collectObj, collectObj1, 'collectObj1', setTimeVSNowTime(data, true))
      store.dispatch(setMuteDataObj(collectObj))
      EaseApp.changePresenceStatus(collectObj1)
      let type = payload.type
      if (type === 'singleChat') {
        type = 'single'
      } else if (type === 'groupChat') {
        type = 'group'
      } else if (type === 'threadingChat') {
        type = 'threading'
      }
      silentModeRedux(type, {[payload.conversationId]: data})
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
export const getSilentModeForConversations = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getSilentModeForConversations(payload).then(res => {
      const { globalSilentMode: { global } } = store.getState()
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
      for (let item in tempObj) {
        if ((global.ignoreDuration && !setTimeVSNowTime(global, true)) || (global.type && global.type === 'NONE')) {
          collectObj[item]= true
          collectObj1[item]= {
            muteFlag: true
          }
        } else {
          if (tempObj[item].ignoreDuration || (data.type && data.type !== 'NONE')) {
            collectObj[item] = !setTimeVSNowTime(tempObj[item], true)
            collectObj1[item] = {
              muteFlag: !setTimeVSNowTime(tempObj[item], true)
            }
          } else {
            collectObj[item] = false
            collectObj1[item] = {
              muteFlag: false
            }
          }
        }
      }
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