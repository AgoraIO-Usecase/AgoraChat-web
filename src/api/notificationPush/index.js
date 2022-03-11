import WebIM from '../../utils/WebIM'

// 用户推送免打扰
/**
 * 
 * @param {duration} number // 免打扰时长
 * @returns
 */
export const disablePushDuration = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.disablePushDuration(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

// 用户推送消息类型
/**
 * 
 * @param {type} string // 推送消息类型
 * @returns 
 */
export const updatePushRemindType = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.updatePushRemindType(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

// 群组推送免打扰
/**
 * 
 * @param {duration} number // 免打扰时长
 * @param {groupId} string // 群组id
 * @returns 
 */
 export const disableGroupPushDuration = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.disableGroupPushDuration(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

// 群组推送消息类型
/**
 * 
 * @param {type} string // 推送消息类型
 * @param {groupId} string // 群组id
 * @returns 
 */
 export const updateGRoupPushRemindType = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.updateGRoupPushRemindType(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

// 子区推送免打扰
/**
 * 
 * @param {duration} number // 免打扰时长
 * @param {groupId} string // 群组id
 * @param {threadId} string // 群组id
 * @returns 
 */
 export const disableThreadPushDuration = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.disableThreadPushDuration(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

// 子区推送消息类型
/**
 * 
 * @param {type} string // 推送消息类型
 * @param {groupId} string // 群组id
 * @param {threadId} string // 群组id
 * @returns 
 */
 export const updateThreadPushRemindType = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.updateThreadPushRemindType(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}
