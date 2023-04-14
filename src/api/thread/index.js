import WebIM from '../../utils/WebIM'
// import { EaseApp } from "chat-uikit";

import { EaseApp } from "agora-chat-uikit";
import store from '../../redux/store'
import { message } from "../../components/common/alert"
import { setThreadInfo } from "../../redux/actions";

import { rootStore } from 'chatuim2'
export const getThreadMembers = (threadId, isScroll) => {
    let state = store.getState();
    let options = {
        chatThreadId: threadId,
        pageSize: 20,
        cursor: isScroll === 'isScroll' ? state.thread?.cursor || '' : '',
    };
    rootStore.client.getChatThreadMembers(options).then((res) => {
        if (res.data.affiliations.length > 0) {
            let data = {
                membersList: res.data.affiliations,
                cursor: res.properties?.cursor || ''
            }
            if (res.data.affiliations.length < options.limit) {
                data.isLast = true;
            }
            if (isScroll === 'isScroll') {
                data = {
                    data,
                    isScroll
                }
            }
            store.dispatch(setThreadInfo(data))
        }
    }).catch(() => {
        message.warn('Error Message needed to add details info');
    })
}
export const removeMemberFromThread = (options) => {
    rootStore.client.removeChatThreadMember(options).then((res) => {
    }).catch(e => {
        message.warn('Error Message needed to add details info');
    })
}
export const changeThreadName = (options) => {
    rootStore.client.changeChatThreadName(options).then((res) => {
    }).catch(e => {
        message.warn('Error Message needed to add details info');
    })
}
export const leaveThread = (options) => {
    rootStore.client.leaveChatThread(options).then((res) => {
        EaseApp.thread.closeThreadPanel()
        message.warn('You have exited this thread');
    }).catch(e => {
        message.warn('Error Message needed to add details info');
    })
}
export const destroyThread = (options) => {
    rootStore.client.destroyChatThread(options).then((res) => {
    }).catch(e => {
        message.warn('Error Message needed to add details info');
    })
}
export const handlerThreadChangedMsg = (msg) => {
    const threadId = store.getState().thread?.threadId;
    switch (msg.operation) {
        case 'chatThreadLeave': {
            //user leave from other device
            if (msg.chatThreadId === threadId) {
                store.dispatch(setThreadInfo({ currentEditPage: '' }))
                message.warn('You have exited this thread on another device');
            }
            break;
        }
        default:
            break;

    }
}