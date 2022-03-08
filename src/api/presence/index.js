import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setPresenceList } from '../../redux/actions'

export const publishNewPresence = (payload) => {
  WebIM.conn.publishPresence(payload)
  .then(res => {
    console.log(res)
  })
}

export const getAllFriendsStatus = (payload) => {
  WebIM.conn.getSubscribedPresenceList(payload).then(res => {
    console.log(res, 'getAllFriendsStatus');
  });
}

export const subFriendStatus = (payload) => {
  payload.expiry = 10000000
  WebIM.conn.subscribePresence(payload).then(res => {
    store.dispatch(setPresenceList(res.result))
  })
}

export const  unsubFriendStatus = (payload) => {
  WebIM.conn.unsubscribePresence(payload).then(res => {
    console.log(res, 'unsubFriendStatus');
  });
}

export const  getSubPresence = (payload) => {
  WebIM.conn.getPresenceStatus(payload).then(res => {
    
  })
}

