import WebIM from './WebIM'
import getContacts, { getBlackList } from '../api/contactsChat/getContacts'
import getGroups from '../api/groupChat/getGroups'
import getPublicGroups from '../api/groupChat/getPublicGroups'
import { getSilentModeForAll } from '../api/notificationPush'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setRequests, setFetchingStatus, presenceStatusImg, setPresenceList, setUnread, setGlobalSilentMode } from '../redux/actions'
import { getToken } from '../api/loginChat'
import { agreeInviteGroup } from '../api/groupChat/addGroup'
import { getGroupMuted } from "../api/groupChat/groupMute";
import { getGroupWrite } from "../api/groupChat/groupWhite";
import getGroupInfo from '../api/groupChat/getGroupInfo'
import { notification, getLocalStorageData, playSound, randomNumber, setTimeVSNowTime, checkBrowerNotifyStatus, notifyMe } from './notification'
import { handlerThreadChangedMsg } from "../api/thread/index";

import i18next from "i18next";
import { message } from '../components/common/alert'
import { EaseApp } from "agora-chat-uikit"
function publicNotify(message, msgType, iconTitle = {}, body = 'You Have A New Message') {
    const { chatType, from, data, type, to, time, url } = message
    let { myUserInfo: { agoraId }, muteDataObj, globalSilentMode: { global, single, group, threading } } = store.getState()
    handlerNewMessage(message, true)
    if ((global[agoraId]?.ignoreDuration && !setTimeVSNowTime(global[agoraId], true))) {
        return
    }
    let sessionType = ''
    switch (type) {
        case 'chat':
        case 'singleChat':
            sessionType = 'singleChat'
            break
        case 'groupchat':
        case 'groupChat':
            sessionType = 'groupChat'
            break
        case 'chatroom':
        case 'chatRoom':
            sessionType = 'chatRoom'
            break
        default:
            break
    }
    console.log(group[to], threading[to], 'threading[to]')
    if (sessionType === 'groupChat' && !group[to]) {
        sessionType = 'threading'
        return
    }
    if (sessionType === 'singleChat' && ((single[from]?.ignoreDuration && !setTimeVSNowTime(single[from], true)) || (single[from]?.type && single[from]?.type === 'NONE') || (!single[from].type && global[agoraId].type === 'NONE'))) {
        return
    } else if (sessionType === 'groupChat' && ((group[to]?.ignoreDuration && !setTimeVSNowTime(group[to], true)) || (group[to]?.type && group[to]?.type === 'NONE') || (!group[to].type && global[agoraId].type === 'NONE'))) {
        return
    } else if (sessionType === 'threading' && ((threading[to]?.ignoreDuration && !setTimeVSNowTime(threading[to], true)) || (threading[to]?.type && threading[to]?.type === 'NONE') || (!threading[to].type && global[agoraId].type === 'NONE'))) {
        return
    }
    if ((sessionType === 'singleChat' && (!single[from].type || (single[from]?.type && single[from]?.type === 'DEFAULT'))) || (sessionType === 'groupChat' && (!group[to].type || (group[to]?.type && group[to]?.type === 'DEFAULT'))) || (sessionType === 'threading' && (!threading[to].type || (threading[to]?.type && threading[to]?.type === 'DEFAULT')))) {
        if (global[agoraId]?.type && global[agoraId].type === 'NONE') {
            return
        } else if (global[agoraId]?.type && global[agoraId].type === 'AT') {
            if (sessionType === 'singleChat') {
                return
            } else {
                if (!(new RegExp('^\@' + agoraId).test(data))) {
                    return
                }
            }
        }
    }
    if ((sessionType === 'groupChat' && group[to]?.type && group[to]?.type === 'AT') || (sessionType === 'threading' && threading[to]?.type && threading[to]?.type === 'AT')) {
        if (!(new RegExp('^\@' + agoraId).test(data))) {
            return
        }
    }
    handlerNewMessage(message, false)
    body = `You Have A New Message🀧sessionType=${sessionType}&sessionId=${from}`
    if (getLocalStorageData().previewText) {
        switch (msgType) {
            case 'text':
                body = `${from}: ${data}`
                break
            case 'img':
                body = `${from}: A Image Message?sessionType=${sessionType}&sessionId=${from}`
                break
            case 'file':
                body = `${from}: A File Message?sessionType=${sessionType}&sessionId=${from}`
                break
            case 'audio':
                body = `${from}: A Audio Message?sessionType=${sessionType}&sessionId=${from}`
                break
            case 'video':
                body = `${from}: A Video Message?sessionType=${sessionType}&sessionId=${from}`
                break
            default:
                break
        }

    }

    if (getLocalStorageData().sound) {
        playSound()
    }
    notifyMe({ body, tag: time + Math.random().toString(), icon: url }, iconTitle)
}
function handlerNewMessage(message, realFlag) {
    const { type, from, to } = message
    const { unread, currentSessionId } = store.getState()
    let sessionType = ''
    switch (type) {
        case 'chat':
        case 'singleChat':
            sessionType = 'singleChat'
            break
        case 'groupchat':
        case 'groupChat':
            sessionType = 'groupChat'
            break
        case 'chatroom':
        case 'chatRoom':
            sessionType = 'chatRoom'
            break
        default:
            break
    }
    let id = ''
    if (sessionType === 'singleChat') {
        id = from
    } else {
        id = to
    }
    if (id === currentSessionId) {
        return
    }
    if (!unread[sessionType][id]) {
        unread[sessionType][id] = {
            realNum: 0,
            fakeNum: 0
        }
    }
    const tempObj = {
        [sessionType]: {
            [id]: {
                realNum: realFlag ? ++unread[sessionType][id].realNum : unread[sessionType][id].realNum,
                fakeNum: !realFlag ? ++unread[sessionType][id].fakeNum : unread[sessionType][id].fakeNum,
            }
        }
    }
    store.dispatch(setUnread(tempObj))
}
const history = createHashHistory()
const initListen = () => {
    WebIM.conn.listen({
        onOpened: () => {
            history.push('/main')
            getSilentModeForAll().finally(res => {
                getContacts();
                // getGroups();
            })
            getPublicGroups();
            getBlackList()
            store.dispatch(setFetchingStatus(false))
        },
        onClosed: () => {
            store.dispatch(setFetchingStatus(false))
            history.push('/login')
        },
        onError: (err) => {
            console.log('onError>>>', err);
        },
        onPresence: (event) => {
            console.log('onPresence>>>', event);
            const { type } = event;
            switch (type) {
                case 'subscribed':
                    getContacts();
                    break;
                case 'unsubscribed':
                    getContacts();
                    break;
                case 'joinPublicGroupSuccess':
                case 'direct_joined':
                    getGroups();
                    break;
                case 'invite':
                    agreeInviteGroup(event)
                    // if (getLocalStorageData().sound) {
                    //     playSound()
                    // }
                    // notification({body: 'Have A Group Invite', tag: randomNumber()}, {title: 'agora chat'})
                    break;
                case 'removedFromGroup':
                    message.info(`${i18next.t('You have been removed from the group:')}` + event.gid);
                    getGroups()
                    break;
                default:
                    break;
            }
        },
        onContactInvited: (msg) => {
            console.log('onContactInvited', msg)
        },

        onPresenceStatusChange: function (message) {
            let { myUserInfo, presenceList } = store.getState()
            message.forEach(item => {
                if (myUserInfo.agoraId !== item.userId) {
                    presenceList = JSON.parse(JSON.stringify(presenceList))
                    const tempArr = []
                    const obj = {}
                    let extFlag = false
                    let device = ''
                    item.statusDetails.forEach(val => {
                        if (val.status === 1) {
                            extFlag = true
                            device = val.device.includes('webim') ? 'Web' : 'Mobile'
                        }
                        obj[val.device] = val.status.toString()
                    })
                    if (!device) {
                        device = item.statusDetails.length ? (item.statusDetails[0].device.includes('webim') ? 'Web' : 'Mobile') : ''
                    }
                    if (!extFlag) {
                        item.ext = 'Offline'
                    }
                    tempArr.push({
                        expiry: item.expire,
                        ext: item.ext,
                        last_time: item.lastTime,
                        uid: item.userId,
                        status: obj,
                        device
                    })
                    if (presenceList.findIndex(val => val.uid === item.userId) !== -1) {
                        presenceList.forEach(val => {
                            if (val.uid === item.userId) {
                                val.ext = item.ext
                            }
                        })
                    } else {
                        presenceList.concat(tempArr)
                    }
                    const newArr = presenceList
                    store.dispatch(setPresenceList(newArr))
                    EaseApp.changePresenceStatus({
                        [item.userId]: {
                            ext: item.ext,
                            device
                        }
                    })
                }
                else {
                    store.dispatch(presenceStatusImg(item.ext))
                }
            })
        },
        onTextMessage: (message) => {
            console.log("onTextMessage", message);
            publicNotify(message, 'text')
        },
        onFileMessage: (message) => {
            console.log("onFileMessage", message);
            publicNotify(message, 'file')
        },
        onImageMessage: (message) => {
            console.log("onImageMessage", message);
            publicNotify(message, 'img')
        },

        onAudioMessage: (message) => {
            console.log("onAudioMessage", message);
            publicNotify(message, 'audio')
        },
        onVideoMessage: (message) => {
            console.log("onVideoMessage", message);
            publicNotify(message, 'video')
        },
    })

    WebIM.conn.addEventHandler('REQUESTS', {
        onContactInvited: (msg) => {
            console.log('onContactInvited', msg)
            let { requests } = store.getState()
            let contactRequests = requests.contact
            let data = {
                name: msg.from,
                status: 'pending',
                time: Date.now()
            }
            contactRequests.unshift(data)
            let newRequests = { ...requests, contact: contactRequests }
            store.dispatch(setRequests(newRequests))
            // if (getLocalStorageData().sound) {
            //     playSound()
            // }
            // notification({body: 'Have A New Friend Want To Be Your Friend', tag: randomNumber()}, {title: 'agora chat'})
        },
        onGroupChange: (msg) => {
            console.log('onGroupChange', msg)
            if (msg.type === 'joinGroupNotifications') {
                let { requests } = store.getState()
                let groupRequests = requests.group
                let data = {
                    name: msg.from,
                    groupId: msg.gid,
                    status: 'pending',
                    time: Date.now()
                }
                let index = groupRequests.findIndex((value) => {
                    if (value.name === data.name && value.groupId === data.groupId) {
                        return true
                    }
                })
                if (index > -1) {
                    groupRequests[index] = data
                } else {
                    groupRequests.unshift(data)
                }
                // groupRequests.unshift(data)
                let newRequests = { ...requests, group: [...groupRequests] }
                store.dispatch(setRequests(newRequests))
            } else if (msg.type === "addMute") {
                getGroupMuted(msg.gid);
            } else if (msg.type === "removeMute") {
                getGroupMuted(msg.gid);
            } else if (msg.type === "addUserToGroupWhiteList") {
                getGroupWrite(msg.gid);
            } else if (msg.type === "rmUserFromGroupWhiteList") {
                getGroupWrite(msg.gid);
            } else if (msg.type === "update") {
                getGroupInfo(msg.gid)
            } else if (msg.type === 'leave' || msg.type === 'leaveGroup' || msg.type === 'deleteGroupChat') {
                // EaseApp.deleteSessionAndMessage({})
                getGroups();
            } else if (msg.type === 'removedFromGroup') {
                EaseApp.deleteSessionAndMessage({ sessionType: 'groupChat', sessionId: msg.gid })
                getGroups();
            }
            // checkBrowerNotifyStatus(false)
        },
    });

    WebIM.conn.addEventHandler("TOKENSTATUS", {
        onTokenWillExpire: (token) => {
            let { myUserInfo } = store.getState();
            getToken(myUserInfo.agoraId, myUserInfo.password).then((res) => {
                const { accessToken } = res;
                WebIM.conn.renewToken(accessToken);
                const authData = sessionStorage.getItem("webim_auth");
                const webim_auth = authData && JSON.parse(authData);
                webim_auth.accessToken = accessToken;
                sessionStorage.setItem(
                    "webim_auth",
                    JSON.stringify(webim_auth)
                );
            });
        },
        onTokenExpired: () => {
            console.error("onTokenExpired");
        },
        onConnected: () => {
            console.log("onConnected");
        },
        onDisconnected: () => {
            console.log("onDisconnected");
        },
    });

    WebIM.conn.addEventHandler("Thread", {
        onMultiDeviceEvent: (message) => {
            handlerThreadChangedMsg(message)
        }
    })
};

export default initListen;
