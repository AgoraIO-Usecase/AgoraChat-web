import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/appbar";
import "./login.css";
import getGroupInfo from "../api/groupChat/getGroupInfo";
import { loginWithToken } from "../api/loginChat";
import { createHashHistory } from "history";
import store from "../redux/store";
import {
  setMyUserInfo,
  setUnread,
  setCurrentSessionId,
  setTargetLanguage,
  setTypingSwitch
} from "../redux/actions";
import SessionInfoPopover from "../components/appbar/sessionInfo";
import CustomUserProfile from "../components/appbar/chatGroup/memberInfo";
import GroupSettingsDialog from "../components/appbar/chatGroup/groupSettings";
import { Report } from "../components/report";
import map3 from "../assets/notify.mp3";
import { changeTitle, getLocalStorageData } from "../utils/notification";
import { TranslateDialog } from "../components/translate";
import { getRtctoken, getConfDetail } from "../api/rtcCall";
import { useSelector } from "react-redux";
import {
  Chat,
  ConversationList,
  rootStore,
  Thread,
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
  const [sessionInfoAddEl, setSessionInfoAddEl] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({});
  const [groupSettingAddEl, setGroupSettingAddEl] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState("");
  const [isShowReport, setShowReport] = useState(false);
  const [currentMsg, setCurrentMsg] = useState({});
  const { currentCvs } = rootStore.conversationStore;

  const renderUserProfile = useCallback(
    ({ userId }) => {
      return currentCvs.chatType === "groupChat" ? (
        <CustomUserProfile userId={userId} />
      ) : null;
    },
    [currentCvs]
  );

  //support edit thread
  useEffect(() => {
    const webimAuth = sessionStorage.getItem("webim_auth");
    let webimAuthObj = {};
    if (webimAuth) {
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
    } else {
      history.push("/login");
    }
  }, []);
  const state = useSelector((state) => state);

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
    rootStore.messageStore
      .sendMessage(combineData)
      .then((res) => {
        console.log("发送成功", res);
        rootStore.messageStore.setSelectedMessage(currentCvs, {
          selectable: false,
          selectedMessage: [],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let selfMoreAction = {
    visible: true,
    icon: null,
    actions: [
      {
        content: "REPLY"
      },
      {
        content: "DELETE"
      },
      {
        content: "UNSEND"
      },
      {
        content: "TRANSLATE"
      },
      {
        content: "Modify"
      },
      {
        content: "SELECT"
      }
    ]
  };

  let targetMoreAction = {
    ...selfMoreAction,
    actions: [
      ...selfMoreAction.actions,
      {
        icon: <Icon type="ENVELOPE" width={16} height={16}></Icon>,
        content: "Report",
        onClick: (msg) => {
          setCurrentMsg(msg);
          setShowReport(true);
        }
      }
    ]
  };
  useEffect(() => {
    const data = getLocalStorageData();
    if (data.selectedLang) {
      store.dispatch(setTargetLanguage(data.selectedLang));
    }
    if(data.typingSwitch){
      store.dispatch(setTypingSwitch(data.typingSwitch));
    }
    return () => {
      rootStore.conversationStore.setCurrentCvs({
        chatType: "",
        conversationId: ""
      });
    };
  }, []);

  const handleTranslateMsg = () => {
    console.log("state", state);
    const data = getLocalStorageData();
    const targetLanguage = state?.targetLanguage;
    if (
      targetLanguage == "none" ||
      targetLanguage == "" ||
      data.translateSwitch == false
    ) {
      setTransDialogOpen(true);
      return false;
    }
  };

  const renderMessage = (msg) => {
    console.log("自定义的消息");
    let moreAction = selfMoreAction;
    // add report button
    if (msg.from !== rootStore.client.user) {
      moreAction = targetMoreAction;
    }
    if (msg.type === "txt") {
      return (
        <TextMessage
          key={msg.id}
          textMessage={msg}
          status={msg.status}
          renderUserProfile={renderUserProfile}
          thread={true}
          customAction={moreAction}
          onTranslateMessage={handleTranslateMsg}
          targetLanguage={state.targetLanguage}
        ></TextMessage>
      );
    } else if (msg.type === "audio") {
      return (
        <AudioMessage
          key={msg.id}
          //@ts-ignore
          status={msg.status}
          audioMessage={msg}
          renderUserProfile={renderUserProfile}
          thread={true}
          customAction={moreAction}
        ></AudioMessage>
      );
    } else if (msg.type === "img") {
      return (
        <ImageMessage
          key={msg.id}
          //@ts-ignore
          status={msg.status}
          imageMessage={msg}
          renderUserProfile={renderUserProfile}
          thread={true}
          customAction={moreAction}
        ></ImageMessage>
      );
    } else if (msg.type === "file") {
      return (
        <FileMessage
          key={msg.id}
          //@ts-ignore
          status={msg.status}
          fileMessage={msg}
          renderUserProfile={renderUserProfile}
          thread={true}
          customAction={moreAction}
        ></FileMessage>
      );
    } else if (msg.type === "recall") {
      return (
        <RecalledMessage
          key={msg.id}
          //@ts-ignore
          status={msg.status}
          //@ts-ignore
          message={msg || {}}
        ></RecalledMessage>
      );
    } else if (msg.type === "combine") {
      return (
        <CombinedMessage
          key={msg.id}
          //@ts-ignore
          status={msg.status}
          renderUserProfile={renderUserProfile}
          //@ts-ignore
          combinedMessage={msg}
          thread={true}
          customAction={moreAction}
        ></CombinedMessage>
      );
    }
  };

  const [transDialogOpen, setTransDialogOpen] = useState(false);
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
              onSendMessage: sendMessage,
              enabledTyping: state?.typingSwitch
            }}
            renderMessageList={() => (
              <MessageList renderMessage={renderMessage} />
            )}
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
            <Thread
              messageListProps={{
                renderUserProfile: ({ userId }) => (
                  <CustomUserProfile userId={userId} />
                )
              }}
            ></Thread>
          </div>
        }
      </div>
      <SessionInfoPopover
        open={sessionInfoAddEl}
        onClose={() => setSessionInfoAddEl(null)}
        sessionInfo={sessionInfo}
      />
      {groupSettingAddEl ? (
        <GroupSettingsDialog
          open={groupSettingAddEl}
          authorEl={groupSettingAddEl}
          onClose={() => setGroupSettingAddEl(null)}
          currentGroupId={currentGroupId}
        />
      ) : (
        <></>
      )}
      {isShowReport ? (
        <Report
          open={isShowReport}
          onClose={() => {
            setShowReport(false);
          }}
          currentMsg={currentMsg}
        />
      ) : (
        <></>
      )}
      {showCombineDialog ? (
        <CombineDialog
          open={showCombineDialog}
          onClickItem={sendCombineMsg}
          onClose={() => {
            setShowCombineDialog(false);
          }}
        />
      ) : (
        <></>
      )}
      <TranslateDialog
        open={transDialogOpen}
        onClose={() => {
          setTransDialogOpen(false);
        }}
      ></TranslateDialog>
      <audio id="agoraChatSoundId" src={map3}></audio>
    </div>
  );
}

export default observer(Main);
