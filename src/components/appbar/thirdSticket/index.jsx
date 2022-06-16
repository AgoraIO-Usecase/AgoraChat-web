/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { EaseApp } from 'wy-chat';
import {
  searchStiPopSticket,
  usedTickets,
  likeTickets,
  myDownloadTickets,
  ticketsMarket,
  getPackInfo,
  deletePack,
  addOrdelWishPack,
  downloadMarketSticker,
  recentlySentStickers,
  registeringStickerSend,
} from '../../../api/request/stipop'
import _ from "lodash"
import emojiImg from '../../../assets/clock@2x.png'
import search from '../../../assets/magnifying@2x.png'
// import like from '../../../assets/custom.png'
import checkGray from '../../../assets/check_mark_large@2x.png'
import arrow from '../../../assets/chevron_right@2x.png'
import deleteImg from '../../../assets/red@2x.png'
import marketImg from '../../../assets/sticker_bag@2x.png'
import deleteInput from '../../../assets/delete@2x.png'
import downloadImg from '../../../assets/tray_n_arrow_down@2x.png'
import closeImg from '../../../assets/x@2x.png'
import giphyGif from '../../../assets/giphy.gif'

const useStyles = makeStyles((theme) => {
  return {
    emojiBox: {
      position: 'relative',
      height: '35px',
      cursor: 'pointer',
    },
    emojiImg: {
      width: '20px',
      cursor: 'pointer',
    },
    emojiList: {
      maxHeight: '500px',
      overflow: 'auto',
    },
    allBtnBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      margin: '5px 0',
      '& ::-webkit-scrollbar': {
        display: 'none', /* Chrome Safari */
      },
      scrollbarWidth: 'none', /* firefox */
      '-ms-overflow-style': 'none', /* IE 10+ */
    },
    emojiBtnBox: {
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      paddingTop: '10px',
      boxSizing: 'border-box',
      textAlign: 'center',
    },
    emojiBtnBoxBgc: {
      background: 'rgba(216, 216, 216, 0.4)',
      borderRadius: '10px',
    },
    emojiBigBox: {
      flex: 1,
      overflowX: 'scroll',
      display: 'flex',
      alignItems: 'center',
      '& ::-webkit-scrollbar': {
        display: 'none', /* Chrome Safari */
      },
      scrollbarWidth: 'none', /* firefox */
      '-ms-overflow-style': 'none', /* IE 10+ */
    },
    btnWord: {
      textAlign: 'left',
      fontSize: '14px',
      color: '#979797',
      paddingLeft: '10px',
    },
    searchGifsBox: {
      width: '100%',
      height: '85vh',
      position: 'absolute',
      bottom: '0px',
      background: '#fff',
      zIndex: '999',
      borderRadius: '16px',
      boxShadow: '0px 4px 16px rgb(0 0 0 / 12%), 0px 4px 24px rgb(0 0 0 / 8%)',
      textAlign: 'center',
    },
    searchInputBox: {
      height: '60px',
      width: '391px',
      background: '#F6F7F8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',  
    },
    borderRadiusLeftRight: {
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      borderBottom: '1px solid #ccc',
    },
    inputItemBox: {
      position: 'relative',
    },
    imgStyle: {
      position: 'absolute',
      top: '12px',
      width: '16px',
    },
    leftImgBox: {
      left: '10px',
    },
    inputBox: {
      padding: '0 30px',
      width: '290px',
      border: '0 none',
      height: '36px',
      background: '#fff',
      borderRadius: '18px',
      outlineStyle: 'none',
      boxSizing: 'border-box',
      fontSize: '16px',
    },
    rightImgBox: {
      right: '10px',
      cursor: 'pointer',
    },
    cancelBtn: {
      color: '#005FFF',
      fontSize: '16px',
      width: '60px',
      height: '50px',
      lineHeight: '50px',
      cursor: 'pointer',
    },
    gifsBox: {
      height: 'calc(100% - 140px)',
      overflow: 'auto',
      color: '#979797',
      textAlign: 'left',
    },
    heighterBox: {
      height: 'calc(100% - 80px)',
      paddingLeft: '10px',
    },
    titleStyle: {
      margin: '10px 0',
    },
    sticketImg: {
      width: '60px',
      margin: '5px',
      cursor: 'pointer',
    },
    emptyWord: {
      textAlign: 'center',
      lineHeight: '70vh',
      color: '#999999',
      fontSize: '18px',
    },
    loading: {
      position: 'absolute',
      background: '#fff',
      left: '0',
      top: '0',
      bottom: '0',
      right: '0',
      borderRadius: '16px',
    },
    loadingImg: {
      width: '40px',
      paddingTop: '200px',
      margin: '0 auto',
    },
    nothingWord: {
      textAlign: 'center',
      color: '#999999',
      fontSize: '18px',
      paddingTop: '50px',
    },
    gotoMarket: {
      height: '28px',
      width: '172px',
      borderRadius: '17.5px',
      background: '#005FFF',
      textAlign: 'center',
      lineHeight: '28px',
      margin: '0 auto',
      color: '#fff',
      fontSize: '16px',
      marginTop: '20px',
      padding: '0 10px',
      cursor: 'pointer',
    },
    marketBox: {
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      padding: '0 10px',
      borderBottom: '1px solid #ccc',
    },
    marketBtnBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%',
      height: '60px',
    },
    marketBtnItem: {
      borderBottom: '2px solid #F6F7F8',
      cursor: 'pointer',
      lineHeight: '60px',
      height: '60px',
    },
    activeItemBtn: {
      borderBottom: '2px solid #005FFF',
      color: '#005FFF'
    },
    trendingPackBox: {
      padding: '5px',
      height: '90px',
      '&:hover': {
        background: '#F5F5F5',
      }
    },
    packNameBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
    },
    firstName: {
      color: '#000000',
    },
    secondName: {
      color: '#979797',
    },
    packInfoBox: {
      marginTop: '5px',
      display: 'flex',
      alignItems: 'center',
    },
    downloadImg: {
      marginLeft: '20px',
    },
    popoverStickerBox: {
      position: 'relative',
    },
    popoverSticker: {
      position: 'absolute',
      left: '-395px',
      height: '300px',
      width: '390px',
      borderRadius: '16px',
      background: '#fff',
      boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12), 0px 4px 24px rgba(0, 0, 0, 0.08)',
      overflow: 'auto',
      textAlign: 'left',
      padding: '10px',
      boxSizing: 'border-box',
    },
    stickerDetailImg: {
      width: '50px',
      margin: '5px',
    },
    wishImg: {
      width: '30px',
      marginRight: '5px',
      cursor: 'pointer',
      padding: '5px',
    },
    historyImg: {
      width: '50px',
      margin: '5px',
      cursor: 'pointer',
    },
    historyWishBox: {
      textAlign: 'left',
      overflow: 'auto',
      maxHeight: '212px',
    },
    arrowImg: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
    },
    leftArrowImg: {
      transform: 'rotate(-180deg)',
    },
    yourSticketsBox: {
      display: 'flex',
      alignItems: 'center',
    },
    likeBoxWidth: {
      width: '100%',
      justifyContent: 'space-between',
    }
  }
})

