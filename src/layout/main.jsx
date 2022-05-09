import React, { useState,useEffect } from 'react';
import Header from '../components/appbar'
import './login.css'
import { loginWithToken, loginWithPassword } from '../api/loginChat'
import WebIM from '../utils/WebIM';
// import { EaseApp } from 'chat-uikit'
import { EaseApp } from "wy-chat";
import { createHashHistory } from 'history'
import store from '../redux/store'
import { setMyUserInfo, setThreadInfo} from '../redux/actions'
import SessionInfoPopover from '../components/appbar/sessionInfo'
import GroupMemberInfoPopover from '../components/appbar/chatGroup/memberInfo'
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
                header={<Header />}
                onChatAvatarClick={handleClickSessionInfoDialog}
                onAvatarChange={handleClickGroupMemberInfoDialog}
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
            <EditThreadPanel 
                anchorEl={clickEditPanelEl} 
                onClose={() => setClickEditPanelEl(null)} 
                onchangeEditPanelStatus = {onchangeEditPanelStatus}/>
            <ThreadMembers membersPanelEl={membersPanelEl}/>
            <ThreadDialog/>
        </div>
    )
}

