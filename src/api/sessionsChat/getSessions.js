import WebIM from '../../utils/WebIM'

const getSessions = () => {
    WebIM.conn.getConversationlist().then((res) => {
       console.log('session list res', res);
    });
}

export default getSessions;