function imgUrlToFile(e) {
  console.log(e)
  // return coverFile
	// var self = this;
	var imgLink = e.currentSrc;
  console.log(imgLink)
	var tempImage = new Image();
  console.log(tempImage)
	//如果图片url是网络url，要加下一句代码
  //跨域不可用
  tempImage.setAttribute('crossorigin', 'anonymous')
  tempImage.src = imgLink;
  console.log(tempImage)
	return new Promise((resolve,reject) => {
    tempImage.onload = function() {
      console.log(tempImage, 'onload')
      var base64 = getBase64Image(tempImage);
      // console.log(base64);
      var imgblob = base64toBlob(base64);
          //获取原文件名称
      var filename = getFileName(e.currentSrc);
      var coverFile = blobToFile(imgblob, filename);
      console.log(coverFile)
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
    //通过canvas绘制图片转base64
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	// var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  // console.log(ext, 'ext')
	var dataURL = canvas.toDataURL("image/gif");
  // console.log(dataURL, 'dataURL')
	return dataURL;
}
function base64toBlob(base64) {
    //base64转Blob
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

    //Blob转file对象
	// edge浏览器不支持new File对象，所以用以下方法兼容
	blob.lastModifiedDate = new Date();
	blob.name = filename;
  const url = window.URL.createObjectURL(blob);
  console.log(url)
	return blob;
}
function getFileName(url) {
	// 获取到文件名
	let pos = url.lastIndexOf("/"); // 查找最后一个/的位置
	return url.substring(pos + 1); // 截取最后一个/位置到字符长度，也就是截取文件名
}

const tabBtnList = [
  {
    id: 0,
    title: 'Trending',
    checked: true,
  },
  {
    id: 1,
    title: 'All',
    checked: false,
  },
  {
    id: 2,
    title: 'Your Stickers',
    checked: false,
  },
]
export default function ThirdEmoji () {
  const classes = useStyles()
  const [selectTitle, setSelectTitle] = useState('')
  const [searchInput, setSearchInput] = useState(false)
  const [openMarket, setOpenMarket] = useState(false)
  const [values, setValues] = useState('')
  const [searchTikets, setSearchTikets] = useState([])
  const [loading, setLoading] = useState(false)
  const [bgcFlag, setBgcFlag] = useState(0)
  const [stiketsList, setStiketsList] = useState([])
  const [myWishList, setmyWishList] = useState([])
  const [searchFlag, setSearchFlag] = useState(false)
  const [useTabBtnList, setTabBtnList] = useState(tabBtnList)
  let [tiketsMarkets, setTiketsMarkets] = useState([])
  const [popoverTop, setPopoverTop] = useState(0)
  const [stickerDetail, setStickerDetail] = useState([])
  const [activeLeft, setActiveLeft] = useState(10)
  let [myWishListLength, setMyWishListLength] = useState(0)
  const [trendingFlag, setTrendingFlag] = useState(true)
  let [popoverPNum, setPopoverPNum] = useState(1)
  let [totlalPagecount, setTotlalPagecount] = useState(0)
  let [useMarketFlag, setMarketFlag] = useState('')
  const input1Ref = useRef(null)
  const input2Ref = useRef(null)

  const mySticketPacks = ({pageNumber, market}) => {
    setLoading(true)
    myDownloadTickets({pageNumber, limit: 50}).then(res => {
      console.log(res)
      setLoading(false)
      if (res.packageList?.length) {
        if (market) {
          setTiketsMarkets(res.packageList)
        } else {
          res.packageList.forEach(item => {
            item.checked = false
          })
          setmyWishList(res.packageList)
          setMyWishListLength(res.packageList.length)
        }
        const { pageCount } = res.pageMap
        setTotlalPagecount(pageCount)
      }
    })
  }
  const getMyWishList = ({pageNumber, market}) => {
    setLoading(true)
    likeTickets({pageNumber, limit: 50}).then(res => {
      console.log(res)
      setLoading(false)
      if (res.packageList?.length) {
        if (market) {
          setTiketsMarkets(res.packageList)
        } else {
          setStiketsList(res.packageList)
        }
        const { pageCount } = res.pageMap
        setTotlalPagecount(pageCount)
      }
    })
  }
  const trendingSticketPacks = ({pageNumber}) => {
    setLoading(true)
    ticketsMarket({pageNumber, limit: 10}).then(res => {
      console.log(res)
      if (res.packageList?.length) {
        stickerPackInfo(res.packageList)
        const { pageCount } = res.pageMap
        setTotlalPagecount(pageCount)
      }
    })
  }
  const stickerPackInfo = (list) => {
    let tempArr = []
    list.forEach(item => {
      getPackInfo({id: item.packageId}).then(res => {
        tempArr.push(res.package)
        if (tempArr.length === 10) {
          console.log(tempArr)
          if (tiketsMarkets) {
            tempArr = [...tiketsMarkets, ...tempArr]
          }
          tempArr.forEach(item => {
            item.downloading = false
          })
          setTiketsMarkets(tempArr)
          setLoading(false)
        }
      })
    })
    const timeID= setTimeout(() => {
      if (loading) {
        setLoading(false)
      }
      clearTimeout(timeID)
    }, 2000)
  }
  const downloadHistory = ({pageNumber}) => {
    setLoading(true)
    recentlySentStickers({pageNumber, limit: 50}).then(res => {
      console.log(res)
      setLoading(false)
      if (res.stickerList?.length) {
        setStiketsList(res.stickerList)
        const { pageCount } = res.pageMap
        setTotlalPagecount(pageCount)
      } else {
        setStiketsList([])
        setBgcFlag(3)
      }
    })
  }

  useEffect(() => {
    mySticketPacks({pageNumber: 1})
    handlerBtn(0)
  }, [''])
  const searchPopover = ({ value, pageNumber, limit = 50 }) => {
    setLoading(true)
    const params = {
      q: value,
      pageNumber,
      limit
    }
    searchStiPopSticket(params).then(res => {
      console.log(res)
      setLoading(false)
      let tempArr = []
      if (!searchTikets.length) {
        tempArr = res.stickerList || []
      } else {
        if (res.stickerList?.length) {
          searchTikets.forEach(val => {
            res.stickerList.forEach((item, index) => {
              if (item.stickerId === val.stickerId) {
                res.stickerList.splice(index, 1)
              }
            })
          })
          tempArr = _.concat(searchTikets, res.stickerList)
        }
      }
      console.log(tempArr)
      if (tempArr.length) {
        const { pageCount } = res.pageMap
        setTotlalPagecount(pageCount)
        setSearchTikets(tempArr)
      }
    })
  }
  const handleChange = (e) => {
    const { keyCode, target: { value} } = e
    if (keyCode === 13 && value) {
      setValues(value)
      setSearchTikets([])
      searchPopover({ value, pageNumber: 1 })
    }
  }
  const clearInput = () => {
    if (input1Ref.current) {
      input1Ref.current.value = ''
    }
    if (input2Ref.current) {
      input2Ref.current.value = ''
    }
    setValues('')
  }
  const changeCheckedStatus = () => {
    const tempArr = [...myWishList]
    tempArr.forEach(item => {
      item.checked = false
    })
    setmyWishList(tempArr)
  }
  const handlerBtn = (num) => {
    if (num === 0) {
      setSelectTitle('Recently Used')
      setStiketsList([])
      downloadHistory({pageNumber: 1})
      setBgcFlag(1)
      changeCheckedStatus()
      setMarketFlag('')
    } else if (num === 1) {
      setSelectTitle('Recently Like')
      setStiketsList([])
      getMyWishList({pageNumber: 1})
      setBgcFlag(2)
      changeCheckedStatus()
      setMarketFlag('WISH')
    } else if (num === 2) {
      setSelectTitle('Stickers Album Name')
    } else if (num === 3) {
      setSearchInput(true)
    } else if (num === 4) {
      setOpenMarket(true)
      setSearchInput(false)
      trendingSticketPacks({pageNumber: 1})
    }
  }
  const handlerSendEmoji = (e, item) => {
    console.log(e)
    e.preventDefault()
    const { src } = e.target
    const type = src.substr(src.lastIndexOf('.') + 1)
    EaseApp.handleThirdEmoji({emoji_url: src, emoji_type: type})
    EaseApp.closeThirdEmoji()
    registeringStickerSend({stickerId: item.stickerId})
  }
  const handlerMergeWishAndLike = () => {
    let tempArr = [...stiketsList, ...myWishList]
    let tempArr1 = []
    console.log(tempArr, stiketsList, myWishList, tiketsMarkets)
    if (stiketsList.length && myWishList.length) {
      stiketsList.forEach(item => {
        myWishList.forEach(val => {
          if (item.packageId === val.packageId) {
            tempArr1.push(item)
          }
        })
      })
      tempArr1.forEach(item => {
        tempArr.splice(tempArr.findIndex(val => val.packageId === item.packageId),1)
      })
    }
    setTiketsMarkets(tempArr)
    console.log(tempArr)
  }
  const handlerMarketBtn = (e, val) => {
    tiketsMarkets = []
    setTiketsMarkets(tiketsMarkets)
    const tempArr = [...tabBtnList]
    tempArr.forEach(item => {
      if (item.id === val.id) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    setTabBtnList(tempArr)
    if (val.id === 0) {
      trendingSticketPacks({pageNumber: 1})
      setTrendingFlag(true)
      setMarketFlag('')
    } else if (val.id === 1) {
      setTrendingFlag(false)
      handlerMergeWishAndLike()
      setMarketFlag('ALL')
    } else if (val.id === 2) {
      mySticketPacks({pageNumber: 1, market: true})
      setPopoverTop(0)
      setTrendingFlag(false)
      setMarketFlag('YOUR')
    }
  }

  const handlerMouseEvent = (e, val, str) => {
    if (!trendingFlag && !loading) {
      return
    }
    // console.log(e, val)
    let { clientX, clientY } = e
    // console.log(offsetTop, clientHeight, clientY, pageY, screenY, clientX)
    setStickerDetail(val.stickers)
    if (str === 'enter') {
      clientY-=100
      if (clientY > 600) {
        clientY = 600
      }
      setPopoverTop(clientY)
    } else if (str === 'leave') {
      if (clientX >= (window.innerWidth - 390)) {
        setPopoverTop(0)
      }
    }
  }
  const mouseLeavePopover = () => {
    setPopoverTop(0)
  }

  const handlerDownloadMarket = (e, val) => {
    const tempArr = [...tiketsMarkets]
    for (let i = 0; i < tempArr.length; i++) {
      if (val.packageId === tempArr[i].packageId) {
        tempArr[i].downloading = true
      }
    }
    setTiketsMarkets(tempArr)
    downloadMarketSticker({id: val.packageId}).then(res => {
      for (let i = 0; i < tempArr.length; i++) {
        if (val.packageId === tempArr[i].packageId) {
          tempArr[i].isDownload = 'Y'
          tempArr[i].downloading = false
        }
      }
      setTiketsMarkets(tempArr)
    })
  }
  const handlerDownloadSticker = (e, val) => {
    setBgcFlag(3)
    const tempArr = [...myWishList]
    tempArr.forEach(item => {
      if (item.packageId === val.packageId) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    setmyWishList(tempArr)
    getPackInfo({id: val.packageId}).then(res => {
      setStiketsList(res.package.stickers)
    })
  }
  const handlerArrow = (e, val) => {
    let dis = activeLeft
    if (val === 'left') {
      dis+=240
      myWishListLength+=6
      setMyWishListLength(myWishListLength)
      setActiveLeft(dis)
    } else if (val === 'right') {
      dis-=240
      if (myWishListLength <= 6) {
        return
      }
      myWishListLength-=6
      setMyWishListLength(myWishListLength)
      setActiveLeft(dis)
    }
  }
  const deleteYourStickets = (e, val) => {
    deletePack({id: val.packageId}).then(res => {
      const tempArr = [...tiketsMarkets]
      tempArr.splice(tempArr.findIndex(item => item.packageId === val.packageId), 1)
      setTiketsMarkets(tempArr)
      setmyWishList(tempArr)
      setMyWishListLength(tempArr.length)
    })
  }
  // const handlerLikePack = (e, val) => {
  //   addOrdelWishPack({id: val.packageId}).then(res => {
  //     const tempArr = [...tiketsMarkets]
  //     tempArr.forEach(item => {
  //       if (item.packageId === val.packageId) {
  //         item.isWish = 'Y'
  //       }
  //     })
  //     setTiketsMarkets(tempArr)
  //   })
  // }
  const scrollRequestData = (e, callback, callback1, callback2) => {
    const { clientHeight, scrollHeight, scrollTop } = e.target
    // console.log(clientHeight, scrollHeight, scrollTop)
    const dis = scrollHeight - (clientHeight + scrollTop)
    if (dis <= 10 && !loading && (popoverPNum < totlalPagecount)) {
      popoverPNum++
      setPopoverPNum(popoverPNum)
      if (useMarketFlag === 'YOUR') {
        callback1({pageNumber: popoverPNum, market: true })
      } else if (useMarketFlag === 'ALL') {
        callback1({pageNumber: popoverPNum })
        callback2({pageNumber: popoverPNum })
        setTimeout(() => {
          handlerMergeWishAndLike()
        }, 2000)
      } else if (useMarketFlag === 'WISH') {
        callback1({pageNumber: popoverPNum })
      } else {
        callback({value: values, pageNumber: popoverPNum })
      }
    }
  }

  if (searchInput) {
    return (
      <div className={classes.searchGifsBox}>
        <div className={`${classes.searchInputBox} ${classes.borderRadiusLeftRight}`}>
          <div className={classes.inputItemBox}>
            <img className={classes.leftImgBox + ' ' + classes.imgStyle} src={search} alt="" />
            <input ref={input1Ref} className={classes.inputBox} placeholder='Search GIFs' onKeyDown={_.throttle(handleChange, 1000)} />
            <img className={classes.rightImgBox + ' ' + classes.imgStyle} src={deleteInput} alt="" onClick={clearInput} />
          </div>
          <div className={classes.cancelBtn} onClick={() => setSearchInput(false)}>Cancel</div>
        </div>
        <div className={`${classes.gifsBox} ${classes.heighterBox}`} onScroll={(e) => scrollRequestData(e, searchPopover)}>
          {
            searchTikets.length ? <div className={classes.titleStyle}>Trending Stickers</div> : null
          }
          <div>
            {
              searchTikets.length ? searchTikets.map(item => {
                return (
                  <img onClick={(e) => handlerSendEmoji(e, item)} key={item.stickerId} className={classes.sticketImg} alt={item.keyword} src={item.stickerImg} />
                )
              })
              : <div className={classes.emptyWord}>No Stickers Found</div>
            }
          </div>
        </div>
        {
          loading && <div className={classes.loading}>
            <img className={classes.loadingImg} src={giphyGif} alt="loading" />
          </div>
        }
      </div>
    )
  } else if (openMarket) {
    return (
      <div className={classes.searchGifsBox}>
        <div className={classes.marketBox}>
          <span>Sticker Market</span>
          <img className={classes.emojiImg} onClick={() => setOpenMarket(false)} src={closeImg} alt="" />
        </div>
        <div className={classes.searchInputBox}>
          {
            !searchFlag ?
            <div className={classes.marketBtnBox}>
              {
                useTabBtnList.map(item => {
                  return (
                    <div onClick={(e) => handlerMarketBtn(e, item)} className={`${classes.marketBtnItem} ${item.checked ? classes.activeItemBtn : ''}`} key={item.id}>
                      {item.title}
                    </div>
                  )
                })
              }
              {/* 没有市场里搜索的api先去掉 <img className={classes.emojiImg} onClick={() => setSearchFlag(true)} src={search} alt=""/> */}
            </div>
            : <div className={classes.marketBtnBox}>
              <div className={classes.inputItemBox}>
                <img className={classes.leftImgBox + ' ' + classes.imgStyle} src={search} alt="" />
                <input ref={input2Ref} className={classes.inputBox} placeholder='Search Sticker' onKeyDown={_.throttle(handleChange, 1000)} />
                <img className={classes.rightImgBox + ' ' + classes.imgStyle} src={deleteInput} alt="" onClick={clearInput} />
              </div>
              <div className={classes.cancelBtn} onClick={() => setSearchFlag(false)}>Cancel</div>
            </div>
          }
        </div>
        {
          popoverTop > 0 ?
          <div className={classes.popoverSticker} style={{top: popoverTop}} onMouseLeave={mouseLeavePopover}>
            {
              stickerDetail?.length && stickerDetail.map(item => {
                return (
                  <img className={classes.stickerDetailImg} key={item.stickerId} src={item.stickerImg} alt="" />
                )
              })
            }
          </div>
          : null
        }
        <div className={classes.gifsBox} style={{marginTop: '5px'}} onScroll={(e) => scrollRequestData(e, trendingSticketPacks, mySticketPacks, getMyWishList)}>
          <div className={classes.popoverStickerBox}>
            {
              tiketsMarkets?.length ? tiketsMarkets.map((item, index) => {
                return (
                  <div
                    onMouseEnter={(e) => handlerMouseEvent(e, item, 'enter')}
                    onMouseLeave={(e) => handlerMouseEvent(e, item, 'leave')}
                    className={classes.trendingPackBox}
                    key={index}
                  >
                    {
                      item.stickers ?
                      <div className={classes.packNameBox}>
                        <span className={classes.firstName}>{item.packageName}</span>
                        <span className={classes.secondName}>©{item.artistName}</span>
                      </div> : null
                    }
                    <div className={classes.packInfoBox}>
                      {
                        item.stickers?.length ? item.stickers.map((val, index) => {
                          if (index < 4) {
                            return (
                              <img key={val.stickerId} className={classes.sticketImg} alt={item.packageName} src={val.stickerImg} />
                            )
                          }
                        }) :
                        <div className={`${classes.yourSticketsBox} ${classes.likeBoxWidth}`}>
                          <div className={classes.yourSticketsBox}>
                            <img onClick={(e) => deleteYourStickets(e, item)} className={classes.sticketImg} style={{width: '40px', cursor: 'pointer'}} alt='deleteImg' src={deleteImg} />
                            <img className={classes.sticketImg} alt={item.packageName} src={item.packageImg} />
                            <div style={{marginLeft: '10px'}}>
                              <div className={classes.firstName}>{item.packageName}</div>
                              <div className={classes.secondName} style={{marginTop: '5px'}}>©{item.artistName}</div>
                            </div>
                          </div>
                          {/* {
                            item.isWish === 'Y' ?
                            <img onClick={(e) => handlerLikePack(e, item)} className={classes.emojiImg} style={{marginRight: '20px'}} src={busy} alt="" />
                            : <img onClick={(e) => handlerLikePack(e, item)} className={classes.emojiImg} style={{marginRight: '20px'}} src={like} alt="" />
                          } */}
                        </div>
                      }
                      {
                        item.stickers?.length ?
                        item.downloading ?
                        <img className={`${classes.emojiImg} ${classes.downloadImg}`} src={giphyGif} alt="" />
                        : item.isDownload === 'Y' ?
                          <img className={`${classes.emojiImg} ${classes.downloadImg}`} src={checkGray} alt="" />
                        : <img onClick={(e) => handlerDownloadMarket(e, item)} className={`${classes.emojiImg} ${classes.downloadImg}`} src={downloadImg} alt="" />
                        : null
                      }
                      {/* {
                        item.stickers ?
                        item.isWish === 'Y' ?
                        <img onClick={(e) => handlerLikePack(e, item)} className={classes.emojiImg} style={{marginLeft: '20px'}} src={busy} alt="" />
                        : <img onClick={(e) => handlerLikePack(e, item)} className={classes.emojiImg} style={{marginLeft: '20px'}} src={like} alt="" />
                        : null
                      } */}
                    </div>
                  </div>
                )
              })
              : <div className={classes.emptyWord}>No Stickers Found</div>
            }
          </div>
        </div>
        {
          loading && <div className={classes.loading}>
            <img className={classes.loadingImg} src={giphyGif} alt="loading" />
          </div>
        }
      </div>
    )
  } else {
    return (
      <div className={classes.emojiList}>
        <div className={classes.allBtnBox}>
          {
            activeLeft >= 10 ?
            <>
              <div className={`${classes.emojiBtnBox} ${bgcFlag === 1 ? classes.emojiBtnBoxBgc : ''}`} onClick={() => handlerBtn(0)}>
              <img className={classes.emojiImg} src={emojiImg} alt="" />
              </div>
              {/* <div className={`${classes.emojiBtnBox} ${bgcFlag === 2 ? classes.emojiBtnBoxBgc : ''}`} onClick={() => handlerBtn(1)}>
                <img className={classes.emojiImg} src={like} alt="" />
              </div> */}
            </>
            : null
          }
          <div className={classes.emojiBigBox} onClick={() => handlerBtn(2)}>
            {
              myWishList.length && activeLeft < 10 ? <img onClick={(e) => handlerArrow(e, 'left')} className={`${classes.arrowImg} ${classes.leftArrowImg}`} src={arrow} alt="" /> : null
            }
            {
              myWishList.length ?
              <div className={classes.emojiBigBox} style={{position: 'relative', height: '40px'}}>
                  <div className={classes.emojiBigBox} style={{position: 'absolute', left: activeLeft + 'px'}}>
                    {
                      myWishList.map(item => {
                        return (
                          <div>
                            <img
                              onClick={(e) => handlerDownloadSticker(e, item)}
                              className={`${classes.wishImg} ${item.checked ? classes.emojiBtnBoxBgc : ''}`}
                              key={item.packageId}
                              alt={item.packageName}
                              src={item.packageImg} />
                          </div>
                        )
                      })
                    }
                  </div>
              </div>
              : null
            }
            {
              myWishList.length ? <img onClick={(e) => handlerArrow(e, 'right')} className={classes.arrowImg} src={arrow} alt="" /> : null
            }
          </div>
          <div className={classes.emojiBtnBox} onClick={() => handlerBtn(3)}>
            <img className={classes.emojiImg} src={search} alt="" />
          </div>
          <div className={classes.emojiBtnBox} onClick={() => handlerBtn(4)}>
            <img className={classes.emojiImg} src={marketImg} alt="" />
          </div>
        </div>
        {
          stiketsList.length ? <div className={classes.btnWord}>{selectTitle}</div> : null
        }
        <div className={classes.historyWishBox} onScroll={(e) => scrollRequestData(e, downloadHistory, getMyWishList)}>
          {
            stiketsList.length ?
            stiketsList.map(item => {
              return (
                <img onClick={(e) => handlerSendEmoji(e, item)} className={classes.historyImg} key={item.stickerId || item.packageId} alt={item.packageName} src={item.stickerImg || item.packageImg} />
              )
            })
            :
            <div className={classes.nothingWord}>
              You haven't added any Stickers yet
              <div className={classes.gotoMarket} onClick={() => handlerBtn(4)}>Go to Sticker Market</div>
            </div>
          }
          {
          loading && <div className={classes.loading} style={{textAlign: 'center', top: '100px'}}>
              <img className={classes.loadingImg} style={{paddingTop: '80px'}} src={giphyGif} alt="loading" />
            </div>
          }
        </div>
      </div>
    )
  }
}