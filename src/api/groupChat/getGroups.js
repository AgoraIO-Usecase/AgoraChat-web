
import store from '../../redux/store'
import { groupListAction, searchLoadAction } from '../../redux/actions'
import { getSilentModeForConversations } from '../notificationPush/index'
import { rootStore } from 'agora-chat-uikit'
const getGroups = () => {
    rootStore.client.getGroup().then((res) => {
        console.log('getGroups>>>', res);
        const conversationList = []
        res.data.forEach(item => {
            conversationList.push({
                id: item.groupid,
                type: 'groupChat'
            })
            // WebIM.conn.getChatThreads({parentId: item.groupid}).then(res => {
            //     const conversationList1 = []
            //     res.entities.forEach(val => {
            //         conversationList1.push({
            //             id: val.id,
            //             type: 'groupChat',
            //             flagType: 'threading'
            //         })
            //     })
            //     if (conversationList1.length) {
            //         getSilentModeForConversations({conversationList: conversationList1})
            //     }
            // })
        })
        if (conversationList.length) {
            getSilentModeForConversations({ conversationList })
        }
        store.dispatch(groupListAction(res.data))
        store.dispatch(searchLoadAction(false))
    })
}

export default getGroups;
