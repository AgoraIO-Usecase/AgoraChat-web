import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from "react";
import {
  Chat,
  GroupDetail,
  ContactList,
  ContactDetail,
  Header,
  rootStore,
  ConversationList,
  Provider,
  useClient,
  Icon,
  Avatar,
  MessageList,
  useConversationContext,
  useChatContext,
  UserSelect,
  TextMessage,
  GroupMember,
  Modal,
  Input,
  eventHandler,
  Thread,
  PinnedMessage,
  usePinnedMessage,
  RootContext,
  Empty,
} from "agora-chat-uikit";
import toast from "../../components/toast/toast";
import { APP_ID, appKey } from "../../config";
import { getRtcToken, getRtcChannelMembers } from "../../service/rtc";
import { getGroupAvatar } from "../../service/avatar";
import UserInviteModal from "../../components/userInviteModal/userInviteModal";
import "./chatContainer.scss";
import UserInfo from "../../components/userInfo/userInfo";
import { observer } from "mobx-react-lite";
import { useAppSelector, useAppDispatch } from "../../hooks";
import CreateChat from "./createChat";
import classNames from "classnames";
import i18next from "../../i18n";
import chats from "../../assets/chats@2x.png";
const ChatContainer = forwardRef((props, ref) => {
  const state = useAppSelector((state) => state);
  const appConfig = useAppSelector((state) => state.appConfig);
  const [userSelectVisible, setUserSelectVisible] = useState(false); // 是否显示创建群组弹窗
  const [addContactVisible, setAddContactVisible] = useState(false); //是否显示添加联系人弹窗
  const [conversationDetailVisible, setConversationDetailVisible] =
    useState(false); //是否显示群组设置/联系人详情弹窗
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [cvsItem, setCvsItem] = useState<any>([]);
  const [forwardedMessages, setForwardedMessages] = useState<
    Record<string, any>
  >({});
  const [contactListVisible, setContactListVisible] = useState(false); // 是否显示单条消息转发弹窗
  const [userInviteModalVisible, setUserInviteModalVisible] = useState(false); // 是否显示音视频邀请人员弹窗
  const [joinedRtcRoomUsers, setJoinedRtcRoomUsers] = useState<
    { userId: string }[]
  >([]); // 已加入音视频房间的用户
  const [userId, setUserId] = useState(""); // 要添加联系人的userId
  const [rtcGroupId, setRtcGroupId] = useState(""); // 当前音视频房间的groupId

  const context = useContext(RootContext);
  const { theme } = context;
  const themeMode = theme?.mode;
  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const isInGroup = rootStore.addressStore.groups.some((item) => {
    // @ts-ignore
    return item.groupid == cvsItem.conversationId;
  });
  const handleEllipsisClick = () => {
    if (cvsItem.chatType == "groupChat") {
      if (thread.showThreadPanel) {
        rootStore.threadStore.setThreadVisible(false);
      }
      if (pinMsgVisible) {
        hidePinMsg();
      }
      isInGroup && setConversationDetailVisible((value) => !value);
    } else {
      setConversationDetailVisible((value) => !value);
    }
  };

  const handleGetIdMap = (data: { userId: string; channel: string }) => {
    return getRtcChannelMembers({
      username: data.userId,
      channelName: data.channel,
    }).then((res) => {
      return res;
    });
  };

  const handleRtcStateChange = (state: any) => {
    console.log("handleRtcStateChange", state);
  };

  const getRtcToken2 = (data: {
    channel: string | number;
    chatUserId: string;
  }) => {
    return getRtcToken({
      channelName: data.channel,
      username: data.chatUserId,
      agoraUid: state.login.agoraUid,
    }).then((res) => {
      const { accessToken } = res;
      return {
        agoraUid: state.login.agoraUid,
        accessToken,
      };
    });
  };

  const [mediaType, setMediaType] = useState<"audio" | "video">("audio");
  const handleInviteUser = (data: any) => {
    setMediaType(data.type);
    setRtcGroupId(data.conversation.conversationId);

    setUserInviteModalVisible(true);
    // getGroupMembers(data.conversation.conversationId)
    setJoinedRtcRoomUsers([{ userId: rootStore.client.user }]);
    return new Promise((resolve, reject) => {
      _resolve.current = resolve;
    });
  };

  const handleRing = (data: any) => {
    if (data.type === 2 || data.type === 3) {
      let groupAvatarUrl = rootStore.addressStore.groups.find(
        (item: any) => item.groupid === data.groupId
      )?.avatarUrl;
      setGroupAvatar(groupAvatarUrl || "");
    }
  };

  let _resolve = useRef<any>(null);
  const thread = rootStore.threadStore;

  const chatRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    startVideoCall: chatRef.current.startVideoCall,
    startAudioCall: chatRef.current.startAudioCall,
  }));

  useEffect(() => {
    // get groups avatar
    if (rootStore.loginState) {
      const groupIds =
        rootStore.addressStore.groups
          .filter((item) => !item.avatarUrl)
          .map((item) => {
            //@ts-ignore
            return item.groupid;
          }) || [];
      getGroupAvatar(groupIds).then((res) => {
        for (let groupId in res) {
          rootStore.addressStore.updateGroupAvatar(groupId, res[groupId]);
        }
      });
    }
  }, [rootStore.loginState, rootStore.addressStore.groups.length]);

  // --- create conversations ---
  const [createChatVisible, setCreateChatVisible] = useState(false);
  let [groupAvatar, setGroupAvatar] = useState("");
  useEffect(() => {
    setConversationDetailVisible(false);
    setCvsItem(rootStore.conversationStore.currentCvs);

    if (rootStore.conversationStore.currentCvs.chatType === "groupChat") {
      let groupAvatarUrl = rootStore.addressStore.groups.find(
        (item: any) =>
          item.groupid === rootStore.conversationStore.currentCvs.conversationId
      )?.avatarUrl;
      setGroupAvatar(groupAvatarUrl || "");
    }
  }, [rootStore.conversationStore.currentCvs]);

  // ---- pin message ----
  const { visible: pinMsgVisible, hide: hidePinMsg } = usePinnedMessage();

  useEffect(() => {
    if (pinMsgVisible) {
      thread.setThreadVisible(false);
      setConversationDetailVisible(false);
    }
  }, [pinMsgVisible]);

  useEffect(() => {
    if (thread.showThreadPanel) {
      hidePinMsg();
      setConversationDetailVisible(false);
    }
  }, [thread.showThreadPanel]);

  // Click on the blank area to close the conversation details
  const detailsRef = useRef<HTMLDivElement>(null);
  const [groupMemberVisible, setGroupMemberVisible] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setConversationDetailVisible(false);
      }
    };

    if (!groupMemberVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [detailsRef, groupMemberVisible]);

  return (
    <div
      className={classNames("chat-container", {
        "chat-container-dark": themeMode === "dark",
      })}
    >
      <div className="chat-container-conversation">
        <ConversationList
          renderHeader={() => (
            <Header
              moreAction={{
                visible: true,
                icon: (
                  <Icon
                    type="PLUS_IN_CIRCLE"
                    width={24}
                    height={24}
                    color={themeMode == "dark" ? "#C8CDD0" : "#464E53"}
                  />
                ),
                actions: [
                  {
                    icon: (
                      <Icon
                        type="BUBBLE_FILL"
                        width={24}
                        height={24}
                        color={themeMode == "dark" ? "#C8CDD0" : "#464E53"}
                      />
                    ),
                    content: i18next.t("newConversation"),
                    onClick: () => {
                      setCreateChatVisible(true);
                    },
                  },
                  {
                    icon: (
                      <Icon
                        type="PERSON_ADD_FILL"
                        width={24}
                        height={24}
                        color={themeMode == "dark" ? "#C8CDD0" : "#464E53"}
                      />
                    ),
                    content: i18next.t("addContact"),
                    onClick: () => {
                      setAddContactVisible(true);
                      // setUserSelectVisible(true);
                    },
                  },
                  {
                    icon: (
                      <Icon
                        type="PERSON_DOUBLE_FILL"
                        width={24}
                        height={24}
                        color={themeMode == "dark" ? "#C8CDD0" : "#464E53"}
                      />
                    ),
                    content: i18next.t("createGroup"),
                    onClick: () => {
                      setUserSelectVisible(true);
                    },
                  },
                ],
                tooltipProps: {
                  placement: "bottomRight",
                },
              }}
              content={
                <div className={`header-content ${themeMode}`}>
                  <img className="header-img" src={chats} alt="" />
                </div>
              }
              avatar={<></>}
            ></Header>
          )}
          onItemClick={(item) => {
            setConversationDetailVisible(false);
            setCvsItem(item);
          }}
          className="conversation-list"
        ></ConversationList>
      </div>

      <div className="chat-container-chat">
        <div
          style={{
            display: "flex",
            flex: 1,
            borderLeft: "1px solid transparent",
            overflow: "hidden",
            transition: "all 0.5s ease",
          }}
        >
          {createChatVisible && (
            <CreateChat
              onClosed={() => {
                setCreateChatVisible(false);
              }}
            />
          )}
          <Chat
            // The MessageList uses Memo to cache message components, and modifying these control display switches requires re rendering the components
            key={
              appConfig.reaction.toString() +
              appConfig.thread.toString() +
              appConfig.translation.toString()
            }
            ref={chatRef}
            onOpenThread={() => {
              if (conversationDetailVisible) {
                setConversationDetailVisible(false);
              }
            }}
            messageListProps={{
              renderUserProfile: () => {
                return null;
              },
              messageProps: {
                // Single forwarding
                onForwardMessage: (msg: any) => {
                  let forwardMsg = { ...msg };
                  if (forwardMsg.type === "video") {
                    forwardMsg.body = {
                      url: forwardMsg.url.split("?")[0],
                      filename: forwardMsg.filename,
                      secret: forwardMsg.secret,
                      file_length: forwardMsg.file_length,
                    };
                    forwardMsg.thumb = "";
                  } else if (forwardMsg.type === "audio") {
                    forwardMsg.body = {
                      url: forwardMsg.url,
                      filename: forwardMsg.filename,
                      secret: forwardMsg.secret,
                      file_length: forwardMsg.file_length,
                      length: forwardMsg.length,
                    };
                  } else if (forwardMsg.type === "file") {
                    forwardMsg.body = {
                      url: forwardMsg.url,
                      filename: forwardMsg.filename,
                      secret: forwardMsg.secret,
                      file_length: forwardMsg.file_length,
                    };
                  }
                  forwardMsg.file && delete forwardMsg.file;
                  forwardMsg.id = Date.now() + "";
                  forwardMsg.from = rootStore.client.user;
                  forwardMsg.ext = {
                    ease_chat_uikit_user_info: {
                      nickname:
                        rootStore.addressStore.appUsersInfo[
                          rootStore.client.user
                        ].nickname,
                      avatarURL:
                        rootStore.addressStore.appUsersInfo[
                          rootStore.client.user
                        ].avatarurl,
                    },
                  };
                  forwardMsg.reactions = undefined;
                  forwardMsg.isChatThread = false;
                  forwardMsg.chatThreadOverview = undefined;
                  forwardMsg.chatThread = undefined;
                  forwardMsg.time = Date.now();
                  // The logic of reusing, merging, and forwarding
                  setForwardedMessages(forwardMsg);
                  setContactListVisible(true);
                },
                reaction: appConfig.reaction,
                thread: appConfig.thread,
                customAction: {
                  visible: true,
                  icon: null,
                  actions: [
                    {
                      content: "FORWARD",
                      onClick: () => {},
                    },
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
                      content: "PIN",
                      onClick: () => {},
                    },
                    {
                      visible: appConfig.translation,
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
            messageInputProps={{
              enabledTyping: true,
              onSendMessage: (msg) => {
                // Send a message callback, if it is a merged forwarded message, display a forwarding pop-up window
                // @ts-ignore
                if (msg.type == "combine") {
                  setForwardedMessages(msg);
                  setContactListVisible(true);
                }
              },
            }}
            headerProps={{
              moreAction: {
                // Disable default behavior and customize more actions
                visible: true,
                actions: [],
              },
              style: { cursor: "pointer" },
              onClickAvatar: handleEllipsisClick,
              onClickEllipsis: handleEllipsisClick,
            }}
            rtcConfig={{
              // @ts-ignore
              onInvite: handleInviteUser,

              onRing: handleRing,
              agoraUid: state.login.agoraUid ?? "",
              getIdMap: handleGetIdMap,
              onStateChange: handleRtcStateChange,
              appId: APP_ID,
              getRTCToken: getRtcToken2,
              //@ts-ignore
              onAddPerson: (data: any) => {
                setMediaType(data.type === 2 ? "video" : "audio");
                setRtcGroupId(data.groupId);
                setUserInviteModalVisible(true);
                const joinedUsers = data.joinedMembers.map(
                  (item: { agoraUid: number; imUserId: string }) => {
                    return { userId: item.imUserId };
                  }
                );
                setJoinedRtcRoomUsers(joinedUsers);
                return new Promise((resolve) => {
                  _resolve.current = resolve;
                });
              },
              groupAvatar: groupAvatar,
            }}
            renderEmpty={() => {
              return (
                <Empty
                  text=""
                  icon={<Icon type="EMPTY" width={120} height={120}></Icon>}
                ></Empty>
              );
            }}
          ></Chat>

          {/** Whether to display group settings */}
          {conversationDetailVisible && (
            <div className="chat-container-chat-right" ref={detailsRef}>
              {cvsItem.chatType == "groupChat" ? (
                <GroupDetail
                  conversation={{
                    chatType: "groupChat",
                    conversationId: cvsItem.conversationId,
                  }}
                  onLeaveGroup={() => {
                    setConversationDetailVisible(false);
                  }}
                  onDestroyGroup={() => {
                    setConversationDetailVisible(false);
                  }}
                  // @ts-ignore
                  groupMemberProps={{
                    onPrivateChat: () => {
                      setConversationDetailVisible(false);
                      setGroupMemberVisible(false);
                    },
                    onAddContact: () => {
                      toast.success("Friend request sent");
                      setGroupMemberVisible(false);
                    },
                  }}
                  onGroupMemberVisibleChange={(visible: boolean) => {
                    setGroupMemberVisible(visible);
                  }}
                  onUserIdCopied={() => {
                    toast.success(i18next.t("copied"));
                  }}
                ></GroupDetail>
              ) : (
                <UserInfo conversation={cvsItem}></UserInfo>
              )}
            </div>
          )}
        </div>
        {/** Whether to display thread*/}
        {thread.showThreadPanel &&
          !pinMsgVisible &&
          !conversationDetailVisible && (
            <div className="chat-container-chat-right">
              <Thread
                messageListProps={{
                  renderUserProfile: () => null,
                  messageProps: {
                    // @ts-ignore
                    onForwardMessage: (msg: { [key: string]: any }) => {
                      let forwardMsg = { ...msg };
                      if (forwardMsg.type === "video") {
                        forwardMsg.body = {
                          url: forwardMsg.url.split("?")[0],
                          filename: forwardMsg.filename,
                          secret: forwardMsg.secret,
                          file_length: forwardMsg.file_length,
                        };
                        forwardMsg.thumb = "";
                      } else if (forwardMsg.type === "audio") {
                        forwardMsg.body = {
                          url: forwardMsg.url,
                          filename: forwardMsg.filename,
                          secret: forwardMsg.secret,
                          file_length: forwardMsg.file_length,
                          length: forwardMsg.length,
                        };
                      } else if (forwardMsg.type === "file") {
                        forwardMsg.body = {
                          url: forwardMsg.url,
                          filename: forwardMsg.filename,
                          secret: forwardMsg.secret,
                          file_length: forwardMsg.file_length,
                        };
                      }
                      forwardMsg.file && delete forwardMsg.file;
                      // @ts-ignore
                      forwardMsg.id = Date.now() + "";
                      // @ts-ignore
                      forwardMsg.from = rootStore.client.user;
                      // @ts-ignore
                      forwardMsg.ext = {
                        ease_chat_uikit_user_info: {
                          nickname:
                            rootStore.addressStore.appUsersInfo[
                              rootStore.client.user
                            ].nickname,
                          avatarURL:
                            rootStore.addressStore.appUsersInfo[
                              rootStore.client.user
                            ].avatarurl,
                        },
                      };
                      // @ts-ignore
                      forwardMsg.reactions = undefined;
                      // @ts-ignore
                      forwardMsg.isChatThread = false;
                      forwardMsg.chatThreadOverview = undefined;
                      forwardMsg.chatThread = undefined;
                      setForwardedMessages(forwardMsg);
                      setContactListVisible(true);
                    },
                    customAction: {
                      visible: true,
                      icon: null,
                      actions: [
                        {
                          content: "REPLY",
                          onClick: () => {},
                        },

                        {
                          content: "TRANSLATE",
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
                          content: "FORWARD",
                          onClick: () => {},
                        },
                        {
                          content: "PIN",
                          onClick: () => {},
                        },
                      ],
                    },
                  },
                }}
                messageInputProps={{
                  onSendMessage: (msg: any) => {
                    if (msg.type == "combine") {
                      setForwardedMessages(msg);
                      setContactListVisible(true);
                    }
                  },
                  // enabledTyping: state?.typingSwitch,
                }}
              ></Thread>
            </div>
          )}

        {/** Whether to display pin messages*/}
        {pinMsgVisible &&
          !thread.showThreadPanel &&
          !conversationDetailVisible && (
            <div className="chat-container-chat-right">
              <PinnedMessage />
            </div>
          )}
      </div>
      {/** Contact pop-up window for creating groups */}
      <UserSelect
        onCancel={() => {
          setUserSelectVisible(false);
        }}
        onConfirm={() => {
          rootStore.addressStore.createGroup(
            selectedUsers.map((user) => user.userId)
          );
          setUserSelectVisible(false);
        }}
        okText={i18next.t("create")}
        enableMultipleSelection
        onUserSelect={(user, users) => {
          setSelectedUsers(users);
        }}
        open={userSelectVisible}
      ></UserSelect>
      {/** Contact pop-up for forwarding messages */}
      <Modal
        open={contactListVisible}
        closable={false}
        onCancel={() => {
          setContactListVisible(false);
        }}
        bodyStyle={{ padding: 0 }}
        footer={null}
      >
        <div style={{ height: "600px" }}>
          <ContactList
            style={{ padding: "24px" }}
            menu={["groups", "contacts"]}
            header={<></>}
            onItemClick={(data) => {
              forwardedMessages.to = data.id;
              forwardedMessages.chatType =
                data.type == "contact" ? "singleChat" : "groupChat";

              //@ts-ignore
              rootStore.messageStore.sendMessage(forwardedMessages);
              setContactListVisible(false);

              rootStore.messageStore.setSelectedMessage(cvsItem, {
                selectable: false,
                selectedMessage: [],
              });
              rootStore.conversationStore.setCurrentCvs({
                chatType: data.type == "contact" ? "singleChat" : "groupChat",
                conversationId: data.id,
                //@ts-ignore
                lastMessage: forwardedMessages,
                name: data.name,
              });
            }}
          ></ContactList>
        </div>
      </Modal>
      {/** Add contact Modal */}
      <Modal
        open={addContactVisible}
        onCancel={() => {
          setAddContactVisible(false);
        }}
        onOk={() => {
          rootStore.addressStore.addContact(userId);
          setAddContactVisible(false);
        }}
        okText={i18next.t("add")}
        closable={false}
        title={i18next.t("addContact")}
      >
        <>
          <div className="add-contact">
            <Input
              placeholder={i18next.t("enterUserID")}
              className="add-contact-input"
              onChange={handleUserIdChange}
            ></Input>
          </div>
        </>
      </Modal>
      {/** Audio and video invitation user component */}
      <UserInviteModal
        title={
          mediaType === "audio"
            ? i18next.t("audioCall")
            : i18next.t("videoCall")
        }
        visible={userInviteModalVisible}
        groupId={rtcGroupId}
        onClose={() => {
          setUserInviteModalVisible(false);
        }}
        onInvite={(users) => {
          _resolve.current(users);
          setUserInviteModalVisible(false);
        }}
        checkedUsers={joinedRtcRoomUsers}
      ></UserInviteModal>
    </div>
  );
});

export default observer(ChatContainer);
