import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Popover, Box, Avatar, Button, Tooltip, Select } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { addFromBlackList } from "../../../api/contactsChat/getContacts";
import CommonDialog from "../../common/dialog";
import { handlerTime, getMillisecond, computedItervalTime, timeIntervalToMinutesOrHours, setTimeVSNowTime } from '../../../utils/notification'
import { setSilentModeForConversation, getSilentModeForConversation } from '../../../api/notificationPush'
import { userAvatar } from '../../../utils'
import ConfirmDialog from '../../common/confirmDialog'

import avatarImg from "../../../assets/avatar2.jpg";
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
import checkgrayIcon from '../../../assets/check_gray.png'
import upAndDown from '../../../assets/go@2x.png'
import SecondConfirmDialog from '../../common/secondConfirmDialog'

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
			// marginLeft: "8px",
			display: "flex",
			justifyContent: "flex-start",
			borderRadius: '8px',
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
      width: '24px',
      height: '24px',
      background: '#fff',
      textAlign: 'center',
			position: 'absolute',
			left: '189px',
			bottom: '70px',
			lineHeight: '34px'
		},
		imgStyle: {
			borderRadius: '50%',
			width: '22px',
			height: '22px'
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
			fontSize: '16px',
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
			fontSize: '16px',
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
			fontSize: '14px',
    	fontWeight: '600',
		},
		timeMuteStyle: {
			color: '#999999',
			fontSize: '14px',
			fontWeight: 'normal',
		},
		unmuteTimeStyle: {
			color: '#0D0D0D',
			fontSize: '16px',
			fontWeight: '500',
		},
		contentStyle: {
      display: 'inline-block',
      width: '540px',
    },
		commonDialog: {
			'& .MuiDialog-paper': {
				overflow: 'inherit'
			},
			'& .MuiDialogContent-root': {
				overflow: 'inherit'
			},
			'& .MuiDialog-paperWidthSm': {
					borderRadius: '12px'
			}
		},
    mySelect: {
			position: 'relative',
			background: '#F4F5F7',
			borderRadius: '10px',
			height: '54px',
			width: '308px',
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
			fontFamily: 'Roboto',
			fontStyle: 'normal',
			fontWeight: '500',
			fontSize: '18px',
			color: '#000000',
			lineHeight: '54px',
    },
    selectBottom: {
			width: '332px',
			position: 'absolute',
			top: '60px',
			left: '-12px',
			background: '#F4F5F7',
			boxShadow: '0px 24px 36px rgba(0, 0, 0, 0.2), 8px 0px 24px rgba(0, 0, 0, 0.16)',
			borderRadius: '12px',
			padding: '12px 12px 0px 12px',
			boxSizing: 'border-box',
			zIndex: '1',
    },
    selectTextlist: {
			height: '48px',
			width: '308px',
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
			fontFamily: 'Roboto',
			fontStyle: 'normal',
			fontWeight: '500',
			fontSize: '18px',
			lineHeight: '48px',
			color: '#000000',
    },
    checkedStyle: {
			width: '17px',
			verticalAlign: 'middle'
    },
		arrowImgStyle: {
			width: '17px',
			height: '17px',
		},
		imgUpStyle: {
			transform: 'rotate(-90deg)',
		},
		imgDownStyle: {
			transform: 'rotate(90deg)',
		},
		selfMsginfoPopover: {
			'& .MuiPopover-paper': {
				padding: '8px',
				boxSizing: 'border-box',
			}
		}
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
		time: 15,
		checked: true
	},
	{
		title: 'For 1 hour',
		value: 1,
		time: 1,
		checked: false
	},
	{
		title: 'For 3 hours',
		value: 2,
		time: 3,
		checked: false
	},
	{
		title: 'For 8 hours',
		value: 3,
		time: 8,
		checked: false
	},
	{
		title: 'For 24 hours',
		value: 4,
		time: 24,
		checked: false
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
	const [confirmStatus, setConfirmStatus] = useState(null)
	const muteDataObj = useSelector((state) => state?.muteDataObj) || {}
	const [showSelectOption, setShowSelectOption] = useState(false)
	const [selectContent, setSelectContent] = useState('For 15 minutes')
	const [secondSure, setSecondSure] = useState(false)
	const [GroupStatus, setGroupStatus] = useState('')
	const [groupContent, setgroupContent] = useState('')
	let { to } = sessionInfo
	let presenceExt = null
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
			handleTurnOffClose()
			onClose()
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
	const handleSelectChange = (item) => {
		const value = item.value
		setNotifyText(value)
		radioList.forEach(item => {
			if (item.value === value) {
				item.checked = true
				setSelectContent(item.title)
			} else {
				item.checked = false
			}
		})
		setShowSelectOption(false)
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
					// setNotifyDialogText('Unmute this Contact')
				}
			} else {
				setNotifyDialogText('Mute this Contact')
				setMuteTimeText(null)
			}
			// if (Object.keys(muteDataObj[to]).length) {
			// 	setNotifyDialogText('Unmute this Contact')
			// }
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
		setMuteTimeText(str)
		setUnmuteTimeText(str)
		setNotifyDialogText('Unmute this Contact')
	}
	useEffect(() => {
		if (to) {
			getNotDisturb(to)
		}
	}, [to])
	const handlerSelectBox = () => {
		setShowSelectOption(!showSelectOption)
	}
	function renderTurnOffContent() {
		if (notifyDialogText === 'Mute this Contact') {
			return (
				<div className={classes.contentBox}>
					<div className={classes.flexBox}>
						<div className={classes.mySelect}>
								<div className={classes.selectTop} onClick={handlerSelectBox}>
										<span className={classes.selectDefaultText}>{selectContent}</span>
										<img className={`${classes.arrowImgStyle} ${showSelectOption ? classes.imgUpStyle : classes.imgDownStyle}`} alt="" src={upAndDown} />
								</div>
								{
									showSelectOption &&
									<div className={classes.selectBottom}>
									{
										radioList.map(item => {
											return (
												<div key={item.value} onClick={() => handleSelectChange(item)} className={`${classes.selectTextlist} ${item.checked ? classes.selectChecked : ''}`}>
												<span className={classes.selectOption} value={item.value}>{item.title}</span>
												{item.checked ? <img alt="" className={classes.checkedStyle} src={checkgrayIcon} /> : ''}
												</div>
											)
										})
									}
									</div>
								}
						</div>
					</div>
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
					<span className={classes.rightBtn} onClick={() => handlerOkay(1)}>{i18next.t('Okay')}</span>
				</div>
			)
		}
	}
	const showSecondDialog = (val) => {
		setGroupStatus(val)
		if (val === 1) {
			setgroupContent('Make To Block')
		} else {
			setgroupContent('Delete Contact')
		}
		setSecondSure(true)
		onClose()
	}
	const confirmQuitGroup = () => {
		if (GroupStatus === 1) {
			addFromBlackList(to)
		} else {
			// deleteContact(to, onClose)
		}
		setSecondSure(false)
	}
		const handleConfirmDialogChange = (e) => {
			// setConfirmStatus(e.currentTarget)
			setConfirmStatus(true)
			onClose()
		}

		const handleConfirmDialogClose = () => {
			setConfirmStatus(null)
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
					className={classes.selfMsginfoPopover}
				>
					<Box className={classes.root}>
						<Box className={classes.infoBox}>
							<Avatar
								src={userAvatar(to)}
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
							onClick={() => showSecondDialog(1)}
						>
							<img src={blockIcon} alt="chat" style={{ width: "30px" }} />
							<Typography className={classes.infoBtnText}>
								{i18next.t("Block")}
							</Typography>
						</Button>
						<Button
							className={classes.infoBtn}
							onClick = {handleConfirmDialogChange}
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
					className={classes.commonDialog}
				></CommonDialog>

				<ConfirmDialog 
					anchorEl={confirmStatus} 
					onClose={handleConfirmDialogClose} 
					type={"contact"}
					id={to}
				/>
				<SecondConfirmDialog
					open={Boolean(secondSure)}
					onClose={() => setSecondSure(false)}
					confirmMethod={() => confirmQuitGroup()}
					confirmContent={{
						content: groupContent
					}}
				></SecondConfirmDialog>
			</>
		);
	};
export default SessionInfoPopover;
