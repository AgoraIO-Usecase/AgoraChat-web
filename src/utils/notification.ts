import { rootStore } from "agora-chat-uikit";
const options = {
  requireInteraction: false, // Does it disappear automatically
  body: "new message", // Displayed content
  tag: "", // Unique value for recording employment
  // body: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp01%2F1ZZQ20QJS6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648367265&t=c26344538c227e42c92ac1b26d4f9c65',
  icon: "/Favicon@2x.png",
  image: "",
  data: "", // The accompanying data can be obtained during presentation and used for specific situations
  lang: "", // language
  dir: "auto", // direction
  renotify: false, // overlays allowed
  silent: false,
  // badge: '',
  // vibrate: [200, 100, 200], // Equipment vibration frequency
  // sound: '',
  // actions: [
  //     {
  //         action: '',
  //         title: '',
  //         icon: ''
  //     }
  // ]
};
let hasRequestPermission = false;
export const checkBrowerNotifyStatus = (
  showFlag: boolean,
  params: any,
  iconTitle: string,
  store: any
) => {
  if (hasRequestPermission) {
    return;
  }
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((e) => {
      hasRequestPermission = true;
      if (e === "granted" && showFlag) {
        notification(params, iconTitle, store);
      } else if (e !== "granted") {
        alert("Please allow the browser to send notifications");
      }
    });
  } else if (Notification.permission === "denied") {
    alert("Please allow the browser to send notifications");
  }
};
export const notification = (iconTitle: string, params: any, store: any) => {
  const config = { ...options, ...params };

  const state = store.getState();
  const appConfig = state.appConfig;
  if (!appConfig.notification) return;
  const { chatType, from, to, ext } = params;
  let conversationId = "";
  if (chatType === "singleChat") {
    conversationId = from;
  } else {
    conversationId = to;
  }
  const conversationList = rootStore.conversationStore.conversationList;
  const conversation = conversationList.find(
    (item: any) => item.conversationId === conversationId
  );
  if (conversation?.chatType === "singleChat" && conversation?.silent) {
    return;
  }
  if (conversation?.chatType === "groupChat" && conversation?.silent) {
    if (
      !(
        ext.em_at_list.includes(rootStore.client.user) ||
        ext.em_at_list === "ALL"
      )
    ) {
      return;
    }
  }
  const bodyList = config.body.split("?");
  config.body = bodyList[0];
  if (Notification?.permission === "granted") {
    var notification = new Notification(config.title || "New Message", config);
    const session = {};
    notification.onclick = (res: any) => {
      //   bodyList[1]?.split("&")?.forEach((item: any) => {
      //     const [first, second] = item?.split("=");
      //     console.log("first", first, "second", second);
      //     // session[first] = second;
      //   });
      //   const { sessionType, sessionId } = session;
      //   if (sessionType && sessionId) {
      //     const { unread } = store.getState();
      //     unread[sessionType][sessionId].fakeNum = 0;
      //     store.dispatch(setUnread(unread));
      //     changeTitle();
      //   }
    };
    notification.addEventListener("show", (e) => {
      setTimeout(notification.close.bind(notification), 2000);
    });
    // changeIcon(iconTitle);
  } else {
    checkBrowerNotifyStatus(true, params, iconTitle, store);
  }
};
