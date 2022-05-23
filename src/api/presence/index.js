import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setPresenceList } from '../../redux/actions'

export const publishNewPresence = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.publishPresence(payload).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export const getAllFriendsStatus = (payload) => {
  WebIM.conn.getSubscribedPresenceList(payload).then(res => {
  });
}

export const subFriendStatus = (payload) => {
  payload.expiry = 10000000
  return new Promise((resolve) => {
    WebIM.conn.subscribePresence(payload).then(res => {
      const tempArr = []
      res.result.forEach(item => {
        let extFlag = false
        Object.values(item.status).forEach(val => {
          if (Number(val) === 1) {
            extFlag = true
          }
        })
        if (!extFlag) {
          item.ext = 'Offline'
        }
        if (item.uid) {
          tempArr.push(item.uid)
        }
      })
      const notInNames = []
      payload.usernames.forEach(val => {
        if (!tempArr.includes(val)) {
          notInNames.push(val)
        }
      })
      res.result.forEach(item => {
        if (!item.uid) {
          item.uid = notInNames.shift()
        }
      })
      store.dispatch(setPresenceList(res.result))
      resolve(res.result)
    })
  })
}

export const unsubFriendStatus = (payload) => {
  WebIM.conn.unsubscribePresence(payload).then(res => {
  });
}

export const getSubPresence = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getPresenceStatus(payload).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

