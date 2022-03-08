import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'

import WebIM from '../utils/WebIM';

import offlineImg from '../assets/Offline.png'
import onlineIcon from '../assets/Online.png'
import busyIcon from '../assets/Busy.png'
import donotdisturbIcon from '../assets/Do_not_Disturb.png'
import customIcon from '../assets/custom.png'
import leaveIcon from '../assets/leave.png'

/* ------------- Initial State ------------- */
export const INITIAL_STATE = Immutable({
  statusImg: onlineIcon,
  presenceList: []
})

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  changeImg: ['ext'],
  setPresenceList: ['presenceList'],
  publishNewPresence: (payload) => {
    return () => {
      WebIM.conn.publishPresence(payload)
      .then(res => {
        console.log(res)
      })
    }
  },
  getAllFriendsStatus: (payload) => {
    WebIM.conn.getSubscribedPresenceList(payload).then(res => {
      console.log(res, 'getAllFriendsStatus');
    });
  },
  subFriendStatus: (payload) => {
    payload.expiry = 10000000;
    return (dispatch) => {
      WebIM.conn.subscribePresence(payload).then(res => {
        console.log(res, 'res.result')
        let presenceList = res.result
        dispatch(Creators.setPresenceList(presenceList))
      });
    }
  },
  unsubFriendStatus: (payload) => {
    WebIM.conn.unsubscribePresence(payload).then(res => {
      console.log(res, 'unsubFriendStatus');
    });
  },
  getSubPresence: (payload) => {
    return new Promise((resolve, reject) => {
      WebIM.conn.getPresenceStatus(payload).then(res => {
        resolve(res);
      });
    });
  }
})
export default Creators
/* ------------- Reducers ------------- */
export const changeImg = (state, { ext }) => {
  console.log(ext, 'ext')
  switch(ext){
    case 'Offline':
      // return state.setIn(['statusImg'], offlineImg);
      return state.merge({ statusImg: offlineImg })
    case 'Online':
    case '':
      return state.setIn(['statusImg'], onlineIcon);
    case 'Busy':
      return state.merge({ statusImg: busyIcon })
      // return state.setIn(['statusImg'], busyIcon);
    case 'Do not Disturb':
      return state.setIn(['statusImg'], donotdisturbIcon);
    case 'Leave':
      return state.setIn(['statusImg'], leaveIcon);
    default:
      return state.setIn(['statusImg'], customIcon);
  }
}

export const setPresenceList = (state, { presenceList }) => {
  return state.merge({ presenceList })
}

/* ------------- Hookup Reducers To Types ------------- */
export const presenceReducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_IMG]: changeImg,
  [Types.SET_PRESENCE_LIST]: setPresenceList
})

