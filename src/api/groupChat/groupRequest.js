import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { updateRequestStatus } from '../../redux/actions'
export const declineGroupRequest = (userId, groupId) => {
    let options = {
        applicant: userId,
        groupId: groupId
    };
    WebIM.conn.rejectJoinGroup(options)
    store.dispatch(updateRequestStatus({ type: 'group', name: userId, groupId: groupId, status: 'ignored' }))
}

export const acceptGroupRequest = (userId, groupId) => {
    let options = {
        applicant: userId,
        groupId: groupId
    };
    WebIM.conn.agreeJoinGroup(options)
    store.dispatch(updateRequestStatus({ type: 'group', name: userId, groupId: groupId, status: 'accepted' }))
}