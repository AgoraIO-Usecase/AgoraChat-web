import axios from 'axios'

export function getRtctoken(params) {
    const { channel, agoraId, username } = params;
    const url = `https://a41.easemob.com/token/rtc/channel/${channel}/agorauid/${agoraId}?userAccount=${username}`
    return axios
        .get(url)
        .then(function (response) {
            console.log('getRtctoken', response)
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}
export function getConfDetail(username, channelName) {
    const url = `https://a41.easemob.com/agora/channel/mapper?channelName=${channelName}&userAccount=${username}`

    return axios.get(url)
        .then(function (response) {
            let members = response.data.result
            return members
        })
        .catch(function (error) {
            console.log(error);
        });
}