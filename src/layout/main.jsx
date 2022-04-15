import React, { useEffect, useState } from 'react';
import Header from '../components/appbar'
import './login.css'
import { loginWithToken } from '../api/loginChat'
import WebIM from '../utils/WebIM';
// import { EaseApp } from 'agora-chat-uikit'
import { EaseApp } from 'luleiyu-agora-chat'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setMyUserInfo, setUnread, setCurrentSessionId } from '../redux/actions'

import SessionInfoPopover from '../components/appbar/sessionInfo'
import GroupMemberInfoPopover from '../components/appbar/chatGroup/memberInfo'
import { truncate } from 'lodash';
import { subFriendStatus } from '../api/presence'
import map3 from '../assets/notify.mp3'

import { changeTitle } from '../utils/notification'

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
    const [presenceList, setPresenceList] = useState([])
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
        console.log(res, 'handleClickGroupMemberInfoDialog')
        let isGroupChat = res.chatType === "groupChat"
        if (isGroupChat) {
            subFriendStatus({usernames: [res.from]}).then(val => {
                setPresenceList(val)
                setMemberInfo(res)
                setGroupMemberInfoAddEl(e.target);
            })
        }
    }
    const handleonConversationClick = (session) => {
        console.log(session, 'handleonConversationClick')
        const { sessionType, sessionId } = session
        store.dispatch(setCurrentSessionId(sessionId))
        const { unread } = store.getState()
        console.log(unread, 'main')
        if (!unread[sessionType][sessionId]) {
            unread[sessionType][sessionId] = {}
        }
        unread[sessionType][sessionId] = {
            realNum: 0,
            fakeNum: 0
        }
        store.dispatch(setUnread(unread))
        changeTitle()
    }
    // notify()
    return (
        <div className='main-container'>
            <EaseApp
                header={<Header />}
                onChatAvatarClick={handleClickSessionInfoDialog}
                onAvatarChange={handleClickGroupMemberInfoDialog}
                onConversationClick={handleonConversationClick}
            />
            <SessionInfoPopover 
                open={sessionInfoAddEl}
                onClose={() => setSessionInfoAddEl(null)}
                sessionInfo={sessionInfo}/>
            <GroupMemberInfoPopover 
                open={groupMemberInfoAddEl}
                onClose={() => setGroupMemberInfoAddEl(null)}
                memberInfo={memberInfo}
                presenceList={presenceList}/>
            <audio id="agoraChatSoundId" src={map3}></audio>
        </div>
    )
}

