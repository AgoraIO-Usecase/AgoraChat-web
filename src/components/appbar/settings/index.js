import React, { useEffect, useState, createRef } from "react";
import CommonDialog from "../../common/dialog";
import i18next, { use } from "i18next";
import { Avatar, Button, TextField, List, ListItem, ListItemAvatar, Menu, MenuItem, Box, Switch, Select, RadioGroup, FormControlLabel, Radio, InputBase } from "@material-ui/core";
import ListItemButton from '@mui/material/ListItemButton';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import editIcon from '../../../assets/white@2x.png'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { IconButton } from '@material-ui/core';
import deleteContactIcon from '../../../assets/deletecontact@2x.png'
import avater1 from '../../../assets/avatar1.jpg'
import avater2 from '../../../assets/avatar2.jpg'
import avater3 from '../../../assets/avatar3.jpg'
import avater4 from '../../../assets/avatar4.jpg'
import avater5 from '../../../assets/avatar5.jpg'
import avater6 from '../../../assets/avatar6.jpg'
import avater7 from '../../../assets/avatar7.jpg'
import avater11 from '../../../assets/avatar11.jpg'
import avaterSelect from '../../../assets/avatar_select@2x.png'

import CheckIcon from '@material-ui/icons/Check';
import arrow from '../../../assets/go@2x.png'
import checkgrayIcon from '../../../assets/check_gray.png'
import muteIcon from '../../../assets/go@2x.png'

import aboutIcon from '../../../assets/about@2x.png'
import privacyIcon from '../../../assets/privacy@2x.png'
import notificationsIcon from '../../../assets/notifications@2x.png'
import generalIcon from '../../../assets/general@2x.png'
import infoIcon from '../../../assets/info@2x.png'
import rearchIcon from "../../../assets/search@2x.png";

import { useSelector } from 'react-redux'
import { setMyUserInfo } from '../../../redux/actions'
import store from '../../../redux/store'
import { message } from "../../common/alert";

import { removeFromBlackList, deleteContact, editSelfInfoMessage } from '../../../api/contactsChat/getContacts'
import { handlerTime, getMillisecond, computedItervalTime, timeIntervalToMinutesOrHours, setTimeVSNowTime, getLocalStorageData } from '../../../utils/notification'
import { setSilentModeForAll, getSilentModeForAll, getSilentModeForConversations, setPushPerformLanguage, getPushPerformLanguage } from '../../../api/notificationPush'
import SecondConfirmDialog from "../../common/secondConfirmDialog"
import { userAvatar } from '../../../utils'
import settingsIcon from '../../../assets/settings@2x.png'

