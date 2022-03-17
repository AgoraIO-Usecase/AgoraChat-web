import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setPresenceList } from '../../redux/actions'

export const publishNewPresence = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.publishPresence(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

export const getAllFriendsStatus = (payload) => {
  WebIM.conn.getSubscribedPresenceList(payload).then(res => {
    console.log(res, 'getAllFriendsStatus');
  });
}

export const subFriendStatus = (payload) => {
  payload.expiry = 10000000
  return new Promise((resolve) => {
    WebIM.conn.subscribePresence(payload).then(res => {
      store.dispatch(setPresenceList(res.result))
      resolve(res.result)
    })
  })
}

export const unsubFriendStatus = (payload) => {
  WebIM.conn.unsubscribePresence(payload).then(res => {
    console.log(res, 'unsubFriendStatus');
  });
}

export const getSubPresence = (payload) => {
  console.log(payload, 'payload==getSubPresence')
  return new Promise((resolve, reject) => {
    WebIM.conn.getPresenceStatus(payload).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

