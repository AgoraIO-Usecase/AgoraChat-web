

// import { EaseApp } from "chat-uikit";
import { EaseApp } from "agora-chat-uikit";

const WebIM = EaseApp.getSdk({ appkey: "41117440#383391" })
EaseApp.thread.setHasThreadEditPanel(true)

export default WebIM;
