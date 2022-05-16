import React, { useState,useEffect } from 'react';
import Header from '../components/appbar'
import './login.css'
import getGroupInfo from '../api/groupChat/getGroupInfo'
import WebIM from '../utils/WebIM';
// import { EaseApp } from 'uikit-reaction'
import { loginWithToken, loginWithPassword } from '../api/loginChat'
// import { EaseApp } from 'chat-uikit'
import { EaseApp } from "wy-chat";
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setMyUserInfo, setThreadInfo} from '../redux/actions'
import SessionInfoPopover from '../components/appbar/sessionInfo'
import GroupMemberInfoPopover from '../components/appbar/chatGroup/memberInfo'
import GroupSettingsDialog from '../components/appbar/chatGroup/groupSettings'
import { Report } from '../components/report';
import i18next from "i18next";

import { truncate } from 'lodash';
import EditThreadPanel from '../components/thread/components/editThreadPanel'
import ThreadMembers from '../components/thread/components/threadMembers';
import ThreadDialog from '../components/thread/components/threadDialog'
const history = createHashHistory()

export default function Main() {
    //support edit thread 
    EaseApp.thread.setShowThread(true)
    EaseApp.thread.setHasThreadEditPanel(true)
    useEffect(() => {
        const webimAuth = sessionStorage.getItem('webim_auth')
        let webimAuthObj = {}
        if (webimAuth && WebIM.conn.logOut) {
            webimAuthObj = JSON.parse(webimAuth)
            if(webimAuthObj.password){
                loginWithPassword(webimAuthObj.agoraId, webimAuthObj.password)
            }else{
                loginWithToken(webimAuthObj.agoraId, webimAuthObj.accessToken)
            }
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
        let isGroupChat = res.chatType === "groupChat"
        if (isGroupChat) {
            setGroupMemberInfoAddEl(e.target);
            setMemberInfo(res)
        }
    }

    const onMessageEventClick = (e,data,msg) => {
        if(data.value === 'report'){
            setShowReport(true)
            setCurrentMsg(msg)
        }        
    }

    const [clickEditPanelEl,setClickEditPanelEl] = useState(null);
    const [membersPanelEl,setmembersPanelEl] = useState(null);
    const changeEditPanelStatus = (e,info) =>{
        if(e){
            setClickEditPanelEl(e.currentTarget)
            store.dispatch(setThreadInfo(info))
        }
        else{
            setClickEditPanelEl(e)
        }
    }
    const onchangeEditPanelStatus = (e,type)=>{
        store.dispatch(setThreadInfo({currentEditPage:type}))
        if(type === 'Members'){
            setmembersPanelEl(e.currentTarget)
        }
    }
    return (
        <div className='main-container'>
            <EaseApp
                isShowReaction={true}
                header={<Header />}
                isShowReaction={true}
                onChatAvatarClick={handleClickSessionInfoDialog}
                onAvatarChange={handleClickGroupMemberInfoDialog}
                customMessageList={[{name: i18next.t("Report"), value: 'report', position: 'others'}]}
                customMessageClick={onMessageEventClick}
                onEditThreadPanel={changeEditPanelStatus}
                // isShowReaction
            />
            <SessionInfoPopover 
                open={sessionInfoAddEl}
                onClose={() => setSessionInfoAddEl(null)}
                sessionInfo={sessionInfo}/>
            <GroupMemberInfoPopover 
                open={groupMemberInfoAddEl}
                onClose={() => setGroupMemberInfoAddEl(null)}
                memberInfo={memberInfo}/>
            <GroupSettingsDialog 
                open={groupSettingAddEl}
                onClose={() => setGroupSettingAddEl(null)}
                currentGroupId={currentGroupId} />
            <Report open={isShowReport} onClose={() => {setShowReport(false)}} currentMsg={currentMsg}/>
            <EditThreadPanel 
                anchorEl={clickEditPanelEl} 
                onClose={() => setClickEditPanelEl(null)} 
                onchangeEditPanelStatus = {onchangeEditPanelStatus}/>
            <ThreadMembers membersPanelEl={membersPanelEl}/>
            <ThreadDialog/>
        </div>
    )
}

