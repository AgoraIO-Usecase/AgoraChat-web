import React, {useState, useEffect} from 'react';
import getGroupInfo from '../api/groupChat/getGroupInfo'
import WebIM from '../utils/WebIM';
import { loginWithToken } from '../api/loginChat'
import { getToken } from '../utils/http-client';
import { EaseApp } from 'agora-chat-uikit'
import store from '../redux/store'
import { setMyUserInfo, setUnread, setCurrentSessionId, setThreadInfo } from '../redux/actions'
import SessionInfoPopover from '../components/appbar/sessionInfo'
import GroupMemberInfoPopover from '../components/appbar/chatGroup/memberInfo'
import GroupSettingsDialog from '../components/appbar/chatGroup/groupSettings'
import { subFriendStatus } from '../api/presence'
import map3 from '../assets/notify.mp3'
import ringing from '../assets/ringing.mp3'

import { changeTitle } from '../utils/notification'

import EditThreadPanel from '../components/thread/components/editThreadPanel'
import ThreadMembers from '../components/thread/components/threadMembers';
import ThreadDialog from '../components/thread/components/threadDialog'
import { getConfDetail} from '../api/rtcCall'
export default function Main(props) {
    const uid = props.uid;

    useEffect(() => {
        async function initialize() {
            const webimAuth = sessionStorage.getItem('webim_auth');
            if (webimAuth && WebIM.conn.logOut) {
                let webimAuthObj = {}
                webimAuthObj = JSON.parse(webimAuth);
                console.log(webimAuthObj);
                if (webimAuthObj.password) {
                    await loginWithToken(webimAuthObj.agoraId.toLowerCase(), webimAuthObj.accessToken)
                    store.dispatch(setMyUserInfo({ agoraId: webimAuthObj.agoraId, password: webimAuthObj.password }))
                }
                store.dispatch(setMyUserInfo({ agoraId: webimAuthObj.agoraId }))
                WebIM.conn.agoraUid = webimAuthObj.agoraUid
            } else if (WebIM.conn.logOut) {
                try {
                    const res = await getToken(uid);
                    console.log('elp agora login res', res)
                    const { accessToken, agoraUid } = res
                    WebIM.conn.agoraUid = agoraUid
                    await loginWithToken(uid.toLowerCase(), accessToken);
                    store.dispatch(setMyUserInfo({ agoraId: uid, password: uid }))
                    sessionStorage.setItem('webim_auth', JSON.stringify({  agoraId: uid, password: uid, accessToken, agoraUid }))
                } catch (err) {
                    console.error('Login failed', err)
                }
            }
        }
        initialize().catch();

    }, [uid]);

    const [sessionInfoAddEl, setSessionInfoAddEl] = useState(null)
    const [sessionInfo, setSessionInfo] = useState({});

    const [groupMemberInfoAddEl, setGroupMemberInfoAddEl] = useState(null)
    const [memberInfo, setMemberInfo] = useState({})
    const [presenceList, setPresenceList] = useState([])
    const [groupSettingAddEl, setGroupSettingAddEl] = useState(null)
    const [currentGroupId, setCurrentGroupId] = useState("");
    
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

    const [clickEditPanelEl,setClickEditPanelEl] = useState(null);
    const [membersPanelEl, setmembersPanelEl] = useState(null);
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


  const handleGetIdMap = async (data) => {
    let member = {}
    member = await getConfDetail(data.userId, data.channel)
    return member
  }

    return (
        <div className='main-container'>
            <EaseApp
                onChatAvatarClick={handleClickSessionInfoDialog}
                onAvatarChange={handleClickGroupMemberInfoDialog}
                onConversationClick={handleonConversationClick}
                onEditThreadPanel={changeEditPanelStatus}
                isShowReaction={true}
                agoraUid={WebIM.conn.agoraUid}
                appId={process.env.AGORA_APP_ID}
                getIdMap={handleGetIdMap}
                ringingSource={ringing}
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
                authorEl={groupSettingAddEl}
                onClose={() => setGroupSettingAddEl(null)}
                currentGroupId={currentGroupId} />
            <EditThreadPanel 
                anchorEl={clickEditPanelEl} 
                onClose={() => setClickEditPanelEl(null)} 
                onchangeEditPanelStatus = {onchangeEditPanelStatus}/>
            <ThreadMembers membersPanelEl={membersPanelEl}/>
            <ThreadDialog/>
            <audio id="agoraChatSoundId" src={map3}></audio>
        </div>
    )
}

