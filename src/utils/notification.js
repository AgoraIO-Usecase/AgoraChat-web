import store from '../redux/store'
import { setMuteDataObj, setUnread } from '../redux/actions'
import { EaseApp } from "chat-uikit2"
let options = {
  requireInteraction: false, // 是否自动消失
  body: 'new message', // 展示的具体内容
  tag: '', // 唯一值供记录用
  // body: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp01%2F1ZZQ20QJS6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648367265&t=c26344538c227e42c92ac1b26d4f9c65',
  icon: '/Favicon@2x.png',
  // icon: '/logo192.png',
  image: '',
  data: '', // 附带的数据，可以在展示时获取，然后用做具体的情况使用
  lang: '', // 语言
  dir: 'auto', // 文字方向
  renotify: false, // 允许覆盖
  // silent: false, // 静音属性为true时不能和vibrate一起使用
  // badge: '',
  // vibrate: [200, 100, 200], // 设备震动频率
  // sound: '',
  // actions: [
  //     {
  //         action: '',
  //         title: '',
  //         icon: ''
  //     }
  // ]
}
function twoMethod(params, iconTitle) {
  options = { ...options, ...params }
  const bodyList = options.body.split('?')
  options.body = bodyList[0]
  var notification = new Notification(options.title || 'New Message', options);
  const session = {}
  notification.onclick = (res) => {
    bodyList[1]?.split('&')?.forEach(item => {
      const [first, second] = item?.split('=')
      session[first] = second
    })
    const { sessionType, sessionId } = session
    if (sessionType && sessionId) {
      const { unread } = store.getState()
      unread[sessionType][sessionId].fakeNum = 0
      store.dispatch(setUnread(unread))
      changeTitle()
    }
    changeIcon(iconTitle)
  }
  notification.addEventListener('show', e => {
    setTimeout(notification.close.bind(notification), 2000)
  })
}
export function notifyMe(params, iconTitle) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
    twoMethod(params, iconTitle)
    // var notification = new Notification('New Message', {body: params.body});
  }
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        twoMethod(params, iconTitle)
        // var notification = new Notification('New Message', {body: params.body});
      }
    });
  }
}
export const checkBrowerNotifyStatus = (showFlag, params, iconTitle) => {
  if (!('Notification' in window)) {
    alert("This browser does not support desktop notification")
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(e => {
      if (e === 'granted' && showFlag) {
        notification(params, iconTitle)
      } else if (e !== 'granted') {
        alert("Please set browser support notification")
      }
    })
  } else if (Notification.permission === 'denied') {
    alert("Please set browser support notification")
  }
}
export const notification = (params, iconTitle) => {
  options = { ...options, ...params }
  if (Notification?.permission === "granted") {
    const bodyList = options.body.split('?')
    options.body = bodyList[0]
    var notification = new Notification(options.title || 'New Message', options);
    const session = {}
    notification.onclick = (res) => {
      bodyList[1]?.split('&')?.forEach(item => {
        const [first, second] = item?.split('=')
        session[first] = second
      })
      const { sessionType, sessionId } = session
      if (sessionType && sessionId) {
        const { unread } = store.getState()
        unread[sessionType][sessionId].fakeNum = 0
        store.dispatch(setUnread(unread))
        changeTitle()
      }
    }
    notification.addEventListener('show', e => {
      setTimeout(notification.close.bind(notification), 2000)
    })
    changeIcon(iconTitle)
  } else {
    checkBrowerNotifyStatus(true, params, iconTitle)
  }
}
export const changeIcon = (iconTitle = {}) => {
  const changeFavicon = link => {
    let $favicon = document.querySelector('link[rel="icon"]');
    // If a <link rel="icon"> element already exists,
    // change its href to the given link.
    if ($favicon !== null) {
      $favicon.href = link;
      // Otherwise, create a new element and append it to <head>.
    } else {
      $favicon = document.createElement("link");
      $favicon.rel = "icon";
      $favicon.href = link;
      document.head.appendChild($favicon);
    }
  };
  let icon = iconTitle.iconLink || '/Favicon@2x.png'; // 图片地址
  changeFavicon(icon); // 动态修改网站图标
  changeTitle()
}

export const changeTitle = () => {
  const { unread } = store.getState()
  let num = 0
  for (let item in unread) {
    for (let val in unread[item]) {
      if (val) {
        num += unread[item][val].fakeNum
      }
    }
  }
  const title = num === 0 ? 'Agora chat' : `(${num}) new message` // 网站标题
  document.title = title; // 动态修改网站标题
}

