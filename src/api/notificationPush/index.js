import WebIM from '../../utils/WebIM'

// 设置用户免打扰
/**
 * 
 * @param {userId} number // 用户 id
 * @param {duration} number // 免打扰时长
 * @param {interval} number // 时间段
 * @param {type} number // 类型
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
 * @param {userId} string // 推送消息类型
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

// 批量获取用户免打扰
/**
 * 
 * @param {limit} number // 查询数量
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

// 设置群组免打扰
/**
 * 
 * @param {duration} number // 免打扰时长
 * @param {groupId} string // 群组id
 * @param {type} string // 类型
 * @param {interval} string // 时间段
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

// 获取群组免打扰
/**
 * 
 * @param {groupId} string // 群组id
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

// 批量获取群组免打扰
/**
 * 
 * @param {limit} number // 查询数量
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

// 批量获取用户和群组免打扰
/**
 * 
 * @param {usersId} string // 用户 id
 * @param {groupsId} string // 群组 id
 * @returns 
 */
export const getNotDisturbUserAndGroupDuration = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getNotDisturbUserAndGroupDuration(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

// 选择推送翻译语言
/**
 * 
 * @param {language} string // 语言
 * @returns 
 */
export const selectTranslationLanguage = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.selectTranslationLanguage(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}

// 批量推送翻译语言
/**
 * @param 无
 */
export const getTranslationLanguage = (payload) => {
  return new Promise((resolve, reject) => {
    WebIM.conn.getTranslationLanguage(payload).then(res => {
      console.log(res, 'publishNewPresence')
      resolve(res.data)
    }).catch(err => {
      console.log(err, 'publishNewPresence')
      reject(err)
    })
  })
}