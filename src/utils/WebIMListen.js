
import WebIM from './WebIM'
import getContacts, { getBlackList } from '../api/contactsChat/getContacts'
import getGroups from '../api/groupChat/getGroups'
import getPublicGroups from '../api/groupChat/getPublicGroups'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setRequests, setFetchingStatus } from '../redux/actions'
import { getToken } from '../api/loginChat'
import { agreeInviteGroup } from '../api/groupChat/addGroup'
import i18next from "i18next";
import { message } from '../components/common/alert'
const history = createHashHistory()
const initListen = () => {
    WebIM.conn.listen({
        onOpened: () => {
            console.log('onOpened>>>');
            getContacts();
            getGroups();
            getPublicGroups();
            getBlackList()
            history.push('/main')
            store.dispatch(setFetchingStatus(false))
        },
        onClosed: () => {
            console.log('onClosed>>>');
            store.dispatch(setFetchingStatus(false))
            history.push('/login')
        },
        onOnline: (network) => {
            console.log('onOnline>>>', network);
        },
        onOffline: (network) => {
            console.log('onOffline>>>', network);
        },
        onError: (err) => {
            console.log('onError>>>', err);
        },
        // onTextMessage: (message) => {
        //     console.log('onTextMessage>>>', message);
        // },
        // onPictureMessage: (message) => {
        //     console.log('onPictureMessage>>>', message);
        // },
        // onCmdMessage: (message) => {
        //     console.log('onCmdMessaeg>>>', message);
        // },
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
                    message.info(`${i18next.t('您已被移除群：')}` + event.gid)
                    break;
                default:
                    break;
            }
        },
        onContactInvited: (msg) => {
            console.log('onContactInvited', msg)
        },

        onTokenWillExpire: () => {
            console.log('token 将要过期 -')
            let { myUserInfo } = store.getState()
            console.log('myUserInfo>>>', myUserInfo);
            getToken(myUserInfo.agoraId, myUserInfo.nickName).then((res) => {
                const { accessToken } = res
                WebIM.conn.renewToken(accessToken)
                console.log('token 重新设置成功')
            })
        }
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
            }
        }
    })

    WebIM.conn.addEventHandler('TOKENSTATUS', {
        onTokenWillExpire: () => {
            console.log('token 将要过期 addEventHandler')
            // let { myUserInfo } = store.getState()
            // getToken(myUserInfo.agoraId, myUserInfo.nickName).then((res) => {
            //     const { accessToken } = res
            //     WebIM.conn.renewToken(accessToken)
            //     console.log('token 重新设置成功')
            // })
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