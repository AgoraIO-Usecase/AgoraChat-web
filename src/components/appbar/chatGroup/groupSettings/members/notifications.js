import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MenuItem, Select, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import i18next from "i18next";
import { handlerTime, getMillisecond, computedItervalTime, timeIntervalToMinutesOrHours, setTimeVSNowTime } from '../../../../../utils/notification'
import { setSilentModeForConversation, getSilentModeForConversation, getSilentModeForConversations } from '../../../../../api/notificationPush'
import muteIcon from '../../../../../assets/go@2x.png'
import CommonDialog from "../../../../common/dialog";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: '540px',
      height: '508px',
      paddingTop: '10px',
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
      width: '20px',
      height: '20px',
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
      fontSize: '14px',
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
    },
    unmuteTimeStyle: {
			color: '#0D0D0D',
			fontSize: '16px',
			fontWeight: 'normal',
		},
    notifyPrayTitle: {
      color: 'rgb(153, 153, 153)',
      fontSize: '14px',
      fontWeight: '600',
      marginLeft: '5px',
    }
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
    label: 'Default'
  },
  {
    id: 1,
    value: 'ALL',
    label: 'All Message'
  },
  {
    id: 2,
    value: 'AT',
    label: 'Only @Metion'
  },
  {
    id: 3,
    value: 'NONE',
    label: 'Nothing'
  }
]
const Notifications = (props) => {
  const { showMuteImgOrNot, useScene, useComponent } = props
  const classes = useStyles()
  // const state = useSelector((state) => state)
  // const groupsInfo = state?.groups?.groupsInfo || {}
  // const groupId = groupsInfo?.id
  // const groupList = state?.groups?.groupList || [];
  const [notifyText, setNotifyText] = useState('DEFAULT')
  const [defaultValue, setDefaultValue] = useState('')
  const [showRadio, setShowRadio] = useState(false)
  const [muteTimeText, setMuteTimeText] = useState(null)
  const [openTurnOff, setopenTurnOff] = useState(false)
  // const [selectDisabled, setSelectDisabled] = useState(false)
  // const [millisecond, setMillisecond] = useState(0)
  // const [itervalTime, setItervalTime] = useState('')
  const [turnOffBtnFlag, setTurnOffBtnFlag] = useState(false)

  const getNotDisturbGroup = (groupId) => {
    console.log(groupId, 'groupId=conversationId')
    getSilentModeForConversation({conversationId: groupId, type: useScene, flag: useComponent }).then(res => {
      console.log(res, 'getNotDisturbDuration')
      const type = res.type
      if (type) {
        setNotifyText(type)
        // setSelectDisabled(true)
      } else {
        setNotifyText('DEFAULT')
      }
      if (res.ignoreDuration) {
        if (setTimeVSNowTime(res, true)) {
          setMuteTimeText(null)
          showMuteImgOrNot(false)
        } else {
          setCheckedDefaultValue(res.ignoreDuration, 0, true)
          setTurnOffBtnFlag(true)
          showMuteImgOrNot(true)
        }
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
  const handleSelectChange = (event) => {
    console.log(event.target.value, 'event.target.value')
    setNotifyText(event.target.value)
    const params = {
      conversationId: props.groupId,
      type: useScene,
      options: {
        paramType: 0,
        remindType: event.target.value
      }
    }
    setNotDisturbGroup(params)
    if (event.target.value === 'NONE') {
      showMuteImgOrNot(true)
    } else {
      showMuteImgOrNot(false)
    }
  }
  const handleChangeRadio = (event) => {
    console.log(event.target.value, 'event.target.value')
    setDefaultValue(event.target.value)
  }
  const handlerShowRadio = () => {
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

  const handlerTurnOffBtn = () => {
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
        <span className={classes.btnStyle + ' ' + classes.rightBtn} onClick={handlerOkay}>{i18next.t('Okay')}</span>
      </div>
    )
  }

  return (
    <div className={`${useComponent === 'Thread' ? classes.root : ''}`}>
      <div className={classes.topBox}>
        <div className={classes.titleBox}>
          <span className={classes.titleStyle}>Mute this {useComponent} { muteTimeText ? <span className={classes.notifyPrayTitle}>Until {muteTimeText}</span> : null}</span>
          {
            muteTimeText && turnOffBtnFlag?
            <span onClick={handlerTurnOffBtn} className={classes.turnStyle + ' ' + classes.cursorStyle}>Unmute</span>
            : <img onClick={handlerShowRadio} className={`${classes.imgStyle + ' ' + classes.cursorStyle} ${showRadio ? classes.imgUpStyle : classes.imgDownStyle}`} alt="" src={muteIcon} />
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
        <Select
            value={notifyText}
            className={classes.notifySelect}
            onChange={handleSelectChange}
            variant="outlined"
        >
          {
            selectList.map(item=> {
              return (
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
              )
            })
          }
        </Select>
      </div>
      <CommonDialog
          open={openTurnOff}
          onClose={handleTurnOffClose}
          title={i18next.t(`Unmute this ${useComponent}?`)}
          content={renderTurnOffContent()}
          footer={renderTurnOffFooter()}
      ></CommonDialog>
    </div>
  )
}
export default Notifications