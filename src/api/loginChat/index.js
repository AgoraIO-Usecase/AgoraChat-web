import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setMyUserInfo, setFetchingStatus } from '../../redux/actions'
import { message } from '../../components/common/alert'
import i18next from "i18next";
import { createHashHistory } from 'history'
import { reject } from 'lodash';
const history = createHashHistory()
export const getToken = (agoraId) => {
    return postData(`${process.env.ELP_INTEGRATION_SERVER}/users/${agoraId}/chatsAuth`, {})
}

export const loginWithToken = (agoraId, agoraToken) => {
    let options = {
        user: agoraId,
        agoraToken: agoraToken
    };
    WebIM.conn.addEventHandler("AUTHHANDLER", {
    // The event handler for successfully connecting to the server.
            // The event handler for the token about to expire.
            onTokenWillExpire: (params) => {
                refreshToken(agoraId);
            },
            // The event handler for the token already expired.
            onTokenExpired: (params) => {
                refreshToken(agoraId);
            },
            onError: (error) => {
                console.log("on error", error);
            },
    });
    // Renews the token.
    function refreshToken(uid) {
            getToken(uid)
            .then((res) => res.json())
            .then((res) => {
                    WebIM.conn.renewToken(res.chatToken);
                }
            );
    }

    return new Promise((resolve,reject) => {
        WebIM.conn.open(options).then(res => {
            WebIM.conn.fetchUserInfoById(agoraId).then(val => {
                const res = val.data || {}
                store.dispatch(setMyUserInfo({ nickName: res[agoraId]?.nickname || '' }))
            })
            resolve(res)
        }).catch(err => {
            console.error(err)
            reject(err)
        })
    })
}

export function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow',
        // referrer: 'localhost',
    })
        .then(response => {
            console.log(response)
            return response.json().then((data) => {
                console.log('elp response', data)
                return data
            })
        })
}

export const loginWithPassword = (agoraId, password) => {
    let options = {
        user: agoraId,
        pwd: password
    };
    WebIM.conn.open(options).then((res) => {
        const { accessToken } = res
        store.dispatch(setMyUserInfo({ agoraId, password }))
        sessionStorage.setItem('webim_auth', JSON.stringify({ agoraId, password, accessToken }))
    }).catch((err) => {
        store.dispatch(setFetchingStatus(false))
        // message.error('login fail.')
    })
}


export function logout() {
    WebIM.conn.close()
    sessionStorage.removeItem('webim_auth')
    window.document.title = 'Agora chat'
}

export function register (agoraId, password, nickname) {
    let options = {
        username: agoraId,
        password: password,
        nickname: nickname ? nickname.trim().toLowerCase() : '',
        success: function(){
            store.dispatch(setFetchingStatus(false))
            store.dispatch(setMyUserInfo({ agoraId, password }))
            sessionStorage.setItem('webim_auth', JSON.stringify({ agoraId, password }))
            history.push('/login')
        },

        error: (err) => {
            store.dispatch(setFetchingStatus(false))
            if (JSON.parse(err.data).error === 'duplicate_unique_property_exists') {
                message.error(i18next.t('UserAlreadyExists'))
            } else if (JSON.parse(err.data).error === 'illegal_argument') {
                if (JSON.parse(err.data).error_description === 'USERNAME_TOO_LONG') {
                    return message.error(i18next.t('UserNameTooLong'))
                }else if(JSON.parse(err.data).error_description === 'password or pin must provided'){
                    return  message.error(i18next.t('InvalidPassword'))
                }
                message.error(i18next.t('InvalidUserName'))
            } else if (JSON.parse(err.data).error === 'unauthorized') {
                message.error(i18next.t('SignUpFailed'))
            } else if (JSON.parse(err.data).error === 'resource_limited') {
                message.error(i18next.t('LimitAccount'))
            }
        }
    }
    WebIM.conn.registerUser(options)
}