export const notify = () => {
  checkBrowerNotifyStatus().then(res => {
    if (Notification?.permission === 'default') {
      Notification.requestPermission(function () {
        notify();
      });
    } else if (Notification?.permission === 'granted') {
      var n = new Notification("'New message from Liz", options);
      n.onclick = function () {
        // this.close();
      };
      n.onclose = function () {
      };
      changeIcon()
    }
  })
}

export const handlerTime = (time, flag) => {
  let timeList = ''
  if (!flag) {
    time = getMillisecond(time)
    timeList = new Date(new Date().getTime() + (time)).toString().split(' ')
  } else {
    timeList = new Date(time).toString().split(' ')
  }
  return `${timeList[1]} ${timeList[2]}, ${timeList[3]}, ${timeList[4].substring(0, 5)}`
}

export const getMillisecond = (time) => {
  switch (time) {
    case 15:
      return 15 * 60 * 1000
    case '8AM':
      return timeNowToTomorrow8AM()
    case 'none':
      return 30 * 24 * 60 * 60 * 1000
    default:
      return time * 60 * 60 * 1000
  }
}

export function toLocaleString(time) {
  return time.toLocaleString().split(' ')[1].substr(0, 5)
}

export const computedItervalTime = (time) => {
  if (time === 8) {
    if (toLocaleString(new Date()) === '00:00') {
      return '24:00-08:00'
    } else {
      return toLocaleString(new Date()) + '-' + toLocaleString(new Date(new Date().getTime() + getMillisecond(time)))
    }
  } else if (time === 'none') {
    return '00:00-24:00'
  } else if (time === '8AM') {
    return toLocaleString(new Date()) + ':00-08:00:00'
  } else {
    return toLocaleString(new Date()) + '-' + toLocaleString(new Date(new Date().getTime() + getMillisecond(time)))
  }
}

export function timeNowToTomorrow8AM() {
  const d = new Date()
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 24)
  const cha = d0.getTime() - d.getTime()
  return cha + (8 * 60 * 60 * 1000)
}

export const timeIntervalToMinutesOrHours = (timeStr, selfFlag) => {
  const timeList = []
  timeStr.split('-').forEach(item => {
    item.split(':').forEach(val => {
      timeList.push(Number(val))
    })
  })
  if (timeList.length === 6) {
    return 4
  }
  let hours = 0
  if (timeList[2] === 0) {
    timeList[2] = 24
  }
  hours = timeList[2] - timeList[0]
  let minutes = 0
  if (timeList[3] < timeList[1]) {
    minutes = timeList[3] + 60 - timeList[1]
  } else {
    minutes = timeList[3] - timeList[1]
  }

  if (hours < 2 && minutes === 15) {
    // 15分钟
    return 0
  } else if (minutes === 0) {
    if (hours === 1) {
      // 1个小时
      return 1
    } else if (hours === 3) {
      // 3个小时
      return 2
    } else if (hours === 8) {
      // 8个小时
      if (selfFlag) {
        return 3
      } else {
        return 2
      }
    } else if (hours === 24) {
      // 永久
      return 5
    } else if (hours === 0) {
      // 24个小时
      if (selfFlag) {
        return 4
      } else {
        return 3
      }
    }
  }
}

export function setTimeVSNowTime(setterObj, falseFlag) {
  const nowTime = new Date().getTime()
  if (falseFlag) {
    return (nowTime - setterObj.ignoreDuration) >= 0
  }
  if ((nowTime - setterObj.ignoreDuration) >= 0) {
    const collectObj = {
      [setterObj.id]: false
    }
    const collectObj1 = {
      [setterObj.id]: {
        muteFlag: false
      }
    }
    store.dispatch(setMuteDataObj(collectObj))
    // EaseApp.changePresenceStatus(collectObj1)
  }
}

export function getLocalStorageData() {
  return localStorage.getItem('soundPreviewText') ? JSON.parse(localStorage.getItem('soundPreviewText')) : {}
}

export const playSound = () => {
  const agoraChatSoundId = window.document.getElementById('agoraChatSoundId')
  agoraChatSoundId.play()
}
export const randomNumber = () => {
  return parseInt(Math.random() * 10000 + new Date().getTime())
}