import React, { useState, useEffect } from "react";
import Header from "../components/appbar";
import "./login.css";
import getGroupInfo from "../api/groupChat/getGroupInfo";
import WebIM from "../utils/WebIM";
import { loginWithToken, loginWithPassword } from "../api/loginChat";
import { createHashHistory } from "history";
import store from "../redux/store";
import {
  setMyUserInfo,
  setUnread,
  setCurrentSessionId,
  setThreadInfo
} from "../redux/actions";
import SessionInfoPopover from "../components/appbar/sessionInfo";
import CustomUserProfile from "../components/appbar/chatGroup/memberInfo";
import GroupSettingsDialog from "../components/appbar/chatGroup/groupSettings";
import { Report } from "../components/report";
import i18next from "i18next";

import { subFriendStatus } from "../api/presence";
import map3 from "../assets/notify.mp3";
import ringing from "../assets/ringing.mp3";

import { changeTitle } from "../utils/notification";

import EditThreadPanel from "../components/thread/components/editThreadPanel";
import ThreadMembers from "../components/thread/components/threadMembers";
import ThreadDialog from "../components/thread/components/threadDialog";
// import { getSilentModeForConversation } from '../api/notificationPush'
import { getRtctoken, getConfDetail } from "../api/rtcCall";

import { Chat, ConversationList, Provider, rootStore } from "chatuim2";
import "chatuim2/style.css";
const history = createHashHistory();

export default function Main() {
  //support edit thread
  useEffect(() => {
    const webimAuth = sessionStorage.getItem("webim_auth");
    let webimAuthObj = {};
    if (webimAuth && WebIM.conn.logOut) {
      webimAuthObj = JSON.parse(webimAuth);
      if (webimAuthObj.password) {
        loginWithToken(
          webimAuthObj.agoraId.toLowerCase(),
          webimAuthObj.accessToken
        );
        store.dispatch(
          setMyUserInfo({
            agoraId: webimAuthObj.agoraId,
            password: webimAuthObj.password
          })
        );
      } else {
        history.push("/login");
      }
      store.dispatch(setMyUserInfo({ agoraId: webimAuthObj.agoraId }));
      WebIM.conn.agoraUid = webimAuthObj.agoraUid;
    } else if (WebIM.conn.logOut) {
      history.push("/login");
    }
  }, []);
  const state = store.getState();
  const [sessionInfoAddEl, setSessionInfoAddEl] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({});

  const [groupMemberInfoAddEl, setGroupMemberInfoAddEl] = useState(null);
  const [presenceList, setPresenceList] = useState([]);
  const [groupSettingAddEl, setGroupSettingAddEl] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState("");

  const [isShowReport, setShowReport] = useState(false);
  const [currentMsg, setCurrentMsg] = useState({});
  // session avatar click
  const handleClickSessionInfoDialog = (e, res) => {
    // let {chatType,to} = res
    let { chatType, conversationId: to } =
      rootStore.conversationStore.currentCvs;
    if (chatType === "singleChat") {
      setSessionInfoAddEl(e.target);
      setSessionInfo({
        chatType,
        to
      });
    } else if (chatType === "groupChat") {
      getGroupInfo(to);
      setGroupSettingAddEl(e.target);
      setCurrentGroupId(to);
    }
  };

  const handleonConversationClick = (session) => {
    console.log(session, "handleonConversationClick");
    const { sessionType, sessionId } = session;
    store.dispatch(setCurrentSessionId(sessionId));
    const { unread } = store.getState();
    console.log(unread, "main");
    if (!unread[sessionType][sessionId]) {
      unread[sessionType][sessionId] = {};
    }
    unread[sessionType][sessionId] = {
      realNum: 0,
      fakeNum: 0
    };
    store.dispatch(setUnread(unread));
    changeTitle();
  };

  const onMessageEventClick = (e, data, msg) => {
    if (data.value === "report") {
      setShowReport(true);
      setCurrentMsg(msg);
    }
  };

  const [clickEditPanelEl, setClickEditPanelEl] = useState(null);
  const [membersPanelEl, setmembersPanelEl] = useState(null);
  const changeEditPanelStatus = (e, info) => {
    if (e) {
      setClickEditPanelEl(e.currentTarget);
      store.dispatch(setThreadInfo(info));
    } else {
      setClickEditPanelEl(e);
    }
  };
  const onchangeEditPanelStatus = (e, type) => {
    store.dispatch(setThreadInfo({ currentEditPage: type }));
    if (type === "Members") {
      setmembersPanelEl(e.currentTarget);
    }
  };
  const handleGetToken = async (data) => {
    let token = "";
    console.log("data", data);

    token = await getRtctoken({
      channel: data.channel,
      agoraId: WebIM.conn.agoraUid,
      username: data.username
    });
    return {
      agoraUid: WebIM.conn.agoraUid,
      accessToken: token.accessToken
    };
  };

  const handleGetIdMap = async (data) => {
    let member = {};
    member = await getConfDetail(data.userId, data.channel);
    return member;
  };

  return (
    <div className="main-container">
      <div
        style={{
          width: "360px",
          border: "1px solid transparent",
          background: "#fff"
        }}
      >
        <ConversationList
          style={{ background: "#F1F2F3" }}
          renderHeader={() => <Header />}
        ></ConversationList>
      </div>
      <div
        style={{ width: "calc(100% - 360px)", border: "1px solid transparent" }}
      >
        <Chat
          headerProps={{
            onAvatarClick: handleClickSessionInfoDialog
          }}
          messageListProps={{
            renderUserProfile: ({ userId }) => (
              <CustomUserProfile userId={userId} />
            )
          }}
        ></Chat>
      </div>
      <SessionInfoPopover
        open={sessionInfoAddEl}
        onClose={() => setSessionInfoAddEl(null)}
        sessionInfo={sessionInfo}
      />

      <GroupSettingsDialog
        open={groupSettingAddEl}
        authorEl={groupSettingAddEl}
        onClose={() => setGroupSettingAddEl(null)}
        currentGroupId={currentGroupId}
      />
      <Report
        open={isShowReport}
        onClose={() => {
          setShowReport(false);
        }}
        currentMsg={currentMsg}
      />
      <EditThreadPanel
        anchorEl={clickEditPanelEl}
        onClose={() => setClickEditPanelEl(null)}
        onchangeEditPanelStatus={onchangeEditPanelStatus}
      />
      <ThreadMembers membersPanelEl={membersPanelEl} />
      <ThreadDialog />
      <audio id="agoraChatSoundId" src={map3}></audio>
    </div>
  );
}
