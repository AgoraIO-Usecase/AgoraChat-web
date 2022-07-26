import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setMuteDataObj, setGlobalSilentMode, setUnread } from '../../redux/actions'
import { EaseApp } from "agora-chat-uikit"
import { setTimeVSNowTime, changeTitle } from '../../utils/notification'

function silentModeRedux(type, data) {
  store.dispatch(setGlobalSilentMode({ [type]: data }))
}

function refreshUserGroupStatus(params) {
  const { constacts, groups: { groupList }, thread: { threadId } } = store.getState()
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
  if (threadId || params?.flag === 'Thread') {
    conversationList.unshift({
      id: threadId || params.conversationId,
      type: 'groupChat',
      flagType: 'threading'
    })
  }
  getSilentModeForConversations({ conversationList }, params)
}

function refreshSilentModeStatus(data, payload) {
  const { muteDataObj } = store.getState()
  if (data.ignoreDuration && !setTimeVSNowTime(data, true)) {
    const collectObj = {}
    const collectObj1 = {}
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
    store.dispatch(setUnread(unread))
    changeTitle()
  } else {
    refreshUserGroupStatus(payload)
  }
}

function setSilentModeAllFalse(data, payload) {
  const { myUserInfo: { agoraId } } = store.getState()
  silentModeRedux('global', { [agoraId]: data })
  refreshSilentModeStatus(data, payload)
}

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

export const getSilentModeForConversation = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getSilentModeForConversation(payload).then(res => {
      refreshUserGroupStatus(payload)
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const setSilentModeForConversation = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.setSilentModeForConversation(payload).then(res => {
      refreshUserGroupStatus(payload)
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const clearRemindTypeForConversation = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.clearRemindTypeForConversation(payload).then(res => {
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

export const getSilentModeForConversations = (payload, params = { type: '', options: {} }) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getSilentModeForConversations(payload).then(res => {
      const { globalSilentMode: { global }, myUserInfo: { agoraId }, unread } = store.getState()
      const data = res.data
      const tempData = {}
      if (payload.conversationList[0]?.flagType === 'threading' && !payload.conversationList[1]?.flagType) {
        console.log(payload.conversationList, 'payload.conversationList')
        tempData[payload.conversationList[0].id] = data.group[payload.conversationList[0].id]
      } else if (payload.conversationList[1]?.flagType === 'threading') {
        payload.conversationList.forEach(item => {
          tempData[item.id] = data.group[item.id]
        })
      }
      if (Object.keys(data.user).length) {
        silentModeRedux('single', { ...data.user })
      }
      console.log(tempData, 'tempData')
      if (Object.keys(tempData).length) {
        silentModeRedux('threading', { ...tempData })
      } else {
        silentModeRedux('group', { ...data.group })
      }
      const tempObj = {
        ...data.user,
        ...data.group
      }
      const collectObj = {}
      const collectObj1 = {}
      // const {type, options: { duration }} = params
      for (let item in tempObj) {
        if ((global[agoraId].ignoreDuration && !setTimeVSNowTime(global[agoraId], true)) || (tempObj[item].ignoreDuration && !setTimeVSNowTime(tempObj[item], true)) || (tempObj[item].type && tempObj[item].type === 'NONE') || ((!tempObj[item].type || (tempObj[item].type && tempObj[item].type === 'DEFAULT')) && global[agoraId].type === 'NONE')) {
          collectObj[item] = true
          collectObj1[item] = {
            muteFlag: true
          }
          if (unread['singleChat'][item]) {
            unread['singleChat'][item].fakeNum = 0
          } else if (unread['groupChat'][item]) {
            unread['groupChat'][item].fakeNum = 0
          } else if (unread['chatRoom'][item]) {
            unread['chatRoom'][item].fakeNum = 0
          }
          store.dispatch(setUnread(unread))
        } else {
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

export const setPushPerformLanguage = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.setPushPerformLanguage(payload).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getPushPerformLanguage = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getPushPerformLanguage(payload).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}