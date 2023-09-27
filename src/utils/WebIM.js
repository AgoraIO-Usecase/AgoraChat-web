

// import { EaseApp } from "chat-uikit";
import { EaseApp } from "agora-chat-uikit";

const WebIM = EaseApp.getSdk({ appkey: `${process.env.AGORA_CHAT_ORG_NAME}#${process.env.AGORA_CHAT_APP_NAME}` })
EaseApp.thread.setHasThreadEditPanel(true)

export default WebIM;
