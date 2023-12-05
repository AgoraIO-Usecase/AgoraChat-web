
import store from '../../redux/store'
import { searchLoadAction } from '../../redux/actions'
import { publicGroupsAction } from '../../redux/actions'
import { rootStore } from 'agora-chat-uikit'
const getPublicGroups = () => {
    let limit = 200;
    let options = {
        limit: limit
        // cursor: cursor,
    };
    rootStore.client.listGroups(options).then((res) => {
        store.dispatch(publicGroupsAction(res.data))
        store.dispatch(searchLoadAction(false))
    })
}

export default getPublicGroups;




