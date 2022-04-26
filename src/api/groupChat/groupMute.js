
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { groupMuteAction } from '../../redux/actions'

export const getGroupMuted = (groupId, type) => {
    let options = {
        groupId: groupId
    };
    WebIM.conn.getMuted(options).then((res) => {
        console.log(res)
        let data = res.data || []
        store.dispatch(groupMuteAction(data, { type: type }))
    })
}

export const onChangeGroipMute = (groupId, userName, type,onClose) => {
    let options = {
        username: userName,
        muteDuration: 886400000,
        groupId: groupId
    };
    if (type === 'make') {
        WebIM.conn.mute(options).then((res) => {
            console.log('make mute success>>>', res)
            getGroupMuted(groupId, type)
        })
    } else if (type === 'move') {
        WebIM.conn.removeMute(options).then((res) => {
            console.log('move mute success>>>', res)
            getGroupMuted(groupId, type)
        })
    }
    onClose && onClose();
}

