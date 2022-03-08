import React, { useState,useEffect } from 'react';
import Header from '../components/appbar'
import './login.css'
import { loginWithToken } from '../api/loginChat'
import WebIM from '../utils/WebIM';
// import { EaseApp } from 'agora-chat-uikit'
import { EaseApp } from 'luleiyu-agora-chat'
// import { EaseApp } from 'chat-uikit'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setMyUserInfo} from '../redux/actions'
import SessionInfoPopover from '../components/appbar/sessionInfo'
import GroupMemberInfoPopover from '../components/appbar/chatGroup/memberInfo'
import { truncate } from 'lodash';
const history = createHashHistory()

export default function Main() {
    useEffect(() => {
        const webimAuth = sessionStorage.getItem('webim_auth')
        let webimAuthObj = {}
        if (webimAuth && WebIM.conn.logOut) {
            webimAuthObj = JSON.parse(webimAuth)
            loginWithToken(webimAuthObj.agoraId, webimAuthObj.nickName) // accessToken
            store.dispatch(setMyUserInfo({ agoraId: webimAuthObj.agoraId, nickName: webimAuthObj.nickName }))
        }else if (WebIM.conn.logOut) {
            history.push('/login')  
        }
    }, [])

    const [sessionInfoAddEl, setSessionInfoAddEl] = useState(null)
    const [sessionInfo, setSessionInfo] = useState({});

    const [groupMemberInfoAddEl, setGroupMemberInfoAddEl] = useState(null)
    const [memberInfo, setMemberInfo] = useState({})

    // session avatar click
    const handleClickSessionInfoDialog = (e,res) => {
        // TODO 
        let isSingleChat = res.chatType === "singleChat"
        if (isSingleChat) {
            setSessionInfoAddEl(e.target);
            setSessionInfo(res)
        }
    }

    const handleClickGroupMemberInfoDialog = (e,res) => {
        let isGroupChat = res.chatType === "groupChat"
        if (isGroupChat) {
            setGroupMemberInfoAddEl(e.target);
            setMemberInfo(res)
        }
    }

    return (
        <div className='main-container'>
            <EaseApp
                header={<Header />}
                onChatAvatarClick={handleClickSessionInfoDialog}
                onAvatarChange={handleClickGroupMemberInfoDialog}
            />
            <SessionInfoPopover 
                open={sessionInfoAddEl}
                onClose={() => setSessionInfoAddEl(null)}
                sessionInfo={sessionInfo}/>
            <GroupMemberInfoPopover 
                open={groupMemberInfoAddEl}
                onClose={() => setGroupMemberInfoAddEl(null)}
                memberInfo={memberInfo}/>
        </div>
    )
}

