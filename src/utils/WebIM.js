

// import { EaseApp } from "chat-uikit";
import { EaseApp } from "agora-chat-uikit";
import uikit_store from 'agora-chat-uikit/es/redux'
import MessageActions from "agora-chat-uikit/es/redux/message";
import SessionActions from "agora-chat-uikit/es/redux/session";
import GlobalPropsActions from "agora-chat-uikit/es/redux/globalProps";
import {getUsersByIds} from "./http-client";
import store from "../redux/store";
import {setFullNameMap} from "../redux/actions";

const WebIM = EaseApp.getSdk({
    appkey: `${process.env.AGORA_CHAT_ORG_NAME}#${process.env.AGORA_CHAT_APP_NAME}`,
    successLoginCallback: async function() {
        const urlParams = new URLSearchParams(document.location.search);
        const conversationId = urlParams.get('conversationId');
        const {data: contactIds} = await WebIM.conn.getContacts();
        const users = await getUsersByIds(contactIds);

        const fullNameByIdMap = users.result.reduce((acc, item) => {
            return {...acc, [item._id]: `${item.firstName} ${item.secondName}`}
        }, {});

        const conversations = contactIds.map(id => ({
            sessionId: id,
            sessionType: 'singleChat',
            name: fullNameByIdMap?.[id] || id
        }))

        conversations.forEach(conversation =>
            uikit_store.dispatch(SessionActions.deleteSession(conversation.sessionId))
        );

        store.dispatch(setFullNameMap(fullNameByIdMap));

        uikit_store.dispatch(SessionActions.setSessionList(conversations));

        if (conversationId && contactIds.includes(conversationId)) {
            const session = conversations.find(conversation => conversation.sessionId === conversationId);
            uikit_store.dispatch(
                GlobalPropsActions.setGlobalProps({
                    to: conversationId,
                    chatType: session.sessionType,
                    name: fullNameByIdMap[conversationId]
                })
            );
            uikit_store.dispatch(
                MessageActions.fetchMessage(conversationId, session.sessionType)
            );
            uikit_store.dispatch(
                SessionActions.setCurrentSession(conversationId)
            )
        }
    }
})
EaseApp.thread.setHasThreadEditPanel(true)

export default WebIM;
