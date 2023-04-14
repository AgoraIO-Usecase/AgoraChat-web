
import WebIM from '../../utils/WebIM'
import getGroups from './getGroups'
import { message } from '../../components/common/alert'
import i18next from "i18next";
import { Chat, ConversationList, RootProvider, rootStore } from 'chatuim2'
export const addGroup = (groupId) => {
    let options = {
        groupId: groupId,
        message: "I am Tom"
    };
    rootStore.client.joinGroup(options).then((res) => {
        console.log('joinGroup>>>', res)
        message.success(`${i18next.t('addGroup succes')}`)
        getGroups();
    }).catch((err) => {
        if (err.type === 605) {
            message.error(`${i18next.t("Group does not exist")}`);
        }
    })
}

export const agreeInviteGroup = (val) => {
    const { to, gid } = val
    let options = {
        invitee: to,
        groupId: gid
    };
    rootStore.client.agreeInviteIntoGroup(options).then((res) => {
        console.log('agreeInvite>>>', res);
        message.success(`${i18next.t('You have joined the group：')}` + gid)
        getGroups();
    })
}

// export const rejectInviteGroup = (val) => {
//     const { to, gid } = val
//     let options = {
//         invitee: to,
//         groupId: gid
//     };
//      rootStore.client.rejectInviteIntoGroup(options).then((res) => {
//         console.log('rejectInvite>>>', res);
//         message.success(`${i18next.t('已拒绝加入群组：')}` + gid)
//     })
// }