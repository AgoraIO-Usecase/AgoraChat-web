
import WebIM from './WebIM'
import getContacts, { getBlackList } from '../api/contactsChat/getContacts'
import getGroups from '../api/groupChat/getGroups'
import getPublicGroups from '../api/groupChat/getPublicGroups'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setRequests, setFetchingStatus, presenceStatusImg, setPresenceList } from '../redux/actions'
import { getToken } from '../api/loginChat'
import { agreeInviteGroup } from '../api/groupChat/addGroup'
import { getGroupMuted } from "../api/groupChat/groupMute";
import { getGroupWrite } from "../api/groupChat/groupWhite";
import { getSubPresence, publishNewPresence } from "../api/presence/";

import i18next from "i18next";
import { message } from '../components/common/alert'

import { EaseApp } from "luleiyu-agora-chat"
const history = createHashHistory()
const initListen = () => {
    WebIM.conn.listen({
        onOpened: () => {
            let { myUserInfo } = store.getState()
            console.log(myUserInfo)
            getSubPresence({usernames: [myUserInfo.agoraId]}).then(res => {
                console.log(res, 'onOpened')
                if (res.result[0].ext === 'Offline') {
                    publishNewPresence({description: 'Online'})
                }
            })
            getContacts();
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
                    break;
                case 'joinPublicGroupSuccess':
                    getGroups();
                    break;
                case 'invite': 
                    agreeInviteGroup(event)
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
            if(myUserInfo.agoraId !== message[0].userId){
                const tempArr = []
                message.forEach(item => {
                    tempArr.push({
                        expiry: item.expire,
                        ext: item.ext,
                        last_time: item.lastTime,
                        status: item.statusDetails,
                        uid: item.userId
                    })
                })
                presenceList = JSON.parse(JSON.stringify(presenceList))
                const newArr = [...presenceList, ...tempArr]
                store.dispatch(setPresenceList(newArr))
                EaseApp.changePresenceStatus(message[0].ext)
            }
            else{
                if (message[0].ext === 'Offline') {
                    message[0].ext = 'Online'
                }
                store.dispatch(presenceStatusImg(message[0].ext))
            }
        }, // 发布者发布新的状态时，订阅者触发该回调
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