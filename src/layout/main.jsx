import React, { useState, useEffect, useCallback,useRef } from "react";
import Header from "../components/appbar";
import "./login.css";
import getGroupInfo from "../api/groupChat/getGroupInfo";
import { loginWithToken } from "../api/loginChat";
import { createHashHistory } from "history";
import store from "../redux/store";
import { Tooltip } from "@material-ui/core";
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
import { statusImgObj } from "../components/appbar/chatGroup/memberInfo";
import customIcon from "../assets/custom.png";
import { makeStyles } from "@material-ui/core/styles";
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
  NoticeMessage,
  Icon,
  Avatar,
  useSDK,
  useAddressContext
  // ConversationItem
} from "agora-chat-uikit";
import "agora-chat-uikit/style.css";
import CombineDialog from "../components/combine";
import { observer } from "mobx-react-lite";
import { message } from "../components/common/alert";
import InviteModal from '../components/inviteModal'
const history = createHashHistory();
const appId = '15cb0d28b87b425ea613fc46f7c9f974';

const useStyles = makeStyles(() => {
  return {
    avatarWrap: {
      position: "relative",
      cursor: "pointer",
      marginRight: '12px'
    },
    presenceWrap: {
      borderRadius: "50%",
      width: "15px",
      height: "15px",
      background: "#fff",
      textAlign: "center",
      position: "absolute",
      lineHeight: "15px",
      bottom: "-2px",
      right: "-5px"
    },
    presenceImgStyle: {
      width: "13px",
      height: "13px",
      borderRadius: "50%"
    }
  };
});

