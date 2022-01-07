
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import { groupListAciton, searchLoadAction } from '../../redux/actions'
const getGroups = () => {
    WebIM.conn.getGroup().then((res) => {
        console.log('getGroups>>>',res);
        store.dispatch(groupListAciton(res.data))
        store.dispatch(searchLoadAction(false))
    })
}

export default getGroups;
