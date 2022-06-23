import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MenuItem, Select, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import i18next from "i18next";
import { handlerTime, getMillisecond, computedItervalTime, timeIntervalToMinutesOrHours, setTimeVSNowTime } from '../../../../../utils/notification'
import { setSilentModeForConversation, getSilentModeForConversation, getSilentModeForConversations } from '../../../../../api/notificationPush'
import muteIcon from '../../../../../assets/go@2x.png'
import CommonDialog from "../../../../common/dialog";
import checkgrayIcon from '../../../../../assets/check_gray.png'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: '540px',
      height: '508px',
      padding: '10px',
      boxSizing: 'border-box',
      background: 'rgb(237, 239, 242)',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
    },
    topBox: {
      background: '#F4F5F7',
      marginBottom: '10px',
      borderRadius: '15px',
    },
    titleBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 10px',
    },
    titleStyle: {
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '22px',
      color: '#0D0D0D',
    },
    imgStyle: {
      width: '15px',
      height: '15px',
    },
    imgUpStyle: {
      transform: 'rotate(-90deg)',
    },
    imgDownStyle: {
      transform: 'rotate(90deg)',
    },
    radioColor: {
      '&.Mui-checked': {
        color: '#005FFF',
      }
    },
    notifySelect: {
      background: '#fff',
      width: '160px',
      height: '40px',
    },
    btnBox: {
      width: '100%',
      textAlign: 'right',
    },
    btnStyle: {
      background: '#114EFF',
      borderRadius: '26px',
      height: '28px',
      width: '84px',
      color: '#fff',
      textAlign: 'center',
      margin: '0 0 0 auto',
      display: 'inline-block',
      lineHeight: '28px',
      cursor: 'pointer',
    },
    cursorStyle: {
      cursor: 'pointer'
    },
    radioBox: {
      borderTop: '1px solid #E6E6E6',
      padding: '10px 15px 20px 15px',
    },
    turnStyle: {
      fontWeight: '500',
      fontSize: '14px',
      textAlign: 'right',
      color: '#114EFF',
      cursor: 'pointer',
    },
    contentBox: {
      margin: '20px',
      fontSize: '16px',
      width: '540px',
    },
    turnOffBtnStyle: {
      width: '84px',
      height: '36px',
      color: '#000',
      display: 'inline-block',
      textAlign: 'center',
      lineHeight: '36px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    rightBtn: {
      margin: '0px 20px 20px 10px',
      fontSize: '14px',
      background: '#114EFF',
      borderRadius: '26px',
      height: '36px',
      width: '84px',
      color: '#fff',
      textAlign: 'center',
      display: 'inline-block',
      lineHeight: '36px',
      cursor: 'pointer',
    },
    unmuteTimeStyle: {
			color: '#0D0D0D',
			fontWeight: '500',
		},
    notifyPrayTitle: {
      color: 'rgb(153, 153, 153)',
      fontSize: '14px',
      fontWeight: '600',
      marginLeft: '5px',
    },
    mySelect: {
      position: 'relative',
      background: '#FFFFFF',
      borderRadius: '10px',
      height: '40px',
      width: '162px',
    },
    selectTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 10px',
      boxSizing: 'border-box',
      cursor: 'pointer',
    },
    selectDefaultText: {
      // fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '14px',
      color: '#000000',
      lineHeight: '40px',
    },
    selectBottom: {
      width: '178px',
      position: 'absolute',
      top: '46px',
      left: '-6px',
      background: '#F4F5F7',
      boxShadow: '0px 24px 36px rgba(0, 0, 0, 0.2), 8px 0px 24px rgba(0, 0, 0, 0.16)',
      borderRadius: '12px',
      padding: '8px 8px 0px 8px',
      boxSizing: 'border-box',
    },
    selectTextlist: {
      height: '39px',
      width: '162px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 10px',
      boxSizing: 'border-box',
      marginBottom: '8px',
      cursor: 'pointer',
      '&:hover': {
        background: '#FFFFFF',
      }
    },
    selectChecked: {
      background: '#FFFFFF',
    },
    selectOption: {
      // fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '39px',
      color: '#000000',
    },
    checkedStyle: {
      width: '15px',
      verticalAlign: 'middle'
    },
    commonDialog: {
        '& .MuiDialog-paperWidthSm': {
            borderRadius: '12px'
        }
    },
    groupsettingnotify: {
      padding: '16px',
    },
  }
})
const radioList = [
  {
      title: 'For 15 minutes',
      value: '0',
      time: 15
  },
  {
      title: 'For 1 hour',
      value: '1',
      time: 1
  },
  {
      title: 'For 8 hours',
      value: '2',
      time: 8
  },
  {
      title: 'For 24 hours',
      value: '3',
      time: 24
  },
  {
      title: 'Until 8:00 AM Tomorow',
      value: '4',
      time: '8AM'
  },
  // {
  //     title: 'Until I turn it Unmute',
  //     value: '5',
  //     time: 'none'
  // }
]
const selectList = [
  {
    id: 0,
    value: 'DEFAULT',
    label: 'Default',
    checked: true
  },
  {
    id: 1,
    value: 'ALL',
    label: 'All Message',
    checked: false
  },
  {
    id: 2,
    value: 'AT',
    label: 'Only @Mention',
    checked: false
  },
  {
    id: 3,
    value: 'NONE',
    label: 'Off',
    checked: false
  }
]
const Notifications = (props) => {
  const { showMuteImgOrNot, useScene, useComponent } = props
  const classes = useStyles()
  // const state = useSelector((state) => state)
  // const groupsInfo = state?.groups?.groupsInfo || {}
  // const groupId = groupsInfo?.id
  const [selectContent, setSelectContent] = useState('Default')
  const [defaultValue, setDefaultValue] = useState('0')
  const [showRadio, setShowRadio] = useState(false)
  const [muteTimeText, setMuteTimeText] = useState(null)
  const [openTurnOff, setopenTurnOff] = useState(false)
  const [showSelectOption, setShowSelectOption] = useState(false)
  const [turnOffBtnFlag, setTurnOffBtnFlag] = useState(false)

  const getNotDisturbGroup = (groupId) => {
    console.log(groupId, 'groupId=conversationId')
    getSilentModeForConversation({conversationId: groupId, type: useScene, flag: useComponent }).then(res => {
      console.log(res, 'getNotDisturbDuration')
      const type = res.type
      if (type) {
        selectList.forEach(item => {
          if (item.value === type) {
            item.checked = true
            setSelectContent(item.label)
          } else {
            item.checked = false
          }
        })
      } else {
        selectList.forEach(item => {
          if (item.value === 'DEFAULT') {
            item.checked = true
            setSelectContent(item.label)
          } else {
            item.checked = false
          }
        })
      }
      if (res.ignoreDuration) {
        if (setTimeVSNowTime(res, true)) {
          setMuteTimeText(null)
          showMuteImgOrNot(false)
          setShowRadio(true)
        } else {
          setCheckedDefaultValue(res.ignoreDuration, 0, true)
          setTurnOffBtnFlag(true)
          showMuteImgOrNot(true)
        }
      } else {
        setShowRadio(true)
      }
      // if (res.ignoreInterval) {
      //   setDefaultValue(radioList[timeIntervalToMinutesOrHours(res.ignoreInterval)].value)
      //   setTurnOffBtnFlag(true)
      //   showMuteImgOrNot(true)
      // }
      // if (res.ignoreInterval && res.ignoreDuration) {
      //   setCheckedDefaultValue(res.ignoreDuration, timeIntervalToMinutesOrHours(res.ignoreInterval), true)
      //   showMuteImgOrNot(true)
      // } else {
      //   showMuteImgOrNot(false)
      // }
    })
  }
  useEffect(() => {
      if (props.groupId) {
        getNotDisturbGroup(props.groupId)
      }
  }, [props.groupId])
  const handleSelectChange = (item) => {
    const value = item.value
    selectList.forEach(item => {
      if (item.value === value) {
        item.checked = true
        setSelectContent(item.label)
      } else {
        item.checked = false
      }
    })
    const params = {
      conversationId: props.groupId,
      type: useScene,
      options: {
        paramType: 0,
        remindType: value
      }
    }
    setNotDisturbGroup(params)
    if (value === 'NONE') {
      showMuteImgOrNot(true)
    } else {
      showMuteImgOrNot(false)
    }
    setShowSelectOption(false)
  }
  const handleChangeRadio = (event) => {
    console.log(event.target.value, 'event.target.value')
    setDefaultValue(event.target.value)
  }
  const handlerShowRadio = () => {
    if (turnOffBtnFlag) {
      return
    }
    setShowRadio(!showRadio)
  }
  const setCheckedDefaultValue = (time, index, flag) => {
    let str = ''
    if (index < 4) {
        str = handlerTime(time, flag)
    } else {
        let list = handlerTime(24).split(',')
        str = `${list[0]}, ${list[1]}, 08:00`
    }
    setMuteTimeText(str)
  }
  const handlerDone = () => {
    const radioIndex = Number(defaultValue)
    if (defaultValue === '5') {
      setMuteTimeText('You Turn it Unmute')
    } else {
      setCheckedDefaultValue(radioList[radioIndex].time, radioIndex)
    }
    setShowRadio(false)
    const params = {
      conversationId: props.groupId,
      type: useScene,
      options: {
        paramType: 1,
        duration: getMillisecond(radioList[radioIndex].time)
      }
    }
    setNotDisturbGroup(params)
    setTurnOffBtnFlag(true)
    showMuteImgOrNot(true)
  }
  const setNotDisturbGroup = (params) => {
    setSilentModeForConversation(params).then(res => {
      console.log(res)
    })
  }

  // useEffect(() => {
  //   getNotDisturbGroupByLimit(groupList)
  // }, [groupList.length])
  // const getNotDisturbGroupByLimit = (list) => {
  //   const conversationList = []
  //   list.forEach(item => {
  //     conversationList.push({
  //       id: item.groupid,
  //       type: useScene
  //     })
  //   })
  //   getSilentModeForConversations({conversationList}).then(res => {
  //     console.log(res)
  //   })
  // }

  const handlerTurnOffBtn = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.cancelBubble = true // IE
    e.returnValue = false // IE
    setopenTurnOff(true)
  }
  const handleTurnOffClose = () => {
    setopenTurnOff(false)
  }
  const handlerOkay = () => {
    setShowRadio(true)
    handleTurnOffClose()
    setTurnOffBtnFlag(false)
    setDefaultValue('')
    setMuteTimeText('')
    const params = {
      conversationId: props.groupId,
      type: useScene,
      options: {
        paramType: 1,
        duration: 0
      }
    }
    setNotDisturbGroup(params)
    showMuteImgOrNot(false)
  }

  function renderTurnOffContent() {
    return (
      <div className={classes.contentBox}>
        {defaultValue === '5' ? `You have muted this ${useComponent}.` : <span>You have muted this {useComponent} until <span className={classes.unmuteTimeStyle}>{muteTimeText}</span>.</span>}
      </div>
    )
  }

  function renderTurnOffFooter() {
    return (
      <div className={classes.btnBox}>
        <span className={classes.turnOffBtnStyle} onClick={handleTurnOffClose}>{i18next.t('Cancel')}</span>
        <span className={classes.rightBtn} onClick={handlerOkay}>{i18next.t('Okay')}</span>
      </div>
    )
  }
  const handlerSelectBox = () => {
    setShowSelectOption(!showSelectOption)
  }
  return (
    <div className={`${useComponent === 'Thread' ? classes.root : classes.groupsettingnotify}`}>
      <div className={classes.topBox}>
        <div onClick={handlerShowRadio} className={classes.titleBox}>
          <span className={classes.titleStyle}>Mute this {useComponent} { muteTimeText ? <span className={classes.notifyPrayTitle}>Until {muteTimeText}</span> : null}</span>
          {
            muteTimeText && turnOffBtnFlag?
            <span onClick={(e) => handlerTurnOffBtn(e)} className={classes.turnStyle + ' ' + classes.cursorStyle}>Unmute</span>
            : <img className={`${classes.imgStyle + ' ' + classes.cursorStyle} ${showRadio ? classes.imgUpStyle : classes.imgDownStyle}`} alt="" src={muteIcon} />
          }
        </div>
        {
          showRadio ?
            <div className={classes.radioBox}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={defaultValue}
                onChange={handleChangeRadio}
              >
                {
                  radioList.map(item => {
                    return (
                      <FormControlLabel key={item.title} value={item.value} control={<Radio className={classes.radioColor} />} label={item.title} />
                    )
                  })
                }
              </RadioGroup>
              <div className={classes.btnBox}>
                <span onClick={handlerDone} className={classes.btnStyle + ' ' + classes.cursorStyle}>{i18next.t('Done')}</span>
              </div>
            </div>
          : null
        }
      </div>
      <div className={classes.topBox + ' ' + classes.titleBox}>
        <div className={classes.titleStyle}>Frequency</div>
        <div className={classes.mySelect}>
          <div className={classes.selectTop} onClick={handlerSelectBox}>
            <span className={classes.selectDefaultText}>{selectContent}</span>
            <img className={`${classes.imgStyle + ' ' + classes.cursorStyle} ${showSelectOption ? classes.imgUpStyle : classes.imgDownStyle}`} alt="" src={muteIcon} />
          </div>
          {
            showSelectOption &&
            <div className={classes.selectBottom}>
              {
                selectList.map(item => {
                  return (
                    <div key={item.value} onClick={() => handleSelectChange(item)} className={`${classes.selectTextlist} ${item.checked ? classes.selectChecked : ''}`}>
                      <span className={classes.selectOption} value={item.value}>{item.label}</span>
                      {item.checked ? <img alt="" className={classes.checkedStyle} src={checkgrayIcon} /> : ''}
                    </div>
                  )
                })
              }
            </div>
          }
        </div>
      </div>
      <CommonDialog
          open={openTurnOff}
          onClose={handleTurnOffClose}
          title={i18next.t(`Unmute this ${useComponent}?`)}
          content={renderTurnOffContent()}
          footer={renderTurnOffFooter()}
          className={classes.commonDialog}
      ></CommonDialog>
    </div>
  )
}
export default Notifications