import WebIM from '../../utils/WebIM'
import { publishNewPresence } from '../presence'

export const getToken = (agoraId, nickName) => {
    // return postData('https://a71.easemob.com/app/chat/user/login', { "userAccount": agoraId, "userNickname": nickName })
    return postData('https://a1.easemob.com/app/chat/user/login', { "userAccount": agoraId, "userNickname": nickName })
    // return postData('http://a1-test.easemob.com:8089/app/chat/user/login', { "userAccount": agoraId, "userNickname": nickName })
}

export const loginWithToken = (agoraId, agoraToken) => {
    let options = {
        user: agoraId,
        pwd: agoraToken,
        // agoraToken: agoraToken
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

export function logout() {
    publishNewPresence({description: 'Offline'})
    WebIM.conn.close()
}


