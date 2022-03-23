import WebIM from '../../utils/WebIM'

// 设置用户免打扰
/**
 * 
 * @param {duration} number // 免打扰时长
 * @returns
 */
export const setNotDisturbDuration = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.setNotDisturbDuration(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

// 获取用户免打扰
/**
 * 
 * @param {type} string // 推送消息类型
 * @returns 
 */
export const getNotDisturbDuration = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getNotDisturbDuration(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
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
 export const getNotDisturbDurationByLimit = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getNotDisturbDurationByLimit(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
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
 export const setNotDisturbGroupDuration = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.setNotDisturbGroupDuration(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
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
 export const getNotDisturbGroupDuration = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getNotDisturbGroupDuration(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
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
 export const getNotDisturbGroupDurationByLimit = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getNotDisturbGroupDurationByLimit(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}
