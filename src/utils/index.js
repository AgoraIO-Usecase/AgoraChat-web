import _ from 'lodash'
import avatarIcon1 from '../assets/avatar1.jpg'
import avatarIcon2 from '../assets/avatar2.jpg'
import avatarIcon3 from '../assets/avatar3.jpg'
import avatarIcon4 from '../assets/avatar4.jpg'
import avatarIcon5 from '../assets/avatar5.jpg'
import avatarIcon6 from '../assets/avatar6.jpg'
import avatarIcon7 from '../assets/avatar7.jpg'
import avatarIcon11 from '../assets/avatar11.jpg'

let userAvatars = {
  1: avatarIcon1,
  2: avatarIcon2,
  3: avatarIcon3,
  4: avatarIcon4,
  5: avatarIcon5,
  6: avatarIcon6,
  7: avatarIcon7,
}
export function userAvatar (id) {
  let adminInfo = JSON.parse(sessionStorage.getItem('webim_auth'))
  if (adminInfo && adminInfo.agoraId === id) {
    let adminAvatar = Number(localStorage.getItem('avatarIndex_1.0'))
    return userAvatars[adminAvatar + 1] || avatarIcon11
  } else {
    let usersInfoData = localStorage.getItem("usersInfo_1.0")
    let avatarSrc = "";
    if (usersInfoData) {
      usersInfoData = JSON.parse(usersInfoData)
    }
    let findIndex =  _.find(usersInfoData, { username: id }) || ''
    avatarSrc = userAvatars[findIndex.userAvatar] || avatarIcon11
    return avatarSrc
  }
}