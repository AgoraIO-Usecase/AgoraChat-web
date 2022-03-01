import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { contactsAciton, setBlackList, updateRequestStatus, searchLoadAction } from '../../redux/actions'
import { subFriendStatus } from '../presence/index'
const getContacts = () => {
    WebIM.conn.getRoster().then((res) => {
        subFriendStatus({usernames: res.data})
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

export const removeFromBlackList = (userId) => {
    WebIM.conn.removeFromBlackList({
        name: [userId]
    });
    let { blackList } = store.getState()
    blackList = blackList.filter((v) => v !== userId)
    store.dispatch(setBlackList(blackList))
}

export const deleteContact = (userId) => {
    WebIM.conn.deleteContact(userId);
    let { blackList } = store.getState()
    blackList = blackList.filter((v) => v !== userId)
    store.dispatch(setBlackList(blackList))
}

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
