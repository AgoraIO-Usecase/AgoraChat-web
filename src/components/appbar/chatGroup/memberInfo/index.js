import React from 'react';
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Popover, Box, Avatar, Button, Tooltip } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { EaseApp } from "chat-uikit";
import { EaseApp } from "luleiyu-agora-chat";
import { addContact } from "../../../../api/contactsChat/getContacts";
import avatarImg from '../../../../assets/avatar1.png'
import newChatIcon from '../../../../assets/newchat@2x.png'
import addContactIcon from '../../../../assets/addcontact@2x.png'

import offlineImg from '../../../../assets/Offline.png'
import onlineIcon from '../../../../assets/Online.png'
import busyIcon from '../../../../assets/Busy.png'
import donotdisturbIcon from '../../../../assets/Do_not_Disturb.png'
import customIcon from '../../../../assets/custom.png'
import leaveIcon from '../../../../assets/leave.png'

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            height: '280px',
            width: '340px',
            background: '#FFFFFF'
        },
        infoBox: {
            textAlign: 'center',
						position: 'relative',
        },
        avatarImg: {
            width: '100px',
            height: '100px',
            margin: '25px auto'
        },
        nameText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Semibold(600)',
            fontSize: '20px',
            character: '0',
            color: '#0D0D0D'
        },
        idText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Regular(400)',
            fontSize: '12px',
            character: '0',
            LineHeight: '20(1.667)',
            color: '#999999'
        },
        infoBtn: {
            width: '100%',
            textTransform: 'none',
            marginTop: '15px',
            display: 'flex',
            justifyContent: 'flex-start'
        },
        infoBtnText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Medium(500)',
            marginLeft: '8px',
            fontSize: '14px',
            character: '0',
            color: '#000000'
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
					width: '30px',
					height: '30px',
					borderRadius: '50%',
				}
    })
});


const GroupMemberInfoPopover = ({ open, onClose, memberInfo, presenceList }) => {
	const classes = useStyles();
	const state = useSelector((state) => state);
	const constacts = state?.constacts || [];
	let { from } = memberInfo

	const handleClickChat = (userId) => {
		// uikit
		let conversationItem = {
			conversationType: "singleChat",
			conversationId: from,
			ext: presenceList[0].ext
		};
		EaseApp.addConversationItem(conversationItem);
		onClose();
	};
	const statusImgObj = {
		'Offline': offlineImg,
		'Online': onlineIcon,
		'Busy': busyIcon,
		'Do not Disturb': donotdisturbIcon,
		'Leave': leaveIcon,
		'': onlineIcon
	}
	return (
		<Popover
			open={Boolean(open)}
			anchorEl={open}
			onClose={onClose}
			anchorOrigin={{
				vertical: "center",
				horizontal: "right",
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
					<Tooltip title={presenceList[0]?.ext} placement="bottom-end">
						<div className={classes.imgBox}>
							<img alt="" src={statusImgObj[presenceList[0]?.ext] || customIcon} className={classes.imgStyle} />
						</div>
					</Tooltip>
					<Typography className={classes.nameText}>{from}</Typography>
					<Typography className={classes.idText}>
						AgoraID:{from}
					</Typography>
				</Box>
				{constacts.includes(from) ? (
					<Button
						className={classes.infoBtn}
						onClick={() => handleClickChat(from)}
					>
						<img
							src={newChatIcon}
							alt="chat"
							style={{ width: "30px" }}
						/>
						<Typography className={classes.infoBtnText}>
							{i18next.t("Chat")}
						</Typography>
					</Button>
				) : (
					<Button
						className={classes.infoBtn}
						onClick={() => {
							addContact(from, "hi");
						}}
					>
						<img
							src={addContactIcon}
							alt="new chat"
							style={{ width: "30px" }}
						/>
						<Typography className={classes.infoBtnText}>
							{i18next.t("Add Contact")}
						</Typography>
					</Button>
				)}
			</Box>
		</Popover>
	);
};

export default GroupMemberInfoPopover;