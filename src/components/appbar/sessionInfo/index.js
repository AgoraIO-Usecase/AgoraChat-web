import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Popover, Box, Avatar, Button, Tooltip, Select } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
	addFromBlackList,
	deleteContact,
} from "../../../api/contactsChat/getContacts";
import CommonDialog from "../../common/dialog";
import { handlerTime, getMillisecond, computedItervalTime, timeIntervalToMinutesOrHours, setTimeVSNowTime } from '../../../utils/notification'
import { setSilentModeForConversation, getSilentModeForConversation } from '../../../api/notificationPush'

import avatarImg from "../../../assets/avatar1.png";
import blockIcon from "../../../assets/block@2x.png";
import deleteIcon from "../../../assets/red@2x.png";

import offlineImg from '../../../assets/Offline.png'
import onlineIcon from '../../../assets/Online.png'
import busyIcon from '../../../assets/Busy.png'
import donotdisturbIcon from '../../../assets/Do_not_Disturb.png'
import customIcon from '../../../assets/custom.png'
import leaveIcon from '../../../assets/leave.png'
import muteIcon from '../../../assets/mute@2x.png'
import unmuteIcon from '../../../assets/unmute.png'
import grayMuteIcon from '../../../assets/gray@2x.png'

const useStyles = makeStyles((theme) => {
	return {
		root: {
			// height: "280px",
			width: "340px",
			background: "#FFFFFF",
		},
		infoBox: {
			textAlign: "center",
			position: 'relative',
		},
		avatarImg: {
			width: "100px",
			height: "100px",
			margin: "25px auto",
		},
		nameText: {
			Typeface: "Ping Fang SC",
			fontWeight: "Semibold(600)",
			fontSize: "20px",
			character: "0",
			color: "#0D0D0D",
		},
		idText: {
			Typeface: "Ping Fang SC",
			fontWeight: "Regular(400)",
			fontSize: "12px",
			character: "0",
			LineHeight: "20(1.667)",
			color: "#999999",
		},
		infoBtn: {
			width: "100%",
			textTransform: "none",
			marginTop: "5px",
			marginLeft: "8px",
			display: "flex",
			justifyContent: "flex-start",
		},
		infoBtnText: {
			Typeface: "Ping Fang SC",
			fontWeight: "Medium(500)",
			marginLeft: "8px",
			fontSize: "14px",
			character: "0",
			color: "#000000",
			textAlign: 'left',
		},
		imgBox: {
			borderRadius: '50%',
      width: '32px',
      height: '32px',
      background: '#fff',
      textAlign: 'center',
			position: 'absolute',
			left: '196px',
			bottom: '80px',
		},
		imgStyle: {
			borderRadius: '50%',
			width: '30px',
			height: '30px'
		},
		btnBox: {
			width: '100%',
			textAlign: 'right'
		},
		btnCenterBox: {
			width: '100%',
			textAlign: 'center'
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
		contentBox: {
			margin: '20px',
			fontSize: '14px',
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
		notifySelect: {
			background: '#fff',
			width: '308px',
			height: '40px',
		},
		btnDoneStyle: {
			width: '150px',
			height: '36px',
			background: '#114EFF',
			color: '#fff',
			margin: '40px auto',
			lineHeight: '36px',
			cursor: 'pointer',
			borderRadius: '26px',
		},
		timeMuteStyle: {
			color: '#999999',
			fontSize: '14px',
			fontWeight: 'normal',
		},
		unmuteTimeStyle: {
			color: '#0D0D0D',
			fontSize: '16px',
			fontWeight: 'normal',
		},
		contentStyle: {
      display: 'inline-block',
      width: '540px',
    },
	};
});
const statusImgObj = {
	'Offline': offlineImg,
	'Online': onlineIcon,
	'Busy': busyIcon,
	'Do not Disturb': donotdisturbIcon,
	'Leave': leaveIcon,
	'': onlineIcon
}
const radioList = [
	{
		title: 'For 15 minutes',
		value: 0,
		time: 15
	},
	{
		title: 'For 1 hour',
		value: 1,
		time: 1
	},
	{
		title: 'For 3 hours',
		value: 2,
		time: 3
	},
	{
		title: 'For 8 hours',
		value: 3,
		time: 8
	},
	{
		title: 'For 24 hours',
		value: 4,
		time: 24
	},
	// {
	// 	title: 'Until I turn it Unmute',
	// 	value: 5,
	// 	time: 'none'
	// }
]
const SessionInfoPopover = ({ open, onClose, sessionInfo }) => {
	const classes = useStyles();
	const presenceList = useSelector((state) => state?.presenceList) || []
	const [usePresenceExt, setPresenceExt] = useState('')
	const [notifyText, setNotifyText] = useState(0)
	const [notifyDialogText, setNotifyDialogText] = useState('Mute this Contact')
	const [openTurnOff, setOpenTurnOff] = useState(false)
	const [muteTimeText, setMuteTimeText] = useState(null)
	const [unmuteTimeText, setUnmuteTimeText] = useState(null)
	const muteDataObj = useSelector((state) => state?.muteDataObj) || {}
	let { to } = sessionInfo
	let presenceExt = ''
	presenceList.forEach(item => {
		if (item.uid === to) {
			presenceExt = item.ext
		}
	})
	useEffect(() => {
		setPresenceExt(presenceExt)
	}, [presenceExt])
	const setUserNotification = () => {
		setOpenTurnOff(true)
	}
	const handleTurnOffClose = () => {
		setOpenTurnOff(false)
	}
	const handlerOkay = (val) => {
		if (val) {
			setNotifyDialogText('Mute this Contact')
			setMuteTimeText(null)
			setUnmuteTimeText(null)
			setOpenTurnOff(true)
			const params = {
				conversationId: to,
				type: 'singleChat',
				options: {
					paramType: 1,
					duration: 0
				}
			}
			setNotDisturb(params)
		} else {
			if (notifyText !== 5) {
				let str = ''
				str = handlerTime(radioList[notifyText].time)
				setUnmuteTimeText(str)
				setMuteTimeText('Mute Until ' + str)
			}
			setNotifyDialogText('Unmute this Contact')
			console.log(radioList[notifyText].time, 'radioList[notifyText].time')
			const params = {
				conversationId: to,
				type: 'singleChat',
				options: {
					paramType: 1,
					duration: getMillisecond(radioList[notifyText].time)
				}
			}
			setNotDisturb(params)
			handleTurnOffClose()
		}
	}
	const handleSelectChange = (event) => {
		console.log(event.target.value)
		setNotifyText(event.target.value)
	}

	const setNotDisturb = (params) => {
		console.log(params, 'setSilentModeForConversation')
		setSilentModeForConversation(params).then(res => {
			console.log(res, 'setSilentModeForConversation')
		})
	}
	const getNotDisturb = (userId) => {
		getSilentModeForConversation({conversationId: userId, type: 'singleChat'}).then(res => {
			console.log(res, 'getSilentModeForConversation')
			if (res.ignoreDuration) {
				if (setTimeVSNowTime(res, true)) {
					setNotifyDialogText('Mute this Contact')
				} else {
					setCheckedDefaultValue(res.ignoreDuration, 0, true)
				}
			}
			if (Object.keys(muteDataObj[to]).length) {
				setNotifyDialogText('Unmute this Contact')
			}
		})
	}
	const setCheckedDefaultValue = (time, index, flag) => {
		let str = ''
		if (index < 4) {
			str = handlerTime(time, flag)
		} else {
			let list = handlerTime(24).split(',')
			str = `${list[0]}, ${list[1]}, 08:00`
		}
		setNotifyDialogText(str)
	}
	useEffect(() => {
		if (to) {
			getNotDisturb(to)
		}
	}, [to])

	function renderTurnOffContent() {
		if (notifyDialogText === 'Mute this Contact') {
			return (
				<div className={classes.contentBox}>
					<Select
						native
						value={notifyText}
						className={classes.notifySelect}
						onChange={handleSelectChange}
						variant="outlined"
					>
						{
							radioList.map((item, index) => {
								return (
									<option key={index} value={item.value}>{item.title}</option>
								)
							})
						}
					</Select>
				</div>
			)
		} else {
			return (
				<div className={classes.contentBox}>
					{notifyText === 5 ? <span className={classes.contentStyle}>You have muted this Contact.</span> : <span className={classes.contentStyle}>You have muted this Contact until <span className={classes.unmuteTimeStyle}>{unmuteTimeText}</span>.</span>}
				</div>
			)
		}
	}

	function renderTurnOffFooter() {
		if (notifyDialogText === 'Mute this Contact') {
			return (
				<div className={classes.btnCenterBox}>
					<div className={classes.btnDoneStyle} onClick={() => handlerOkay(0)}>{i18next.t('Done')}</div>
				</div>
			)
		} else {
			return (
				<div className={classes.btnBox}>
					<span className={classes.turnOffBtnStyle} onClick={handleTurnOffClose}>{i18next.t('Cancel')}</span>
					<span className={classes.btnStyle + ' ' + classes.rightBtn} onClick={() => handlerOkay(1)}>{i18next.t('Okay')}</span>
				</div>
			)
		}
	}
	return (
		<>
			<Popover
				open={Boolean(open)}
				anchorEl={open}
				onClose={onClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<Box className={classes.root}>
					<Box className={classes.infoBox}>
						<Avatar
							src={avatarImg}
							className={classes.avatarImg}
						></Avatar>
						<Tooltip title={usePresenceExt} placement="bottom-end">
							<div className={classes.imgBox}>
								<img alt="" src={statusImgObj[usePresenceExt] || customIcon} className={classes.imgStyle} />
							</div>
						</Tooltip>
						<Typography className={classes.nameText}>
							{to}
							{
								muteDataObj[to] ? <img style={{ width: "16px", marginLeft: '2px' }} src={grayMuteIcon} alt="" /> : null
							}
						</Typography>
						<Typography className={classes.idText}>
							AgoraID:{to}
						</Typography>
					</Box>
					<Button
						className={classes.infoBtn}
						onClick={() => setUserNotification()}
					>
						{
							muteDataObj[to] ? <img src={unmuteIcon} alt="chat" style={{ width: "30px" }} /> : <img src={muteIcon} alt="chat" style={{ width: "30px" }} />
						}
						<Typography className={classes.infoBtnText}>
							<div>
								{i18next.t(notifyDialogText)}
							</div>
							<span className={classes.timeMuteStyle}>{i18next.t(muteTimeText)}</span>
						</Typography>
					</Button>
					<Button
						className={classes.infoBtn}
						onClick={() => addFromBlackList(to)}
					>
						<img src={blockIcon} alt="chat" style={{ width: "30px" }} />
						<Typography className={classes.infoBtnText}>
							{i18next.t("Black")}
						</Typography>
					</Button>
					<Button
						className={classes.infoBtn}
						onClick={() => deleteContact(to, onClose)}
					>
						<img
							src={deleteIcon}
							alt="new chat"
							style={{ width: "30px" }}
						/>
						<Typography className={classes.infoBtnText}>
							{i18next.t("Delete Contact")}
						</Typography>
					</Button>
			</Box>
			</Popover>
			<CommonDialog
				style={{zIndex: 1301}}
				open={openTurnOff}
				onClose={handleTurnOffClose}
				title={i18next.t(notifyDialogText)}
				content={renderTurnOffContent()}
				footer={renderTurnOffFooter()}
			></CommonDialog>
		</>
	);
};

export default SessionInfoPopover;
