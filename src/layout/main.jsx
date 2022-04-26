import React, { useEffect, useState } from 'react';
import Header from '../components/appbar'
import './login.css'
import { loginWithToken } from '../api/loginChat'
import getGroupInfo from '../api/groupChat/getGroupInfo'
import WebIM from '../utils/WebIM';
// import { EaseApp } from 'agora-chat-uikit'
import { EaseApp } from 'uikit-reaction'
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setMyUserInfo} from '../redux/actions'

import SessionInfoPopover from '../components/appbar/sessionInfo'
import GroupMemberInfoPopover from '../components/appbar/chatGroup/memberInfo'
import GroupSettingsDialog from '../components/appbar/chatGroup/groupSettings'
import { Report } from '../components/report';
import i18next from "i18next";
import { subFriendStatus } from '../api/presence'

const history = createHashHistory()

export default function Main() {
    useEffect(() => {
        const webimAuth = sessionStorage.getItem('webim_auth')
        let webimAuthObj = {}
        if (webimAuth && WebIM.conn.logOut) {
            webimAuthObj = JSON.parse(webimAuth)
            loginWithToken(webimAuthObj.agoraId, webimAuthObj.password) // accessToken
            store.dispatch(setMyUserInfo({ agoraId: webimAuthObj.agoraId, nickName: webimAuthObj.nickName }))
        }else if (WebIM.conn.logOut) {
            history.push('/login')  
        }
    }, [])
    const state = store.getState();
    const [sessionInfoAddEl, setSessionInfoAddEl] = useState(null)
    const [sessionInfo, setSessionInfo] = useState({});

    const [groupMemberInfoAddEl, setGroupMemberInfoAddEl] = useState(null)
    const [memberInfo, setMemberInfo] = useState({})
    const [presenceList, setPresenceList] = useState([])

    const [groupSettingAddEl, setGroupSettingAddEl] = useState(null)
    const [currentGroupId, setCurrentGroupId] = useState("");

    const [isShowReport, setShowReport] = useState(false)
    const [currentMsg, setCurrentMsg] = useState({})
    // session avatar click
    const handleClickSessionInfoDialog = (e,res) => {
        let {chatType,to} = res
        if (chatType === "singleChat") {
            setSessionInfoAddEl(e.target);
            setSessionInfo(res)
        } else if (chatType === "groupChat"){
            getGroupInfo(to)
            setGroupSettingAddEl(e.target)
            setCurrentGroupId(to)
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

    const onMessageEventClick = (e,data,msg) => {
        if(data.value === 'report'){
            setShowReport(true)
            setCurrentMsg(msg)
        }        
    }

    return (
        <div className='main-container'>
            <EaseApp
                isShowReaction={true}
                header={<Header />}
                onChatAvatarClick={handleClickSessionInfoDialog}
                onAvatarChange={handleClickGroupMemberInfoDialog}
                customMessageList={[{name: i18next.t("Report"), value: 'report', position: 'others'}]}
                customMessageClick={onMessageEventClick}
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
            <GroupSettingsDialog 
                open={groupSettingAddEl}
                onClose={() => setGroupSettingAddEl(null)}
                currentGroupId={currentGroupId} />
            <Report open={isShowReport} onClose={() => {setShowReport(false)}} currentMsg={currentMsg}/>
        </div>
    )
}

