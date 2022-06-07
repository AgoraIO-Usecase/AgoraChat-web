import React, { useEffect, useState } from "react";
import CommonDialog from "../../common/dialog";
import i18next, { use } from "i18next";
import { Avatar, Button, TextField, List, ListItem, ListItemAvatar, Menu, MenuItem, Box, Switch, Select, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import ListItemButton from '@mui/material/ListItemButton';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import editIcon from '../../../assets/white@2x.png'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { IconButton } from '@material-ui/core';
import deleteContactIcon from '../../../assets/deletecontact@2x.png'
import avater1 from '../../../assets/avatar1.png'
import avater2 from '../../../assets/avatar2.png'
import avater3 from '../../../assets/avatar3.png'
import avater4 from '../../../assets/avatar4.png'
import avater5 from '../../../assets/avatar5.png'
import avater6 from '../../../assets/avatar6.png'
import avater7 from '../../../assets/avatar7.png'
import avaterSelect from '../../../assets/avatar_select@2x.png'

import CheckIcon from '@material-ui/icons/Check';
import arrow from '../../../assets/go@2x.png'

import aboutIcon from '../../../assets/about@2x.png'
import privacyIcon from '../../../assets/privacy@2x.png'
import notificationsIcon from '../../../assets/notifications@2x.png'
import generalIcon from '../../../assets/general@2x.png'
import infoIcon from '../../../assets/info@2x.png'


import { useSelector } from 'react-redux'
import { setMyUserInfo } from '../../../redux/actions'
import store from '../../../redux/store'
import { message } from "../../common/alert";

import { removeFromBlackList, deleteContact } from '../../../api/contactsChat/getContacts'
import { handlerTime, getMillisecond, computedItervalTime, timeIntervalToMinutesOrHours, setTimeVSNowTime, getLocalStorageData } from '../../../utils/notification'
import { setSilentModeForAll, getSilentModeForAll, getSilentModeForConversations, setPushPerformLanguage, getPushPerformLanguage } from '../../../api/notificationPush'

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
        },

        infoPanel: {
            width: "100%",
            height: "450px",
            backgroundColor: "#EDEFF2",
            padding: "6px 8px",
            display: "flex",
            flexFlow: 'wrap',
            alignContent: 'flexStart'
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
            padding: '0 8px'
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
            borderTop: '1px solid #E6E6E6'
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
        },
        turnStyle: {
            fontWeight: '500',
            fontSize: '14px',
            textAlign: 'right',
            color: '#114EFF',
            cursor: 'pointer',
        },
        switchStyle: {
            '& .Mui-checked': {
                color: '#fff',
            }
        },
        switchOpenStyle: {
            '& .MuiSwitch-track': {
                background: 'rgb(49, 78, 238) !important',
                opacity: '1 !important',
            }
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
        menuIcon: {
            width: '30px',
            height: '30px'
        },
        menuBtn: {
            justifyContent: 'start',
            textTransform: 'none'
        }
    }
})

