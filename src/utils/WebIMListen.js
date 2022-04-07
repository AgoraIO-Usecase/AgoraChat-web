
import WebIM from './WebIM'
import getContacts, { getBlackList } from '../api/contactsChat/getContacts'
import getGroups from '../api/groupChat/getGroups'
import getPublicGroups from '../api/groupChat/getPublicGroups'
import { getSilentModeForAll } from '../api/notificationPush'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setRequests, setFetchingStatus, presenceStatusImg, setPresenceList, setUnread } from '../redux/actions'
import { getToken } from '../api/loginChat'
import { agreeInviteGroup } from '../api/groupChat/addGroup'
import { getGroupMuted } from "../api/groupChat/groupMute";
import { getGroupWrite } from "../api/groupChat/groupWhite";
import { notification, getLocalStorageData, playSound, randomNumber, setTimeVSNowTime, checkBrowerNotifyStatus } from './notification'

import i18next from "i18next";
import { message } from '../components/common/alert'

import { EaseApp } from "luleiyu-agora-chat"

function publicNotify (message, msgType, iconTitle = {}, body = 'You Have A New Message') {
    const { chatType, from, data, type, to, time, url} = message;
    let sessionType = ''
    switch (type) {
        case 'chat' || 'singleChat':
            sessionType = 'singleChat'
            break
        case 'groupchat' || 'groupChat':
            sessionType = 'groupChat'
            break
        case 'chatroom' || 'chatRoom':
            sessionType = 'chatRoom'
            break
        default:
            break
    }
    body = `You Have A New Message?sessionType=${sessionType}&sessionId=${from}`
    let { myUserInfo: { agoraId }, muteDataObj, globalSilentMode: { global, single, group, threading } } = store.getState()
    if (getLocalStorageData().previewText) {
        switch(msgType){
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
    // 这是 没有设置勿扰时间，或者勿扰时间过期，或者勿扰类型不是none
    if ((global[agoraId]?.ignoreDuration && !setTimeVSNowTime(global[agoraId], true)) || global[agoraId]?.type !== 'NONE') {
        // 进来判断，说明可以消息提示，区分单聊或群组或其他
        // 如果单聊设置了勿扰时间那就不提示
        if (sessionType === 'singleChat' && single[from]?.ignoreDuration && !setTimeVSNowTime(single[from], true)) {
            return
        } else if (sessionType === 'groupChat' && group[to]?.ignoreDuration && !setTimeVSNowTime(group[to], true)) {
            return
        } else if (sessionType === 'threading' && threading[to]?.ignoreDuration && !setTimeVSNowTime(threading[to], true)) {
            return
        }
        if (!muteDataObj[from]) {
            if (getLocalStorageData().sound) {
                playSound()
            }
            notification({body, tag: time + Math.random().toString(), icon: url}, iconTitle)
        }
    }
}
function handlerNewMessage (message) {
    const { type, from } = message
    const { unread } = store.getState()
    let sessionType = ''
    switch (type) {
        case 'chat' || 'singleChat':
            sessionType = 'singleChat'
            break
        case 'groupchat' || 'groupChat':
            sessionType = 'groupChat'
            break
        case 'chatroom' || 'chatRoom':
            sessionType = 'chatRoom'
            break
        default:
            break
    }
    const tempObj = {
        [sessionType]: {
            [from]: unread[sessionType][from] ? unread[sessionType][from]++ : 0
        }
    }
    store.dispatch(setUnread(tempObj))
    return {
        title: tempObj[sessionType][from] === 0 ? 'agora chat' : `${tempObj[sessionType][from]}new message`
    }
}
const history = createHashHistory()
const initListen = () => {
    WebIM.conn.listen({
        onOpened: () => {
            getSilentModeForAll().finally(res => {
                getContacts();
                getGroups();
            })
            getPublicGroups();
            getBlackList()
            history.push('/main')
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
                    if (getLocalStorageData().sound) {
                        playSound()
                    }
                    notification({body: 'Have A New Friend Agree Your Invite', tag: randomNumber()}, {title: 'agora chat'})
                    break;
                case 'joinPublicGroupSuccess':
                    getGroups();
                    break;
                case 'invite': 
                    agreeInviteGroup(event)
                    if (getLocalStorageData().sound) {
                        playSound()
                    }
                    notification({body: 'Have A Group Invite', tag: randomNumber()}, {title: 'agora chat'})
                    break;
                case 'removedFromGroup':
                    message.info(`${i18next.t('You have been removed from the group:')}` + event.gid)
                    break;
                default:
                    break;
            }
        },
        onContactInvited: (msg) => {
            console.log('onContactInvited', msg)
        },

        onTokenWillExpire: () => {
            let { myUserInfo } = store.getState()
            getToken(myUserInfo.agoraId, myUserInfo.nickName).then((res) => {
                const { accessToken } = res
                WebIM.conn.renewToken(accessToken)
                console.log('reset token success')
            })
        },
        onPresenceStatusChange: function(message){
            let { myUserInfo, presenceList } = store.getState()
            console.log('onPresenceStatusChange', message, myUserInfo.agoraId, myUserInfo.nickName)
            message.forEach(item => {
                if(myUserInfo.agoraId !== item.userId){
                    presenceList = JSON.parse(JSON.stringify(presenceList))
                    const tempArr = []
                    const obj = {}
                    let extFlag = false
                    item.statusDetails.forEach(val => {
                        if (val.status === 1) {
                            extFlag = true
                        }
                        obj[val.device] = val.status.toString()
                    })
                    if (!extFlag) {
                        item.ext = 'Offline'
                    }
                    tempArr.push({
                        expiry: item.expire,
                        ext: item.ext,
                        last_time: item.lastTime,
                        uid: item.userId,
                        status: obj
                    })
                    if (presenceList.findIndex(val => val.uid === item.userId) !== -1) {
                        presenceList.forEach(val => {
                            if (val.uid === item.userId) {
                                val.ext = item.ext
                            }
                        })
                    } else {
                        presenceList.contact(tempArr)
                    }
                    console.log(presenceList, 'onPresenceStatusChange=presenceList')
                    const newArr = presenceList
                    store.dispatch(setPresenceList(newArr))
                    EaseApp.changePresenceStatus({[item.userId]: {
                        ext: item.ext
                    }})
                }
                else{
                    store.dispatch(presenceStatusImg(item.ext))
                }
            })
        },
        onTextMessage: (message) => {
            console.log("onTextMessage==agora-chat", message);
            let { myUserInfo: { agoraId } } = store.getState()
            const { data, from, to, type } = message
            const { globalSilentMode: { global, single, group, threading } } = store.getState()
            console.log(global[agoraId], single, group, threading)
            if (global[agoraId]?.type && global[agoraId].type === 'AT') {
                if (type === 'chat' || type === 'singleChat') {
                    return
                } else {
                    if (group[to]?.type === 'ALL' || threading[to]?.type === 'ALL') {
                        const iconTitle = handlerNewMessage(message)
                        publicNotify(message, 'text', iconTitle)
                        return
                    } else if (group[to]?.type === 'AT' || group[to]?.type === 'DEFAULT' || threading[to]?.type === 'DEFAULT' || threading[to]?.type === 'AT') {
                        // 不是none,也不是all的类型，那就是default，at
                        if (new RegExp('^\@' + agoraId).test(data)) {
                            const iconTitle = handlerNewMessage(message)
                            publicNotify(message, 'text', iconTitle)
                            return
                        }
                    }
                }
            } else if (global[agoraId]?.type && global[agoraId].type === 'ALL') {
                console.log(group[to], group[to]?.type, 'group[to]')
                if (group[to]?.type === 'AT' || threading[to]?.type === 'AT') {
                    if (new RegExp('^\@' + agoraId).test(data)) {
                        const iconTitle = handlerNewMessage(message)
                        publicNotify(message, 'text', iconTitle)
                        return
                    }
                } else if (group[to]?.type === 'ALL' || group[to]?.type === 'DEFAULT' || threading[to]?.type === 'DEFAULT' || threading[to]?.type === 'ALL') {
                    const iconTitle = handlerNewMessage(message)
                    publicNotify(message, 'text', iconTitle)
                } else {
                    if (group[to]?.type !== 'NONE' || type === 'chat' || type === 'singleChat') {
                        const iconTitle = handlerNewMessage(message)
                        publicNotify(message, 'text', iconTitle)
                    }
                }
            } else if (global[agoraId]?.type !== 'NONE') {
                const iconTitle = handlerNewMessage(message)
                publicNotify(message, 'text', iconTitle)
            }
        },
        onFileMessage: (message) => {
            console.log("onFileMessage", message);
            const iconTitle = handlerNewMessage(message)
            publicNotify(message, 'file', iconTitle)
        },
        onImageMessage: (message) => {
            console.log("onImageMessage", message);
            const iconTitle = handlerNewMessage(message)
            publicNotify(message, 'img', iconTitle)
        },
    
        onAudioMessage: (message) => {
            console.log("onAudioMessage", message);
            const iconTitle = handlerNewMessage(message)
            publicNotify(message, 'audio', iconTitle)
        },
        onVideoMessage: (message) => {
            console.log("onVideoMessage", message);
            const iconTitle = handlerNewMessage(message)
            publicNotify(message, 'video', iconTitle)
        },
    })

    WebIM.conn.addEventHandler('REQUESTS', {
        onContactInvited: (msg) => {
            console.log('onContactInvited', msg)
            let { requests } = store.getState()
            let contactRequests = requests.contact
            let data = {
                name: msg.from,
                status: 'pedding',
                time: Date.now()
            }
            contactRequests.unshift(data)
            let newRequests = { ...requests, contact: contactRequests }
            store.dispatch(setRequests(newRequests))
            checkBrowerNotifyStatus(false)
        },
        onGroupChange: (msg) => {
            console.log('onGroupChange', msg)
            if (msg.type === 'joinGroupNotifications') {
                let { requests } = store.getState()
                let groupRequests = requests.group
                let data = {
                    name: msg.from,
                    groupId: msg.gid,
                    status: 'pedding',
                    time: Date.now()
                }
                let index = groupRequests.findIndex((value) => {
                    if (value.name === data.name && value.groupId === data.groupId){
                        return true
                    }
                })
                if (index > -1){
                    groupRequests[index] = data
                }else{
                    groupRequests.unshift(data)
                }
                // groupRequests.unshift(data)
                let newRequests = { ...requests, group: [...groupRequests] }
                store.dispatch(setRequests(newRequests))
            }else if (msg.type === "addMute") {
                getGroupMuted(msg.gid);
			}else if (msg.type ===  "removeMute") {
				getGroupMuted(msg.gid);
			}else if (msg.type === "addUserToGroupWhiteList") {
                getGroupWrite(msg.gid);
			}else if (msg.type === "rmUserFromGroupWhiteList") {
                getGroupWrite(msg.gid);
			}
            checkBrowerNotifyStatus(false)
        }
    })

    WebIM.conn.addEventHandler('TOKENSTATUS', {
        onTokenWillExpire: (token) => {
            let { myUserInfo } = store.getState()
            getToken(myUserInfo.agoraId, myUserInfo.nickName).then((res) => {
                const { accessToken } = res
                WebIM.conn.renewToken(accessToken)
                const authData = sessionStorage.getItem('webim_auth')
                const webim_auth = authData && JSON.parse(authData)
                webim_auth.accessToken = accessToken
                sessionStorage.setItem('webim_auth', JSON.stringify(webim_auth))
            })
        },
        onTokenExpired: () => {
            console.error('onTokenExpired')
        },
        onConnected: () => {
            console.log('onConnected')
        },
        onDisconnected: () => {
            console.log('onDisconnected')
        }
    })
}

export default initListen;