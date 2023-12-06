
import getGroups from './getGroups'
import { message } from '../../components/common/alert'
import i18next from "i18next";
import { rootStore } from 'agora-chat-uikit'
import store from '../../redux/store';
import { updateRequestStatus } from '../../redux/actions';
import { includes } from 'lodash';
export const addGroup = (groupId) => {
    let options = {
        groupId: groupId,
        message: "I am Tom"
    };
    rootStore.client.joinGroup(options).then((res) => {
        message.success(`${i18next.t('addGroup succes')}`)
        getGroups();
    }).catch((err) => {
        console.log('err', err)
        if (err.type === 605) {
            message.error(`${i18next.t("Group does not exist")}`);
        } else if (err.type === 603 && err.data.includes('blacklist')) {
            message.error("You've been blocklisted")
        } else {
            message.error(err?.message)
        }
    })
}

export const agreeInviteGroup = (val) => {
    const { to, gid, from } = val
    let options = {
        invitee: to,
        groupId: gid
    };
    rootStore.client.agreeInviteIntoGroup(options).then((res) => {
        console.log('agreeInvite>>>', res);
        message.success(`${i18next.t('You have joined the group：')}` + gid)
        getGroups();

        store.dispatch(updateRequestStatus({ type: 'group', name: from, groupId: gid, status: 'accepted' }))

    })
}

export const rejectInviteGroup = (val) => {
    const { to, gid, from } = val
    let options = {
        invitee: to,
        groupId: gid
    };
    rootStore.client.rejectInviteIntoGroup(options).then((res) => {
        store.dispatch(updateRequestStatus({ type: 'group', name: from, groupId: gid, status: 'ignored' }))
    })
}