const AVATARS = [avater1, avater2, avater3, avater4, avater5, avater6, avater7]
const selectList = [
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
    const [notifyText, setNotifyText] = useState('ALL');
    const [defaultValue, setDefaultValue] = useState('')
    const [showRadio, setShowRadio] = useState(false)
    const [checkedValue, setCheckedValue] = useState('')
    const [textSwitch, setTextSwitch] = useState(false)
    const [soundSwitch, setSoundSwitch] = useState(false)
    const [openTurnOff, setopenTurnOff] = useState(false)
    const [selectDisabled, setSelectDisabled] = useState(false)
    const [turnOffBtnFlag, setTurnOffBtnFlag] = useState(false)
    const myUserInfo = useSelector(state => state?.myUserInfo)
    const blackList = useSelector(state => state?.blackList) || []
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
        }
    }

    const handleEditClick = () => {
        setEditStatus(true)
    }
    const handleEditBlur = () => {
        setEditStatus(false)
    }
    const handleEditChange = (e) => {
        let value = e.target.value;
        if (value.length === 0 || value.length > 12) {
            message.error(`${i18next.t("Nickname is empty or exceeds the limit")}`);
            return;
        }
        setNickName(e.target.value);
    }

    const handlePrivacyItemMoreClick = (e) => {
        setAddEl(e.currentTarget)
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
        const avatarUrl = avatarIndex > -1 ? AVATARS[avatarIndex] : null
        return (
            <div className={classes.tabsInfo}>
                <div className={classes.settingInfoBox}>
                    <Avatar style={{ width: 100, height: 100, marginTop: '36px' }} src={avatarUrl}>

                    </Avatar>
                    <img src={editIcon} alt='edit' className={classes.avatarEditIcon} onClick={() => setTabIndex(0)} />
                    <div>{nickName}</div>
                    <div>AgoraID: {myUserInfo?.agoraId}</div>
                </div>
                <List className={classes.settingMenuBox} onClick={handleMenuClick}>
                    <ListItemButton key={0} className={classes.menuBtn} selected={tabIndex === 1}>
                        <img src={infoIcon} alt="info" className={classes.menuIcon} />
                        Info
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
        }
    }
    const handleSelectChange = (event) => {
        console.log(event.target.value, 'event.target.value')
        setNotifyText(event.target.value)
        const params = {
            options: {
                paramType: 0,
                remindType: event.target.value,
            }
        }
        setNotDisturb(params)
    }
    const setNotDisturb = (params) => {
        setSilentModeForAll(params).then(res => {
            console.log(res, 'setSilentModeForAll')
        })
    }

    const handleCloseMenu = () => {
        setAddEl(null)
    }
    const getNotDisturb = () => {
        getSilentModeForAll().then(res => {
            console.log(res, 'getSilentModeForAll')
            const type = res.type
            if (type) {
                setNotifyText(type)
                setSelectDisabled(true)
            }
            if (res.ignoreDuration) {
                if (setTimeVSNowTime(res, true)) {
                    setCheckedValue('')
                } else {
                    setCheckedDefaultValue(res.ignoreDuration, 0, true)
                    setTurnOffBtnFlag(true)
                }
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
    }, [open])
    const handleChangeRadio = (event) => {
        console.log(event.target.value, 'event.target.value')
        setDefaultValue(event.target.value)
    }
    const handlerArrowImg = () => {
        setShowRadio(!showRadio)
    }
    const handlerTurnOffBtn = () => {
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
        console.log(params, 'params')
        setNotDisturb(params)
        setSelectDisabled(true)
        setTurnOffBtnFlag(true)
    }

    const handleSwitchChange = (e, val) => {
        console.log(e, val)
        const checked = e.target.checked
        const soundPreviewText = {
            sound: soundSwitch,
            previewText: textSwitch
        }
        if (val) {
            setSoundSwitch(checked)
            soundPreviewText['sound'] = checked
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
    function infoTabPanel() {
        return (
            <div className={classes.infoPanel}>
                {editStatus ? (
                    <Box className={classes.textfieldStyle}>
                        <TextField
                            onBlur={handleEditBlur}
                            onChange={handleEditChange}
                            id="filled-helperText"
                            label="NickName"
                            defaultValue={nickName}
                            variant="filled"
                            fullWidth
                        />
                        <Box className={classes.numberBox}>
                            <Typography className={classes.numberStyle}>
                                {nickName?.length}/{maxLength}
                            </Typography>
                        </Box>
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
                </div>
            </div>
        )
    }

    function privacyTabPanel() {
        return (
            <div className={classes.infoPanel}>
                <List dense sx={{ width: '400px' }} style={{ width: '100%' }}>
                    {blackList.map((value) => {
                        const labelId = `label-${value}`;
                        return (
                            <ListItem
                                fullWidth
                                key={labelId}
                            >
                                <Button fullWidth style={{
                                    display: 'flex',
                                    'justify-content': 'space-between'
                                }}>
                                    <div className={classes.privacyItemInfo}>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={`Avatar n°${value + 1}`}
                                            />
                                        </ListItemAvatar>
                                        <span>{value}</span>
                                    </div>
                                    <IconButton value={value} onClick={handlePrivacyItemMoreClick}>
                                        <MoreVertIcon />
                                    </IconButton>
                                </Button>
                            </ListItem>
                        )
                    })}
                </List>

                <Menu
                    id="simple-menu"
                    anchorEl={addEl}
                    keepMounted
                    open={Boolean(addEl)}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={handleUnblockContact.bind(this, addEl)}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center' }}>
                            <RemoveCircleOutlineIcon style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                            Unblock
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleDeleteContact.bind(this, addEl)}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center', color: '#FF14CC' }}>
                            <img src={deleteContactIcon} alt='deleteContact' style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                            Delete Contact
                        </Typography>
                    </MenuItem>
                </Menu>
            </div>
        )
    }

    function avatarTabPaner() {
        return (
            <div className={classes.infoPanel}>
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
                <span className={classes.btnStyle + ' ' + classes.rightBtn} onClick={handlerOkay}>Okay</span>
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
                                <Select
                                    value={notifyText}
                                    className={classes.notifySelect}
                                    onChange={handleSelectChange}
                                    variant="outlined"
                                    // disabled={selectDisabled}
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return <em>Please Select</em>
                                        }
                                        let tempStr = ''
                                        selectList.forEach(item => {
                                            if (item.value === selected) {
                                                tempStr = item.label
                                            }
                                        })
                                        return tempStr || <em>Please Select</em>
                                    }}
                                >
                                    {
                                        selectList.map(item => {
                                            return (
                                                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div className={classes.bottomItem}>
                                <div className={classes.flexBox}>
                                    <div>
                                        <span className={classes.notifySubTitle}>{i18next.t('Do not Disturb')}</span>
                                        {
                                            checkedValue ? <span className={classes.notifyPrayTitle}>Until {checkedValue}</span> : null
                                        }
                                    </div>
                                    {
                                        checkedValue && turnOffBtnFlag ?
                                            <span onClick={handlerTurnOffBtn} className={classes.turnStyle}>Turn Off</span>
                                            : <img className={`${classes.arrowImg} ${showRadio ? classes.arrowUpImg : classes.arrowDownImg}`} alt="" onClick={handlerArrowImg} src={arrow} />
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
                            <Switch checked={textSwitch} className={`${classes.switchStyle} ${textSwitch ? classes.switchOpenStyle : ''}`} onChange={(e) => handleSwitchChange(e, 0)}></Switch>
                        </div>
                    </div>
                </div>
                <div className={classes.notificationItem + ' ' + classes.bottomItem}>
                    <div className={classes.notifyTitle}>{i18next.t('Notification Sounds')}</div>
                    <div className={classes.bottomStyle + ' ' + classes.alertStyle + ' ' + classes.flexBox}>
                        <span className={classes.notifySubTitle}>{i18next.t('Alert Sound')}</span>
                        <Switch checked={soundSwitch} className={`${classes.switchStyle} ${soundSwitch ? classes.switchOpenStyle : ''}`} onChange={(e) => handleSwitchChange(e, 1)}></Switch>
                    </div>
                </div>
                <CommonDialog
                    open={openTurnOff}
                    onClose={handleTurnOffClose}
                    title={i18next.t("Turn off Do Not Disturb?")}
                    content={renderTurnOffContent()}
                    footer={renderTurnOffFooter()}
                ></CommonDialog>
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
        ></CommonDialog>
    );
}

