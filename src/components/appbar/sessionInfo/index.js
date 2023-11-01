import React, {useEffect, useState} from "react";
import { useSelector } from 'react-redux'
import { Popover, Box, Avatar, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { userAvatar } from '../../../utils'

import offlineImg from '../../../assets/Offline.png'
import onlineIcon from '../../../assets/Online.png'
import busyIcon from '../../../assets/Busy.png'
import donotdisturbIcon from '../../../assets/Do_not_Disturb.png'
import customIcon from '../../../assets/custom.png'
import leaveIcon from '../../../assets/leave.png'
import grayMuteIcon from '../../../assets/gray@2x.png'

const useStyles = makeStyles((theme) => {
	return {
		root: {
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
const SessionInfoPopover = ({ open, onClose, sessionInfo }) => {
	const classes = useStyles();
	const presenceList = useSelector((state) => state?.presenceList) || [];
	const fullNameByIdMap = useSelector( state => state?.fullNameByIdMap ) || {};

	const [usePresenceExt, setPresenceExt] = useState('');
	const muteDataObj = useSelector((state) => state?.muteDataObj) || {}
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
							{fullNameByIdMap[to] || to}
							{
								muteDataObj[to] ? <img style={{ width: "16px", marginLeft: '2px' }} src={grayMuteIcon} alt="" /> : null
							}
						</Typography>
						<Typography className={classes.idText}>
							AgoraID:{to}
						</Typography>
					</Box>
				</Box>
			</Popover>
		</>
	);
};
export default SessionInfoPopover;
