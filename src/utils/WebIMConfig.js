/**
 * git do not control webim.config.js
 * everyone should copy webim.config.js.demo to webim.config.js
 * and have their own configs.
 * In this way , others won't be influenced by this config while git pull.
 */

// for react native
// var location = {
//     protocol: "https"
// }

var config = {
    /*
     * Server
     */
    // socketServer: getUrl().socketUrl, //(window.location.protocol === "https:" ? "https:" : "http:") + "//im-api-v2.easemob.com/ws",
    // restServer: getUrl().apiUrl, //(window.location.protocol === "https:" ? "https:" : "http:") + "//a1.easemob.com",
    /*
     * Application AppKey
     */
    appkey: '41117440#383391', // 41117440#383391  61117440#460199
    /*
     * Application Host
     */
    Host: 'easemob.com',
    /*
     * Whether to use HTTPS
     * @parameter {Boolean} true or false
     */
    https: true,
    isHttpDNS: true,
    /*
     * isMultiLoginSessions
     * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
     * false: A visitor can sign in to only one webpage and receive messages at the webpage.
     */
    isMultiLoginSessions: true,
    /**
     * @parameter {Boolean} true or false
     */
    isSandBox: false, 
    /**
     * Whether to console.log
     * @parameter {Boolean} true or false
     */
    isDebug: true,
    /**
     * will auto connect the websocket server autoReconnectNumMax times in background when client is offline.
     * won't auto connect if autoReconnectNumMax=0.
     */
    autoReconnectNumMax: 10,
    /**
     * webrtc supports WebKit and https only
     */
    // isWebRTC: window.RTCPeerConnection && /^https\:$/.test(window.location.protocol),
    /*
     * Upload pictures or file to your own server and send message with url
     * @parameter {Boolean} true or false
     * true: Using the API provided by SDK to upload file to huanxin server
     * false: Using your method to upload file to your own server
     */
    // useOwnUploadFun: false,

    /*
     * Set to auto sign-in
     */
    isAutoLogin: true,
    /**
     * Size of message cache for person to person
     */
    p2pMessageCacheSize: 500,
    /**
     * When a message arrived, the receiver send an ack message to the
     * sender, in order to tell the sender the message has delivered.
     * See call back function onReceivedMessage
     */
    delivery: false,
    /**
     * Size of message cache for group chating like group, chatroom etc. For use in this demo
     */
    groupMessageCacheSize: 200,
    /**
     * 5 actual logging methods, ordered and available:
     * 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'
     */
    loglevel: 'ERROR',

    /**
     * enable localstorage for history messages. For use in this demo
     */
    enableLocalStorage: true,

    // deviceId: 'webim',
};
export default config;
