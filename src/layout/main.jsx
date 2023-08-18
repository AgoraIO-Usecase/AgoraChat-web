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

import {
  Chat,
  ConversationList,
  Provider,
  rootStore,
  Thread,
  RootContext,
  MessageList,
  TextMessage,
  AudioMessage,
  FileMessage,
  ImageMessage,
  CombinedMessage,
  RecalledMessage,
  Icon
} from "chatuim2";
import "chatuim2/style.css";
import CombineDialog from "../components/combine";
import { observer } from "mobx-react-lite";

const history = createHashHistory();

function Main() {
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
  const [memberInfo, setMemberInfo] = useState({});
  const [presenceList, setPresenceList] = useState([]);
  const [groupSettingAddEl, setGroupSettingAddEl] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState("");

  const [isShowReport, setShowReport] = useState(false);
  const [currentMsg, setCurrentMsg] = useState({});
  // const rootStore = React.useContext(RootContext).rootStore
  // || {};

  const thread = rootStore.threadStore;

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

  // const onOpenThreadPanel = (obj) => {
  //     console.log(obj, 'onOpenThreadPanel')
  //     getSilentModeForConversation({conversationId: obj.id, type: 'groupChat', flag: 'Thread' }).then(res => {
  //         console.log(res, 'getNotDisturbDuration')
  //     })
  // }

  const [showCombineDialog, setShowCombineDialog] = useState(false);
  const [combineData, setCombineData] = useState({});
  const sendMessage = (data) => {
    console.log("mmmmm", data);
    if (data.type === "combine") {
      // combineData = data
      setCombineData(data);
      setShowCombineDialog(true);
    }
  };
  const sendCombineMsg = (item) => {
    const to = item.brandId ? item.brandId : item.groupid;
    combineData.to = to;
    combineData.from = "";
    combineData.chatType = item.brandId ? "singleChat" : "groupChat";
    console.log("222", combineData, item);
    rootStore.messageStore
      .sendMessage(combineData)
      .then((res) => {
        console.log("发送成功", res);
      })
      .catch((err) => {
        console.log(err);
      });
    // setShowCombineDialog(false)
  };
  useEffect(() => {
    console.log("变化了 showThreadPanel", rootStore.threadStore);
  }, [rootStore.threadStore?.showThreadPanel]);

  const handleGetIdMap = async (data) => {
    let member = {};
    member = await getConfDetail(data.userId, data.channel);
    return member;
  };

  let selfMoreAction = {
    visible: true,
    icon: null,
    actions: [
      {
        content: 'REPLY',
      },
      {
        content: 'DELETE',
      },
      {
        content: 'UNSEND',
      },
      {
        content: 'TRANSLATE',
      },
      {
        content: 'Modify',
      },
      {
        content: 'SELECT',
      },
    ],
  };

  let targetMoreAction = {
    ...selfMoreAction,
    actions: [...selfMoreAction.actions, {
      icon: <Icon type='ENVELOPE' width={16} height={16}></Icon>,
      content: 'Report',
      onClick: (msg) => {
        setCurrentMsg(msg)
        setShowReport(true)
      }
    }]
  }

  const renderMessage = (msg) => {
    console.log('自定义的消息')
    let moreAction = selfMoreAction
    // add report button
    if(msg.from !== rootStore.client.user ){
      moreAction = targetMoreAction
    }
    if (msg.type === 'txt') {
      return(
      <TextMessage
        key={msg.id}
        textMessage={msg}
        renderUserProfile={({ userId }) => (
          <CustomUserProfile userId={userId} />
        )}
        thread={true}
        customAction={moreAction}
      ></TextMessage>)
    } else if(msg.type === 'audio'){
      <AudioMessage
        key={msg.id}
          //@ts-ignore
          audioMessage={msg}
          renderUserProfile={({ userId }) => (
            <CustomUserProfile userId={userId} />
          )}
          thread={true}
        ></AudioMessage>
    } else if (msg.type === 'img') {
      return (
        <ImageMessage
          key={msg.id}
          //@ts-ignore
          imageMessage={msg}
          renderUserProfile={({ userId }) => (
            <CustomUserProfile userId={userId} />
          )}
          thread={true}
          customAction={moreAction}
        ></ImageMessage>
      )
    } else if(msg.type === 'file'){
      <FileMessage
        key={msg.id}
          //@ts-ignore
          fileMessage={msg}
          renderUserProfile={({ userId }) => (
            <CustomUserProfile userId={userId} />
          )}
          thread={true}
          customAction={moreAction}
        ></FileMessage>
    } else if(msg.type === 'recall'){
      <RecalledMessage
        key={msg.id}
          //@ts-ignore
          status={msg.status}
          //@ts-ignore
          message={msg}
        >
        </RecalledMessage>
    } else if(msg.type === 'combine'){
      <CombinedMessage
        key={msg.id}
          //@ts-ignore
          status={msg.status}
          //@ts-ignore
          combinedMessage={msg}
          renderUserProfile={({ userId }) => (
            <CustomUserProfile userId={userId} />
          )}
          thread={true}
        ></CombinedMessage>
    }
  }
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
        {/* <ContactList></ContactList> */}
      </div>
      <div
        style={{
          width: "calc(100% - 360px)",
          borderLeft: "1px solid transparent",
          overflow: "hidden",
          display: "flex"
        }}
      >
        <div
          style={{
            flex: 1,
            borderLeft: "1px solid transparent",
            overflow: "hidden"
          }}
        >
          <Chat
            headerProps={{
              onAvatarClick: handleClickSessionInfoDialog
            }}
            messageEditorProps={{
              onSendMessage: sendMessage
            }}
            messageListProps={{
              renderUserProfile: ({ userId }) => (
                <CustomUserProfile userId={userId} />
              )
            }}
            renderMessageList={() => <MessageList renderMessage={renderMessage} />}
          ></Chat>
        </div>
        {
          <div
            style={{
              width: "360px",
              borderLeft: "1px solid #eee",
              overflow: "hidden",
              background: "#fff",
              display: rootStore.threadStore?.showThreadPanel ? "block" : "none"
            }}
          >
            <Thread  messageListProps={{
              renderUserProfile: ({ userId }) => (
                <CustomUserProfile userId={userId} />
              )
            }}></Thread>
          </div>
        }
      </div>
      {/* <EaseApp
                header={<Header />}
                onChatAvatarClick={handleClickSessionInfoDialog}
                onAvatarChange={handleClickGroupMemberInfoDialog}
                onConversationClick={handleonConversationClick}
                customMessageList={[{name: i18next.t("Report"), value: 'report', position: 'others'}]}
                customMessageClick={onMessageEventClick}
                onEditThreadPanel={changeEditPanelStatus}
                // onOpenThreadPanel={onOpenThreadPanel}
                isShowReaction={true}

                agoraUid={WebIM.conn.agoraUid}
                appId="15cb0d28b87b425ea613fc46f7c9f974"
                getRTCToken={handleGetToken}
                getIdMap={handleGetIdMap}
                ringingSource={ringing}
            /> */}
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
      <CombineDialog
        open={showCombineDialog}
        onClickItem={sendCombineMsg}
        onClose={() => {
          setShowCombineDialog(false);
        }}
      />
      <audio id="agoraChatSoundId" src={map3}></audio>
    </div>
  );
}

export default observer(Main);
