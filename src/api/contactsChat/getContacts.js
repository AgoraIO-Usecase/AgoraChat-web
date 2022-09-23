import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { message } from "../../components/common/alert";
import i18next from "i18next";
import { contactsAction, setBlackList, updateRequestStatus, searchLoadAction } from '../../redux/actions'
import { subFriendStatus } from '../presence/index'
import { getSilentModeForConversations } from '../notificationPush/index'

import { EaseApp } from "agora-chat-uikit";
import { setMyUserInfo } from '../../redux/actions'

const getContacts = () => {
    WebIM.conn.getContacts().then((res) => {
        const payload = {
            usernames: res.data
        }
        if (payload.usernames.length) {
            subFriendStatus(payload)
        }
        const conversationList = []
        res.data.forEach(item => {
            conversationList.push({
                id: item,
                type: 'singleChat'
            })
        })
        getSilentModeForConversations({ conversationList })
        store.dispatch(contactsAction(res.data))
        store.dispatch(searchLoadAction(false))
    });
}

export const addContact = (userId, message) => {
    WebIM.conn.addContact(userId, message);
}

export const getBlackList = () => {
    WebIM.conn.getBlacklist().then((res) => {
        store.dispatch(setBlackList(res.data))
    })
}

export const addFromBlackList = (userId) => {
    let { blackList } = store.getState();
    if (blackList.includes(userId)) {
        message.warn(`${i18next.t("The user is in the blacklist")}`);
        return
    }
    WebIM.conn.addUsersToBlacklist({
        name: [userId],
    });
    blackList = blackList.concat(userId);
    store.dispatch(setBlackList(blackList));
}

export const removeFromBlackList = (userId, onClose) => {
    WebIM.conn.removeFromBlackList({
        name: [userId]
    });
    let { blackList } = store.getState()
    blackList = blackList.filter((v) => v !== userId)
    store.dispatch(setBlackList(blackList))
    onClose && onClose();
}

export const deleteContact = (userId, onClose) => {
    WebIM.conn.deleteContact(userId);
    let { blackList } = store.getState();
    blackList = blackList.filter((v) => v !== userId);
    store.dispatch(setBlackList(blackList));
    onClose && onClose();
};

export const acceptContactRequest = (userId) => {
    WebIM.conn.acceptInvitation(userId)
    // .then(()=>{
    //     let conversationItem = {
    //         conversationType: "singleChat",
    //         conversationId: userId,
    //     };
    //     EaseApp.addConversationItem(conversationItem);
    // })
    store.dispatch(updateRequestStatus({ type: 'contact', name: userId, status: 'accepted' }))
    let { constacts } = store.getState()
    let newContacts = [...constacts, userId]
    store.dispatch(contactsAction(newContacts))
}

export const declineContactRequest = (userId) => {
    WebIM.conn.declineInvitation(userId)
    store.dispatch(updateRequestStatus({ type: 'contact', name: userId, status: 'ignored' }))
}

export const editSelfInfoMessage = (obj) => {
    WebIM.conn.updateUserInfo(obj).then(val => {
        const res = val.data
        store.dispatch(setMyUserInfo({ nickName: res?.nickname || '' }))
    })
}

export default getContacts;
