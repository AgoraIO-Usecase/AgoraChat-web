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