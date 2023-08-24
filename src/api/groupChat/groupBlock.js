
import store from '../../redux/store'
import { groupBlockAction } from '../../redux/actions'
import getGroupInfo from './getGroupInfo'
import { rootStore } from 'chatuim2'
export const getGroupBlock = (groupId) => {
    let option = {
        groupId: groupId
    };
    rootStore.client.getGroupBlacklistNew(option).then((res) => {
        store.dispatch(groupBlockAction(res.data));
        getGroupInfo(groupId, 'block')
    })
}

export const onChangeGroupBlock = (groupId, userName, type, onClose) => {
    let options = {
        groupId: groupId,
        username: userName
    };
    if (type === "move") {
        rootStore.client.removeGroupBlockSingle(options).then((res) => {
            getGroupBlock(groupId)
        })
    } else if (type === "make") {
        rootStore.client.groupBlockSingle(options).then((res) => {
            getGroupBlock(groupId)
        })
    }
    onClose && onClose();
}
