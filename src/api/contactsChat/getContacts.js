import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { message } from "../../components/common/alert";
import i18next from "i18next";
import { contactsAciton, setBlackList, updateRequestStatus, searchLoadAction } from '../../redux/actions'
import { subFriendStatus } from '../presence/index'

const getContacts = () => {
    WebIM.conn.getRoster().then((res) => {
        const payload = {
            usernames: res.data
        }
        subFriendStatus(payload)
        store.dispatch(contactsAciton(res.data))
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

export const removeFromBlackList = (userId) => {
    WebIM.conn.removeFromBlackList({
        name: [userId]
    });
    let { blackList } = store.getState()
    blackList = blackList.filter((v) => v !== userId)
    store.dispatch(setBlackList(blackList))
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
    store.dispatch(updateRequestStatus({ type: 'contact', name: userId, status: 'accepted' }))
    let { constacts } = store.getState()
    let newContacts = [...constacts, userId]
    store.dispatch(contactsAciton(newContacts))
}

export const declineContactRequest = (userId) => {
    WebIM.conn.declineInvitation(userId)
    store.dispatch(updateRequestStatus({ type: 'contact', name: userId, status: 'ignored' }))
}

export default getContacts;