function Main() {
  // set sdk log level
  const {AgoraRTC, ChatSDK} = useSDK()
  AgoraRTC.setLogLevel(4)
  ChatSDK.logger.setLevel(0)
  const {getGroupMembers: getGroupMembersUIKit} = useAddressContext()

  const [sessionInfoAddEl, setSessionInfoAddEl] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({});
  const [groupSettingAddEl, setGroupSettingAddEl] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState("");
  const [isShowReport, setShowReport] = useState(false);
  const [currentMsg, setCurrentMsg] = useState({});
  const { currentCvs } = rootStore.conversationStore;
  const userInfo =
    rootStore.addressStore?.appUsersInfo?.[currentCvs?.conversationId];
  let presenceExt = userInfo?.isOnline
    ? userInfo?.presenceExt || "Online"
    : "Offline";
  const classes = useStyles();

  const renderUserProfile = useCallback(
    ({ userId }) => {
      return currentCvs.chatType === "groupChat" ? (
        <CustomUserProfile userId={userId} />
      ) : null;
    },
    [currentCvs]
  );

  const getChatAvatarUrl = () => {
    const cvs = currentCvs;
    if (cvs.chatType === "singleChat") {
      return rootStore.addressStore.appUsersInfo[cvs.conversationId]?.avatarurl;
    } else {
      return "";
    }
  };

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
        rootStore.conversationStore.topConversation({
          chatType: combineData.chatType,
          conversationId: combineData.to
        })
        rootStore.messageStore.setSelectedMessage(currentCvs, {
          selectable: false,
          selectedMessage: []
        });
        if(rootStore.threadStore.currentThread.visible){
          rootStore.messageStore.setSelectedMessage({
            chatType: 'groupChat',
            conversationId: rootStore.threadStore.currentThread.info.id
          }, {
            selectable: false,
            selectedMessage: []
          });
        }
        
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
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
    if (data.typingSwitch) {
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
    
    const data = getLocalStorageData();
    const targetLanguage = state?.targetLanguage;
    console.log("state", targetLanguage, targetLanguage, data.translateSwitch);
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
    let moreAction = selfMoreAction;
    // add report button
    if (msg.from !== rootStore.client.user) {
      moreAction = targetMoreAction;
    }
    if (msg.type === "txt") {
      return (
        <TextMessage
          key={msg.id}
          textMessage={{...msg}}
          status={msg.status}
          renderUserProfile={renderUserProfile}
          thread={true}
          customAction={moreAction}
          onTranslateTextMessage={handleTranslateMsg}
          targetLanguage={state.targetLanguage}
          // reactionConfig={{
          //   path: '/assets/',
          //   map: {
          //     'emoji_1':  <img src={customIcon} alt={'emoji_1'} />,
          //     'emoji_2':  <img src={customIcon} alt={'emoji_2'} />,
          //     'emoji_3':  <img src={customIcon} alt={'emoji_3'} />
          //   }
          // }}
        ></TextMessage>
      );
    } else if (msg.type === "audio") {
      return (
        <AudioMessage
          key={msg.id}
          //@ts-ignore
          status={msg.status}
          audioMessage={{...msg}}
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
          imageMessage={{...msg}}
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
          fileMessage={{...msg}}
          renderUserProfile={renderUserProfile}
          thread={true}
          customAction={moreAction}
        ></FileMessage>
      );
    } else if (msg.type === "recall") {
      return (
        <NoticeMessage noticeMessage={{...msg}}></NoticeMessage>
      );
    } else if (msg.type === "combine") {
      return (
        <CombinedMessage
          key={msg.id}
          //@ts-ignore
          status={msg.status}
          renderUserProfile={renderUserProfile}
          //@ts-ignore
          combinedMessage={{...msg}}
          thread={true}
          customAction={moreAction}
        ></CombinedMessage>
      );
    } else if (msg.type == "video" || msg.type == "loc") {
      return (
        <RecalledMessage
          key={msg.id}
          // style={data.style}
          //@ts-ignore
          status={msg.status}
          //@ts-ignore
          message={{...msg}}
        >
          {msg}
        </RecalledMessage>
      );
    }
  };

  const [transDialogOpen, setTransDialogOpen] = useState(false);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  let _resolve = useRef(null)
  const handleInviteToCall = (data) => {
    console.log('handleInviteToCall', data)
    setInviteDialogOpen(true)

    getGroupMembers(data.conversation.conversationId)
    return new Promise((resolve, reject)=> {
      _resolve.current = resolve
    })
  }
  const webimAuth = sessionStorage.getItem("webim_auth");
    let webimAuthObj = {};
    if (webimAuth) {
      webimAuthObj = JSON.parse(webimAuth);
    }
  const getRtcToken = (data) => {
    const webimAuth = sessionStorage.getItem("webim_auth");
    let webimAuthObj = {};
    if (webimAuth) {
      webimAuthObj = JSON.parse(webimAuth);
    }
    return getRtctoken({...data, agoraUid: webimAuthObj.agoraUid})
  }
  const handleAddPerson = async(data) => {
    console.log('handleAddPerson', data)
  //   {
  //     "channel": "41683685",
  //     "token": null,
  //     "type": 2,
  //     "callId": "429206643145",
  //     "callerDevId": "webim_random_1694160229682",
  //     "confrName": "zd2",
  //     "calleeIMName": "zd2",
  //     "callerIMName": "zd3",
  //     "groupId": "182614118957057",
  //     "groupName": "grouptest",
  //     "joinedMembers": [
  //         {
  //             "imUserId": "zd3",
  //             "agoraUid": 527268238
  //         },
  //         {
  //             "imUserId": 935243573,
  //             "agoraUid": 935243573
  //         }
  //     ]
  // }
  const rtcGroup = rootStore.addressStore.groups.filter((item) => {
    return item.groupid == data.groupId
  })
  let members = []
  if(rtcGroup.length > 0) {
    if(!rtcGroup[0]?.members || rtcGroup[0]?.members.length == 0){
      // await getGroupMembers(data.groupId)
      await getGroupMembersUIKit(data.groupId)
    }
    members = rtcGroup[0]?.members.map((item) => {
      const member = {...item}
      if(!item?.attributes?.nickName){
        if(!member.attributes){
          member.attributes = {}
        }
        member.attributes.nickName = rootStore.addressStore.appUsersInfo[item.userId]?.nickname
      }
      if(!item?.attributes?.avatarurl){
        member.attributes.avatarurl = rootStore.addressStore.appUsersInfo[item.userId]?.avatarurl
      }
      return member
    })
  } 
    getGroupMembers(data.groupId)
    const addedPerson = data.joinedMembers.map((item) => {
      let person = {}
      members.forEach((member) => {
        if(member.userId === item.imUserId){
          person = member
        }
      })
      return person
    })
    setAddedMembers(addedPerson)
    setInviteDialogOpen(true)
    
    return new Promise((resolve) => {
      _resolve.current = resolve
    })
  }

  const handleGetIdMap = (data) => {
    console.log('handleGetIdMap', data)

    return getConfDetail(data.userId, data.channel)
  }

  const handleRtcStateChange = (info) => {
    console.log('handleRtcStateChange', info)
    switch (info.type) {
      case 'hangup':
      case 'refuse':
        if (info.type == 'hangup') {
          switch (info.reason) {
            case 'timeout':
              message.info('Timeout.')
              break;
            case 'refused':
              message.error('Declined.')
              break;
            case 'refuse':
              message.info('Declined.')
              break;
            case 'cancel':
              message.info('Hung Up.')
              break;
            case 'accepted on other devices':
              message.info('Answered on another device.')
              break;
            case 'refused on other devices':
              message.error('Rejected on another device.')
              break;
            case 'processed on other devices':
              message.info('Handled on another device.')
              break;
            case 'busy':
              message.warn('The other party is busy.')
              break;
            case 'invitation has expired':
              message.info('Invitation Expired.')
              break;
            case 'user-left':
              message.info('Hung Up.')
              break;
            case 'normal':
              message.info('Canceled')
              break;
            default:
              console.log(info.reason)
              // message.error(info.reason || 'normal hangup')
              break;
          }
        }
        setAddedMembers([])
        break;
      case 'user-published':
        break;
      default:
        break;
    }
  }


  const [groupMembers, setMembers] = useState([]) 
  const [addedMembers, setAddedMembers] = useState([]);
  const getGroupMembers = (groupId) => {
    const rtcGroup = rootStore.addressStore.groups.filter((item) => {
      return item.groupid == groupId
    })
    if(rtcGroup.length > 0) {
      const members = rtcGroup[0].members.map((item) => {
        const member = {...item}
        if(!item?.attributes?.nickName){
          if(!member.attributes){
            member.attributes = {}
          }
          member.attributes.nickName = rootStore.addressStore.appUsersInfo[item.userId]?.nickname
        }
        if(!item?.attributes?.avatarurl){
          member.attributes.avatarurl = rootStore.addressStore.appUsersInfo[item.userId]?.avatarurl
        }
        return member
      })
      setMembers(members)
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
          // renderItem={csv => <ConversationItem key={csv.conversationId} data={csv} />}
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
              avatar: (
                <div
                  onClick={handleClickSessionInfoDialog}
                  className={classes.avatarWrap}
                >
                  <Avatar src={getChatAvatarUrl()}>
                    {currentCvs?.name || currentCvs?.conversationId}
                  </Avatar>
                  {currentCvs.chatType === "singleChat" && (
                    <Tooltip title={presenceExt} placement="bottom-end">
                      <div className={classes.presenceWrap}>
                        <img
                          className={classes.presenceImgStyle}
                          alt={presenceExt}
                          src={statusImgObj[presenceExt] || customIcon}
                        />
                      </div>
                    </Tooltip>
                  )}
                </div>
              )
            }}
            messageInputProps={{
              onSendMessage: sendMessage,
              enabledTyping: state?.typingSwitch
            }}
            // renderMessageList={() => (
            //   <MessageList renderMessage={renderMessage} messageProps={{}}/>
            // )}
            messageListProps={{
              renderUserProfile:renderUserProfile,
              messageProps: {
                reaction: true,
                thread: true,
                customAction: {
                  visible: true,
                  icon: null,
                  actions: [
                    {
                      content: "REPLY",
                      onClick: () => {},
                    },
                    {
                      content: "UNSEND",
                      onClick: () => {},
                    },
                    {
                      content: "Modify",
                      onClick: () => {},
                    },
                    {
                      content: "SELECT",
                      onClick: () => {},
                    },
                    {
                      content: "TRANSLATE",
                      onClick: () => {},
                    },
                    {
                      content: "REPORT",
                      onClick: () => {},
                    },
                    {
                      content: "DELETE",
                      onClick: () => {},
                    },
                  ],
                },
              },
            }}
       
            rtcConfig={{
              onInvite: handleInviteToCall,
              agoraUid: webimAuthObj.agoraUid || '',
              onAddPerson: handleAddPerson,
              getIdMap: handleGetIdMap,
              onStateChange: handleRtcStateChange,
              appId: appId,
              getRTCToken: getRtcToken
            }}  
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
                renderUserProfile: () => null,
                messageProps: {
                  onTranslateTextMessage: handleTranslateMsg
                }
              }}
              messageInputProps={{
                onSendMessage: sendMessage,
                enabledTyping: state?.typingSwitch
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

      {
        <GroupSettingsDialog
          open={groupSettingAddEl}
          authorEl={groupSettingAddEl}
          onClose={() => setGroupSettingAddEl(null)}
          currentGroupId={currentGroupId}
        />
      }
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
      <InviteModal open={inviteDialogOpen} members={groupMembers} onClose={() => {
        setInviteDialogOpen(false)
      }} joinedMembers={addedMembers} onCall={(members) => {
        _resolve.current(members)
        setInviteDialogOpen(false)
      }}></InviteModal>
    </div>
  );
}

export default observer(Main);
