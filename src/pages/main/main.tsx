import { useEffect, FC, useRef } from "react";
import { observer } from "mobx-react-lite";
import toast from "react-hot-toast";
import { useClient, Icon, eventHandler } from "agora-chat-uikit";
import "agora-chat-uikit/style.css";
import "./main.scss";
import NavigationBar from "../../components/navigationBar/navigationBar";
import ChatContainer from "../chatContainer/chatContainer";
import Contacts from "../contacts/contacts";
import Settings from "../settings/settings";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import { loginWithToken } from "../../store/loginSlice";

const ChatApp: FC<any> = () => {
  const dispatch = useAppDispatch();
  const client = useClient();
  useEffect(() => {
    const webImAuth = sessionStorage.getItem("webImAuth");

    let webImAuthObj = {
      userId: "",
      password: "",
      chatToken: "",
      agoraUid: "",
    };
    // Automatically log in when refreshing the webpage
    if (webImAuth && !client.token) {
      webImAuthObj = JSON.parse(webImAuth);
      if (webImAuthObj.password) {
        client.open({
          user: webImAuthObj.userId,
          pwd: webImAuthObj.password,
        });
      } else {
        dispatch(
          loginWithToken({
            userId: webImAuthObj.userId,
            chatToken: webImAuthObj.chatToken,
            agoraUid: webImAuthObj.agoraUid,
          })
        );
      }
    }
  }, [client]);

  const state = useAppSelector((state) => state.login);
  const navigate = useNavigate();
  useEffect(() => {
    if (!state.loggedIn) {
      navigate("/login");
    }
  }, [state.loggedIn]);

  const navRef = useRef<any>(null);
  const chatContainerRef = useRef<any>(null);
  return (
    <div className="main-container">
      <NavigationBar
        ref={navRef}
        tabs={[
          {
            title: "Message",
            icon: <Icon type="BUBBLE_FILL" width={28} height={28}></Icon>,
            content: <ChatContainer ref={chatContainerRef} />,
            unmountOnExit: false, // Ensure the audio/video call window remains visible when switching.
          },
          {
            title: "Contacts",
            icon: (
              <Icon type="PERSON_DOUBLE_FILL" width={28} height={28}></Icon>
            ),
            content: (
              <Contacts
                onMessageClick={() => {
                  navRef.current?.changeTab(0);
                }}
                onAudioCall={() => {
                  navRef.current?.changeTab(0);
                  chatContainerRef.current?.startAudioCall();
                }}
                onVideoCall={() => {
                  navRef.current?.changeTab(0);
                  chatContainerRef.current?.startVideoCall();
                }}
              />
            ),
            unmountOnExit: true,
          },
          {
            title: "Settings",
            icon: <Icon type="HAMBURGER" width={28} height={28}></Icon>,
            content: <Settings></Settings>,
            unmountOnExit: true,
          },
        ]}
      ></NavigationBar>
    </div>
  );
};

export default observer(ChatApp);
