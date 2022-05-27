import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { setMyUserInfo, setFetchingStatus } from '../../redux/actions'
import { message } from '../../components/common/alert'


export const getToken = (agoraId, nickName) => {
    return postData('https://a41.easemob.com/app/chat/user/login', { "userAccount": agoraId, "userNickname": nickName })
}

export const loginWithToken = (agoraId, agoraToken) => {
    let options = {
        user: agoraId,
        agoraToken: agoraToken
    };

    WebIM.conn.open(options)
}

export function postData(url, data) {
    return fetch(url, {
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'no-referrer',
    })
        .then(response => response.json())
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
    }).catch((err)=>{
        store.dispatch(setFetchingStatus(false))
        message.error('login fail.')
    })
}


export function logout() {
    WebIM.conn.close()
    window.document.title = 'Agora chat'
}


