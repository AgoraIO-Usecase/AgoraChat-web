import _ from 'lodash'
import avatarIcon1 from '../assets/avatar1.png'
import avatarIcon2 from '../assets/avatar2.png'
import avatarIcon3 from '../assets/avatar3.png'
import avatarIcon4 from '../assets/avatar4.png'
import avatarIcon5 from '../assets/avatar5.png'
import avatarIcon6 from '../assets/avatar6.png'
import avatarIcon7 from '../assets/avatar7.png'
import avatarIcon11 from '../assets/avatar11.png'

let userAvatars = {
  1: avatarIcon1,
  2: avatarIcon2,
  3: avatarIcon3,
  4: avatarIcon4,
  5: avatarIcon5,
  6: avatarIcon6,
  7: avatarIcon7,
}
export function userAvatar (id) {
  let adminInfo = JSON.parse(sessionStorage.getItem('webim_auth'))
  if (adminInfo && adminInfo.agoraId === id) {
    let adminAvatar = Number(localStorage.getItem('avatarIndex_1.0'))
    return userAvatars[adminAvatar + 1] || avatarIcon11
  } else {
    let usersInfoData = localStorage.getItem("usersInfo_1.0")
    let avatarSrc = "";
    if (usersInfoData) {
      usersInfoData = JSON.parse(usersInfoData)
    }
    let findIndex =  _.find(usersInfoData, { username: id }) || ''
    avatarSrc = userAvatars[findIndex.userAvatar] || avatarIcon11
    return avatarSrc
  }
}

function imgUrlToFile(e) {
	var imgLink = e.currentSrc;
	var tempImage = new Image();
  tempImage.setAttribute('crossorigin', 'anonymous')
  tempImage.src = imgLink;
	return new Promise((resolve,reject) => {
    tempImage.onload = function() {
      var base64 = getBase64Image(tempImage);
      var imgblob = base64toBlob(base64);
          //获取原文件名称
      var filename = getFileName(e.currentSrc);
      var coverFile = blobToFile(imgblob, filename);
      const param = {
        target: {
          files: {
            ...coverFile,
            length: 1,
            item: () => coverFile
          }
        }
      }
      resolve(param)
    };
  })
}
function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	// var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
	var dataURL = canvas.toDataURL("image/gif");
	return dataURL;
}
function base64toBlob(base64) {
	let arr = base64.split(","),
	mime = arr[0].match(/:(.*?);/)[1],
	bstr = atob(arr[1]),
	n = bstr.length,
	u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}
function blobToFile(blob, filename) {
  // var file = new File(blob, filename)
  // console.log(file)
  // const file = new window.File(
  //   [blob],
  //   filename,
  //   { type: 'image/gif' }
  // )
	blob.lastModifiedDate = new Date();
	blob.name = filename;
  const url = window.URL.createObjectURL(blob);
  console.log(url)
	return blob;
}
function getFileName(url) {
	let pos = url.lastIndexOf("/")
	return url.substring(pos + 1)
}