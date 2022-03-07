import React, { useState,useEffect } from 'react';
import Header from '../components/appbar'
import './login.css'
import { loginWithToken } from '../api/loginChat'
import WebIM from '../utils/WebIM';
import { EaseApp } from 'chat-uikit'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setMyUserInfo} from '../redux/actions'
import SessionInfoPopover from '../components/appbar/sessionInfo'
import { truncate } from 'lodash';
const history = createHashHistory()

export default function Main() {
    useEffect(() => {
        const webimAuth = sessionStorage.getItem('webim_auth')
        let webimAuthObj = {}
        if (webimAuth && WebIM.conn.logOut) {
            webimAuthObj = JSON.parse(webimAuth)
            loginWithToken(webimAuthObj.agoraId, webimAuthObj.accessToken)
            store.dispatch(setMyUserInfo({ agoraId: webimAuthObj.agoraId, nickName: webimAuthObj.nickName }))
        }else if (WebIM.conn.logOut) {
            history.push('/login')  
        }
    }, [])

    const [sessionInfoAddEl, setSessionInfoAddEl] = useState(null)

    const [sessionInfo, setSessionInfo] = useState({});


    const handleClickSessionInfoDialog = (res) => {
        // TODO 
        let isSingleChat = res.chatType === "singleChat"
        if (isSingleChat) {
            setSessionInfoAddEl(true);
            setSessionInfo(res)
        }
    }

    const handlecloseSessionInfoDialog = () => {
        setSessionInfoAddEl(null);
    }


    return (
        <div className='main-container'>
            <EaseApp
                header={<Header />}
                onChatAvatarClick={handleClickSessionInfoDialog}
            />
            <SessionInfoPopover 
                open={sessionInfoAddEl}
                onClose={handlecloseSessionInfoDialog}
                sessionInfo={sessionInfo}/>
        </div>
    )
}

