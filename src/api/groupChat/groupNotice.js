

import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { groupsNoticeAction } from '../../redux/actions'
export const updataGroupNotice = () => {
    let options = {
        groupId: 'groupId',
        announcement: 'announcement'
    };
    WebIM.conn.updateGroupAnnouncement(options).then((res) => {
        console.log(res)
    })
}

export const getGroupNotice = (groupId) => {
    let options = {
        groupId
    };
    WebIM.conn.fetchGroupAnnouncement(options).then((res) => {
        store.dispatch(groupsNoticeAction(res.data.announcement))
    })
}