const useStyles = makeStyles((theme) => {
    return {
        root: {
            display: "flex",
            alignItems: "center",
            width: "680px",
            minHeight: theme.spacing(30),
            // paddingBottom: theme.spacing(4),
            // margin: "16px 24px",
        },
        gridItem: {
            display: "flex",
            alignItems: "center",
        },

        settingInfoBox: {
            width: "280px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "10px",
            "& div:nth-last-child(2)": {
                marginTop: "-12px",
                fontSize: "20px",
                fontWeight: "600",
            },
            "& div:nth-last-child(1)": {
                color: "#999999",
                fontSize: "12px",
            },
        },

        settingMenuBox: {
            display: "flex",
            flexDirection: "column",
        },

        tabsInfo: {
            height: "462px",
        },
        avatarEditIcon: {
            position: "relative",
            top: "-60px",
            width: "24px",
            height: "24px",
            cursor: "pointer",
            visibility: 'hidden'
        },

        infoPanel: {
            width: "100%",
            height: "450px",
            backgroundColor: "#EDEFF2",
            padding: "6px 8px",
            // display: "flex",
            flexFlow: 'wrap',
            alignContent: 'flexStart',
        },
        infoItem: {
            backgroundColor: "#F4F5F7",
            borderRadius: "16px",
            height: "55px",
            width: "100%",
            lineHeight: "55px",
            padding: "0 16px",
            boxSizing: "border-box",
            position: "relative",
            fontWeight: '600',
            "& span:nth-child(3)": {
                color: "#005FFF",
                position: "absolute",
                right: "8px",
                cursor: "pointer",
            },
            "& span:nth-child(2)": {
                fontSize: "16px",
                marginLeft: "16px",
            },
        },

        privacyItemInfo: {
            display: "flex",
            alignItems: "center",
        },

        aboutItem: {
            background: '#F4F5F7',
            height: '50px',
            lineHeight: '50px',
            margin: '2px 0',
            padding: '0 8px',
            '& a': {
                textDecoration: 'none',
                color: '#114EFF',
            }
        },
        textfieldStyle: {
            width: "100%"
        },
        numberBox: {
            height: "20px",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "5px",
            padding: "5px",
        },
        numberStyle: {
            fontFamily: "PingFang SC",
            fontWeight: "400",
            style: "normal",
            fontSize: "14px",
            LineHeight: "20px",
            color: "#CCCCCC",
        },
        notificationPanel: {
            width: '100%',
            height: '450px',
            backgroundColor: '#EDEFF2',
            padding: '6px 8px',
            overflow: 'auto',
        },
        notificationItem: {
            backgroundColor: '#F4F5F7',
            borderRadius: '16px',
            width: '100%',
            boxSizing: 'border-box',
        },
        notifyTitle: {
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '54px',
            color: '#0D0D0D',
            borderBottom: '1px solid #E6E6E6',
            height: '54px',
            padding: '0 16px',
        },
        notifySubTitle: {
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '22px',
            color: '#0D0D0D',
        },
        selectAndRadio: {
            margin: '0 16px',
        },
        arrowImg: {
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            marginRight: '10px',
        },
        arrowDownImg: {
            transform: 'rotate(90deg)',
        },
        arrowUpImg: {
            transform: 'rotate(-90deg)',
        },
        notifySelect: {
            background: '#fff',
            width: '160px',
            height: '40px',
        },
        radioColor: {
            '&.Mui-checked': {
                color: '#005FFF',
            }
        },
        previewStyle: {
            borderTop: '1px solid #E6E6E6',
            width: '97%',
        },
        bottomStyle: {
            height: '52px',
        },
        alertStyle: {
            margin: '0 16px',
        },
        bottomItem: {
            marginTop: '10px',
        },
        flexBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        cursorStyle: {
            cursor: 'pointer'
        },
        notifyPrayTitle: {
            color: 'rgb(153, 153, 153)',
            fontSize: '14px',
            fontWeight: '600',
            marginLeft: '5px',
        },
        btnBox: {
            width: '100%',
            textAlign: 'right'
        },
        btnStyle: {
            background: '#114EFF',
            borderRadius: '26px',
            width: '84px',
            height: '28px',
            color: '#fff',
            display: 'inline-block',
            textAlign: 'center',
            lineHeight: '28px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
        },
        turnStyle: {
            fontWeight: '500',
            fontSize: '14px',
            textAlign: 'right',
            color: '#114EFF',
            cursor: 'pointer',
        },
        switchStyle: {
            // '& .Mui-checked': {
            //     color: '#fff',
            // }
        },
        switchStyleMargin: {
            marginRight: '-10px',
        },
        switchOpenStyle: {
            // '& .MuiSwitch-track': {
            //     background: 'rgb(49, 78, 238) !important',
            //     opacity: '1 !important',
            // }
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
            fontSize: '16px',
            fontWeight: '600',
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
            fontWeight: '600',
        },
        unmuteTimeStyle: {
            color: '#0D0D0D',
            fontSize: '16px',
            fontWeight: '500',
        },
        menuIcon: {
            width: '30px',
            height: '30px'
        },
        menuBtn: {
            justifyContent: 'start',
            textTransform: 'none',
            borderRadius: '8px !important',
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
            zIndex: '1',
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
        infoSwitchItem: {
            backgroundColor: "#F4F5F7",
            borderRadius: "16px",
            height: "55px",
            width: "100%",
            boxSizing: "border-box",
            display: 'flex',
            alignItems: 'center',
            textAlign: 'left',
            lineHeight: '55px',
            paddingLeft: '14px',
            position: 'relative',
            marginBottom: '12px',
        },
        switchMargin: {
            position: 'absolute',
            right: '-5px',
        },
        textStyle: {
			// fontFamily: "Roboto",
			fontWeight: "400",
			fontSize: "12px",
			lineHeight: "16",
			color: "#000000",
			width: "100%",
			padding: "5px",
		},
		imgSearchStyle: {
			width: "25px",
			cursor: "pointer",
            marginRight: '5px',
		},
        blockedListBox: {
            display: 'flex',
            justifyContent: 'spance-between',
            alignItems: 'center',
            padding: '12px',
            height: '54px',
            background: '#F4F5F7',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            width: '100%',
            boxSizing: 'border-box',
            borderBottom: '1px solid #E6E6E6'
        },
        blockText: {
            color: '#000',
            fontWeight: 600,
            fontSize: '16px',
            width: '290px',
        },
        searchBox: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        cancelBtn: {
            fontSize: '14px',
            color: '#114EFF',
            cursor: 'pointer',
        },
        listBoxBlock: {
            background: '#F4F5F7',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
        },
        listItemBlock: {
            padding: '0',
            borderRadius: '12px',
            '& .MuiButton-root:hover': {
                background: '#fff',
                borderRadius: '12px',
            }
        },
        inputBox: {
            width: '310px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginRight: '10px',
        },
        gInputBaseWidth: {
            width: '230px',
            marginLeft:"10px"
        },
        spanNickName: {
            backgroundColor: "#F4F5F7",
            fontWeight: '600',
            fontSize: '16px',
        },
        doneNickName: {
            cursor: 'pointer',
            color: 'rgb(30, 100, 246)',
            fontWeight: '600',
        },
        settingDialogLu: {
            '& .MuiBackdrop-root': {
                backdropFilter: 'blur(6px)',
                background: 'rgba(255,255,255,.8)',
            }
        }
    }
})

const AVATARS = [avater1, avater2, avater3, avater4, avater5, avater6, avater7]
const selectList = [
    {
        id: 1,
        value: 'ALL',
        label: 'All Message',
        checked: true
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
const radioList = [
    {
        title: 'For 15 minutes',
        value: '0',
        time: 15,
    },
    {
        title: 'For 1 hour',
        value: '1',
        time: 1,
    },
    {
        title: 'For 8 hours',
        value: '2',
        time: 8,
    },
    {
        title: 'For 24 hours',
        value: '3',
        time: 24,
    },
    {
        title: 'Until 8:00 AM Tomorow',
        value: '4',
        time: '8AM',
    },
    // {
    //     title: 'Until I turn it off',
    //     value: '5',
    //     time: 'none',
    // }
]
export default function Setting({ open, onClose }) {
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(1)
    const [editStatus, setEditStatus] = useState(false)
    const [nickName, setNickName] = useState('')
    const [avatarIndex, setAvatarIndex] = useState(null)
    const [addEl, setAddEl] = useState(null)
    const [addElSub, setAddElSub] = useState(null)
    const [notifyText, setNotifyText] = useState('ALL');
    const [defaultValue, setDefaultValue] = useState('0')
    const [showRadio, setShowRadio] = useState(false)
    const [checkedValue, setCheckedValue] = useState('')
    const [textSwitch, setTextSwitch] = useState(false)
    const [soundSwitch, setSoundSwitch] = useState(false)
    const [openTurnOff, setopenTurnOff] = useState(false)
    const [selectDisabled, setSelectDisabled] = useState(false)
    const [turnOffBtnFlag, setTurnOffBtnFlag] = useState(false)
    const myUserInfo = useSelector(state => state?.myUserInfo)
    const blackList = useSelector(state => state?.blackList) || []
    const [showSelectOption, setShowSelectOption] = useState(false)
    const [selectContent, setSelectContent] = useState('All Message')
    const [deleteSwitch, setDeleteSwitch] = useState(false)
    const [secondSure, setSecondSure] = useState(false)
	const [GroupStatus, setGroupStatus] = useState('')
	const [groupContent, setgroupContent] = useState('')
    const [showOrClose, setShowOrClose] = useState(true)
    const [showInput, setShowInput] = useState(false)
    const [blockList, setblockList] = useState(blackList)
    const [nickNameLen, setNickNameLen] = useState(false)
    const inputNickName = createRef()
    const [typingSwitch, setTypingSwitch] = useState(false)
    const [groupRequestSwitch, setGroupRequestSwitch] = useState(false)

    useEffect(() => {
        if (myUserInfo) {
            setNickName(myUserInfo.nickName)
            if (myUserInfo.avatarIndex !== null) {
                setAvatarIndex(myUserInfo.avatarIndex)
            }
        }
    }, [myUserInfo])

    let maxLength = 12;
    const handleClose = () => {
        onClose();
    };

    const handleMenuClick = (e) => {
        if (e.target.innerHTML.includes('Info')) {
            setTabIndex(1)
        } else if (e.target.innerHTML.includes('Privacy')) {
            setTabIndex(2)
        } else if (e.target.innerHTML.includes('About')) {
            setTabIndex(3)
        } else if (e.target.innerHTML.includes('Notifications')) {
            setTabIndex(4)
        } else if (e.target.innerHTML.includes('General')) {
            setTabIndex(5)
        }
    }
    const submitNickName = () => {
        if (nickName.length > 0) {
            editSelfInfoMessage({ nickname: nickName })
        }
        setEditStatus(false)
    }
    const handleEditClick = () => {
        setEditStatus(true)
    }
    const handleEditBlur = () => {
        setEditStatus(false)
    }
    const handleEditChange = (e) => {
        let value = e.target.value;
        if (value.length < 0 || value.length > 12) {
            if (nickNameLen) {
                setNickNameLen(false)
                message.error(`${i18next.t("Nickname is empty or exceeds the limit")}`);
            }
            return;
        } else {
            setNickNameLen(true)
        }
        setNickName(e.target.value);
    }

    const handlePrivacyItemMoreClick = (e) => {
        setAddEl(e.currentTarget)
        setAddElSub(e.currentTarget)
    }

    const handleUnblockContact = (target) => {
        removeFromBlackList(target.value, handleCloseMenu)
    }

    const handleDeleteContact = (target) => {
        deleteContact(target.value, handleCloseMenu)
    }

    const handleCheckAvatar = (index) => {
        setAvatarIndex(index)
        store.dispatch(setMyUserInfo({
            ...myUserInfo,
            avatarIndex: index
        }))
        localStorage.setItem('avatarIndex_1.0', index)
    }

    function tabs() {
        const avatarUrl = avatarIndex > -1 ? AVATARS[avatarIndex] : avater11
        return (
            <div className={classes.tabsInfo}>
                <div className={classes.settingInfoBox}>
                    <Avatar style={{ width: 100, height: 100, marginTop: '36px', cursor: 'pointer' }} onClick={() => setTabIndex(0)} src={avatarUrl}>

                    </Avatar>
                    <img src={editIcon} alt='edit' className={classes.avatarEditIcon}  />
                    <div>{nickName}</div>
                    <div>AgoraID: {myUserInfo?.agoraId}</div>
                </div>
                <List className={classes.settingMenuBox} onClick={handleMenuClick}>
                    <ListItemButton key={0} className={classes.menuBtn} selected={tabIndex === 1}>
                        <img src={infoIcon} alt="info" className={classes.menuIcon} />
                        Info
                    </ListItemButton>
                    <ListItemButton key={5} className={classes.menuBtn} selected={tabIndex === 5}>
                        <img src={settingsIcon} alt="info" className={classes.menuIcon} />
                        General
                    </ListItemButton>
                    <ListItemButton key={3} className={classes.menuBtn} selected={tabIndex === 4}>
                        <img src={notificationsIcon} alt="notifications" className={classes.menuIcon} />
                        Notifications
                    </ListItemButton>
                    <ListItemButton key={1} className={classes.menuBtn} selected={tabIndex === 2}>
                        <img src={privacyIcon} alt="privacy" className={classes.menuIcon} />
                        Privacy
                    </ListItemButton>
                    <ListItemButton key={2} className={classes.menuBtn} selected={tabIndex === 3}>
                        <img src={aboutIcon} alt="about" className={classes.menuIcon} />
                        About
                    </ListItemButton>
                </List>
            </div>
        )
    }

    function switchTabPanels() {
        if (tabIndex === 0) {
            return avatarTabPaner()
        } else if (tabIndex === 1) {
            return infoTabPanel()
        } else if (tabIndex === 2) {
            return privacyTabPanel()
        } else if (tabIndex === 3) {
            return aboutTabPanel()
        } else if (tabIndex === 4) {
            return notificationTabPanel()
        } else if (tabIndex === 5) {
            return generalTabPanel()
        }
    }
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
            options: {
                paramType: 0,
                remindType: value,
            }
        }
        setNotDisturb(params)
        setShowSelectOption(false)
    }
    const setNotDisturb = (params) => {
        setSilentModeForAll(params).then(res => {
        })
    }

    const handleCloseMenu = () => {
        setAddEl(null)
    }
    const getNotDisturb = () => {
        getSilentModeForAll().then(res => {
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
                setNotifyText(type)
                setSelectDisabled(true)
            } else {
                selectList.forEach(item => {
                    if (item.value === 'All Message') {
                      item.checked = true
                      setSelectContent(item.label)
                    } else {
                      item.checked = false
                    }
                })
            }
            if (res.ignoreDuration) {
                if (setTimeVSNowTime(res, true)) {
                    setCheckedValue('')
                    setShowRadio(true)
                } else {
                    setCheckedDefaultValue(res.ignoreDuration, 0, true)
                    setTurnOffBtnFlag(true)
                }
            } else {
                setShowRadio(true)
            }
        })
    }

    useEffect(() => {
        if (open) {
            getNotDisturb()
        }
        if (getLocalStorageData().sound) {
            setSoundSwitch(getLocalStorageData().sound)
        }
        if (getLocalStorageData().previewText) {
            setTextSwitch(getLocalStorageData().previewText)
        }
        if (getLocalStorageData().typingSwitch) {
            setTypingSwitch(getLocalStorageData().typingSwitch)
        }
        if (getLocalStorageData().groupRequestSwitch) {
            setGroupRequestSwitch(getLocalStorageData().groupRequestSwitch)
        }
        if (getLocalStorageData().deleteSwitch) {
            setDeleteSwitch(getLocalStorageData().deleteSwitch)
        }
    }, [open])
    const handleChangeRadio = (event) => {
        setDefaultValue(event.target.value)
    }
    const handlerArrowImg = () => {
        if (turnOffBtnFlag) {
            return
        }
        setShowRadio(!showRadio)
    }
    const handlerTurnOffBtn = (e) => {
        e.stopPropagation()
        e.preventDefault()
        e.cancelBubble = true // IE
        e.returnValue = false // IE
        setopenTurnOff(true)
    }
    const setCheckedDefaultValue = (time, index, flag) => {
        let str = ''
        if (index < 4) {
            str = handlerTime(time, flag)
        } else {
            let list = handlerTime(24).split(',')
            str = `${list[0]}, ${list[1]}, 08:00`
        }
        setCheckedValue(str)
    }
    const handlerDoneBtn = () => {
        const radioIndex = Number(defaultValue)
        if (defaultValue === '5') {
            setCheckedValue('You Turn it Off')
        } else {
            setCheckedDefaultValue(radioList[radioIndex].time, radioIndex)
        }
        setShowRadio(false)
        const params = {
            options: {
                paramType: 1,
                duration: getMillisecond(radioList[radioIndex].time)
            }
        }
        setNotDisturb(params)
        setSelectDisabled(true)
        setTurnOffBtnFlag(true)
    }

    const handleSwitchChange = (e, val) => {
        const checked = e.target.checked
        const soundPreviewText = {
            sound: soundSwitch,
            previewText: textSwitch,
            deleteSwitch: deleteSwitch,
            typingSwitch: typingSwitch,
            groupRequestSwitch: groupRequestSwitch
        }
        if (Number(val) === 1) {
            setSoundSwitch(checked)
            soundPreviewText['sound'] = checked
        } else if (Number(val) === 2) {
            setDeleteSwitch(checked)
            soundPreviewText['deleteSwitch'] = checked
        } else if (Number(val) === 3) {
            setTypingSwitch(checked)
            soundPreviewText['typingSwitch'] = checked
        } else if (Number(val) === 4) {
            setGroupRequestSwitch(checked)
            soundPreviewText['groupRequestSwitch'] = checked
        } else {
            setTextSwitch(checked)
            soundPreviewText['previewText'] = checked
        }
        localStorage.setItem('soundPreviewText', JSON.stringify(soundPreviewText))
    }

    const handleTurnOffClose = () => {
        setopenTurnOff(false)
    }
    const handlerOkay = () => {
        setTurnOffBtnFlag(false)
        setShowRadio(true)
        handleTurnOffClose()
        setSelectDisabled(false)
        setCheckedValue('')
        setDefaultValue('')
        const params = {
            options: {
                paramType: 1,
                duration: 0
            }
        }
        setNotDisturb(params)
    }
    const handlerSelectBox = () => {
        setShowSelectOption(!showSelectOption)
    }
    const showSecondDialog = (val) => {
		setGroupStatus(val)
		if (val === 1) {
			setgroupContent('Move To Block')
		} else {
			setgroupContent('Delete Contact')
		}
		setSecondSure(true)
        handleCloseMenu()
	}
	const confirmQuitGroup = () => {
		if (GroupStatus === 1) {
			handleUnblockContact(addElSub)
		} else {
			handleDeleteContact(addElSub)
		}
		setSecondSure(false)
	}
    useEffect(() => {
        const tempArr = []
        blackList.forEach(item => {
            tempArr.push(item)
        })
        setblockList(tempArr)
    }, [blackList])
    const searchChangeValue = (e) => {
        const value = e.target.value
        if (!value) {
            setblockList(blackList)
            return
        }
        const tempArr = []
        blockList.forEach(item => {
            if (item.includes(value)) {
                tempArr.push(item)
            }
        })
        setblockList(tempArr)
	};

    const closeOrShowBlockList = () => {
        setShowOrClose(!showOrClose)
    }
    useEffect(() => {
        if (inputNickName) {
            inputNickName.current && inputNickName.current.focus()
        }
    }, [inputNickName])
    function infoTabPanel() {
        return (
            <div className={classes.infoPanel} style={{display: 'block'}}>
                {editStatus ? (
                    <Box className={classes.infoSwitchItem}>
                        <span className={classes.spanNickName}>NickName</span>
                        <InputBase
                            type="text"
                            max={12}
                            className={classes.gInputBaseWidth}
                            placeholder={i18next.t("Your NickName")}
                            value={nickName}
                            onChange={handleEditChange}
                            inputRef={inputNickName}
                        />
                        <span className={classes.doneNickName} onClick={submitNickName}>Done</span>
                    </Box>
                ) : (
                    <div className={classes.infoItem}>
                        <span>NickName</span>
                        <span>{nickName}</span>
                        <span onClick={handleEditClick}>Edit</span>
                    </div>
                )}
            </div>
        );
    }

    function aboutTabPanel() {
        return (
            <div className={
                classes.infoPanel
            }>
                <div style={{ flex: 1 }}>
                    <div className={classes.aboutItem}>SDK version: 4.0.5</div>
                    <div className={classes.aboutItem}>uikit version: 1.0.3</div>
                    <div className={classes.aboutItem}>More: <a href="https://www.agora.io/en/" target="_black">Agora</a></div>
                </div>
            </div>
        )
    }

    function privacyTabPanel() {
        return (
            <div className={classes.infoPanel}>
                <div className={classes.blockedListBox}>
                    {
                        !showInput && <div className={classes.blockText}>Blocked List</div>
                    }
                    <div className={classes.searchBox}>
                        {
                            showInput ?
                            <div className={classes.inputBox}>
                                <InputBase
                                    type="search"
                                    placeholder={i18next.t("User Name")}
                                    className={classes.textStyle}
                                    onChange={searchChangeValue}
                                />
                                <span className={classes.cancelBtn} onClick={() => setShowInput(false)}>Cancel</span>
                            </div>
                            : <img
                                src={rearchIcon}
                                alt=""
                                className={classes.imgSearchStyle}
                                onClick={() => setShowInput(true)}/>
                        }
                    </div>
                    <img onClick={closeOrShowBlockList} className={`${classes.arrowImg} ${showOrClose ? classes.arrowUpImg : classes.arrowDownImg}`} alt="" src={arrow} />
                </div>
                {
                    showOrClose && <List dense className={classes.listBoxBlock} sx={{ width: '400px' }}>
                        { blockList.length ? blockList.map((value) => {
                            const labelId = `label-${value}`;
                                return (
                                    <ListItem
                                        fullWidth
                                        key={labelId}
                                        className={classes.listItemBlock}
                                    >
                                        <Button fullWidth style={{
                                            display: 'flex',
                                            'justify-content': 'space-between'
                                        }}>
                                            <div className={classes.privacyItemInfo}>
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={userAvatar(value)}
                                                        alt={`Avatar n°${value + 1}`}
                                                    />
                                                </ListItemAvatar>
                                                <span style={{textTransform: 'none'}}>{value}</span>
                                            </div>
                                            <IconButton value={value} onClick={handlePrivacyItemMoreClick}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Button>
                                    </ListItem>
                                )
                            }) : <div style={{textAlign: 'center', height: '100px', paddingTop: '40px'}}>No Data</div>
                        }
                    </List>
                }

                <Menu
                    id="simple-menu"
                    anchorEl={addEl}
                    keepMounted
                    open={Boolean(addEl)}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={() => showSecondDialog(1)}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center' }}>
                            <RemoveCircleOutlineIcon style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                            Unblock
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => showSecondDialog(2)}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center', color: '#FF14CC' }}>
                            <img src={deleteContactIcon} alt='deleteContact' style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                            Delete Contact
                        </Typography>
                    </MenuItem>
                </Menu>
                <SecondConfirmDialog
                    open={Boolean(secondSure)}
                    onClose={() => setSecondSure(false)}
                    confirmMethod={() => confirmQuitGroup()}
                    confirmContent={{
                        content: groupContent
                    }}
                ></SecondConfirmDialog>
            </div>
        )
    }

    function avatarTabPaner() {
        return (
            <div className={classes.infoPanel} style={{display: 'flex'}}>
                {AVATARS.map((value, index) => {
                    return (<div style={{ width: '117px', height: '117px', margin: '5px', borderRadius: '4px', overflow: 'hidden' }} onClick={() => { handleCheckAvatar(index) }} key={value}>
                        <img src={value} alt='avatar1' style={{ width: '100%' }} />
                        {
                            avatarIndex === index ? <img src={avaterSelect} alt="select" style={{
                                position: 'relative',
                                top: '-119px',
                                right: '0',
                                width: '117px'
                            }} /> : null
                        }
                    </div>)
                })}
            </div>
        )
    }
    function renderTurnOffContent() {
        return (
            <div className={classes.contentBox}>
                {defaultValue === '5' ? 'You have set Do Not Disturb.' : <span>You have set Do Not Disturb <span className={classes.unmuteTimeStyle}>{checkedValue}</span>.</span>}
            </div>
        )
    }

    function renderTurnOffFooter() {
        return (
            <div className={classes.btnBox}>
                <span className={classes.turnOffBtnStyle} onClick={handleTurnOffClose}>Cancel</span>
                <span className={classes.rightBtn} onClick={handlerOkay}>Okay</span>
            </div>
        )
    }

    function notificationTabPanel() {
        return (
            <div className={classes.notificationPanel}>
                <div className={classes.notificationItem}>
                    <div className={classes.notifyTitle}>
                        {i18next.t('Push Notifications')}
                    </div>
                    <div className={classes.selectAndRadio + ' ' + classes.bottomItem}>
                        <div>
                            <div className={classes.flexBox}>
                                <span className={classes.notifySubTitle}>{i18next.t('Notifications Settings')}</span>
                                <div className={classes.mySelect}>
                                    <div className={classes.selectTop} onClick={handlerSelectBox}>
                                        <span className={classes.selectDefaultText}>{selectContent}</span>
                                        <img className={`${classes.imgStyle} ${showSelectOption ? classes.imgUpStyle : classes.imgDownStyle}`} alt="" src={muteIcon} />
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
                            <div className={classes.bottomItem}>
                                <div className={`${classes.flexBox} ${!turnOffBtnFlag ? classes.cursorStyle : ''}`} onClick={handlerArrowImg}>
                                    <div>
                                        <span className={classes.notifySubTitle}>{i18next.t('Do not Disturb')}</span>
                                        {
                                            checkedValue ? <span className={classes.notifyPrayTitle}>Until {checkedValue}</span> : null
                                        }
                                    </div>
                                    {
                                        checkedValue && turnOffBtnFlag ?
                                        <span onClick={(e) => handlerTurnOffBtn(e)} className={classes.turnStyle}>Turn Off</span>
                                        : <img className={`${classes.arrowImg} ${showRadio ? classes.arrowUpImg : classes.arrowDownImg}`} alt="" src={arrow} />
                                    }
                                </div>
                                {showRadio ?
                                    <div className={classes.previewStyle + ' ' + classes.bottomItem}>
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
                                            <span onClick={handlerDoneBtn} className={classes.btnStyle}>{i18next.t('Done')}</span>
                                        </div>
                                    </div> : null
                                }
                            </div>
                        </div>
                        <div className={classes.bottomStyle + ' ' + classes.previewStyle + ' ' + classes.bottomItem + ' ' + classes.flexBox}>
                            <span className={classes.notifySubTitle}>{i18next.t('Show Preview Text')}</span>
                            <Switch checked={textSwitch} color="primary" className={`${classes.switchStyle} ${classes.switchStyleMargin} ${textSwitch ? classes.switchOpenStyle : ''}`} onChange={(e) => handleSwitchChange(e, 0)}></Switch>
                        </div>
                    </div>
                </div>
                <div className={classes.notificationItem + ' ' + classes.bottomItem}>
                    <div className={classes.notifyTitle}>{i18next.t('Notification Sounds')}</div>
                    <div className={classes.bottomStyle + ' ' + classes.alertStyle + ' ' + classes.flexBox}>
                        <span className={classes.notifySubTitle}>{i18next.t('Alert Sound')}</span>
                        <Switch checked={soundSwitch} color="primary" className={`${classes.switchStyle} ${soundSwitch ? classes.switchOpenStyle : ''}`} onChange={(e) => handleSwitchChange(e, 1)}></Switch>
                    </div>
                </div>
                <CommonDialog
                    open={openTurnOff}
                    onClose={handleTurnOffClose}
                    title={i18next.t("Turn off Do Not Disturb?")}
                    content={renderTurnOffContent()}
                    footer={renderTurnOffFooter()}
                    className={classes.commonDialog}
                ></CommonDialog>
            </div>
        )
    }

    function generalTabPanel () {
        return (
            <div className={classes.infoPanel} style={{display: 'block'}}>
                <div className={classes.infoSwitchItem}>
                    <span className={classes.notifySubTitle} style={{fontSize: '16px'}}>{i18next.t('Show Typing')}</span>
                    <Switch checked={typingSwitch} color="primary" className={classes.switchMargin} onChange={(e) => handleSwitchChange(e, 3)}></Switch>
                </div>
                <div className={classes.infoSwitchItem}>
                    <span className={classes.notifySubTitle} style={{fontSize: '16px'}}>{i18next.t('Add Group Request')}</span>
                    <Switch checked={groupRequestSwitch} color="primary" className={classes.switchMargin} onChange={(e) => handleSwitchChange(e, 4)}></Switch>
                </div>
                <div className={classes.infoSwitchItem}>
                    <span className={classes.notifySubTitle} style={{fontSize: '16px'}}>{i18next.t('Delete the Chat after Leaving Group')}</span>
                    <Switch checked={deleteSwitch} color="primary" className={classes.switchMargin} onChange={(e) => handleSwitchChange(e, 2)}></Switch>
                </div>
            </div>
        )
    }

    function renderContent() {
        return (
            <div className={classes.root}>
                {tabs()}
                {switchTabPanels()}
            </div>
        );
    }

    return (
        <CommonDialog
            open={open}
            onClose={handleClose}
            title={i18next.t("Settings")}
            content={renderContent()}
            maxWidth={700}
            className={classes.settingDialogLu}
        ></CommonDialog>
    );
}

