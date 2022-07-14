
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { searchLoadAction } from '../../redux/actions'
import { publicGroupsAction } from '../../redux/actions'
const getPublicGroups = () => {
    let limit = 200;
    let options = {
        limit: limit
        // cursor: cursor,
    };
    WebIM.conn.listGroups(options).then((res) => {
        store.dispatch(publicGroupsAction(res.data))
        store.dispatch(searchLoadAction(false))
    })
}

export default getPublicGroups;




