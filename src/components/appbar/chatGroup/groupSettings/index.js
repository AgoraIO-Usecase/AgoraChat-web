import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CommonDialog from "../../../common/dialog";
import i18next, { use } from "i18next";
import {
	Box,Tabs,Tab,Button,Popover
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import WebIM from "../../../../utils/WebIM";
import { TabPanel, a11yProps } from "../../../common/tabs";

import Members from "./members";
import AddMembers from "./addMembers";
import GroupNotice from './notice'
// import GroupFiles from "./files";
import GroupChatInfo from "./info";
import TransFerOwner from "./transfer";
import Notifications from './members/notifications'
import ConfirmDialog from '../../../common/confirmDialog'

import groupAvatar from "../../../../assets/groupAvatar.png";
import membersIcon from "../../../../assets/members@2x.png";
import addMembersIcon from "../../../../assets/addcontact@2x.png";
import noticeIcon from "../../../../assets/notice@2x.png";
import filesIcon from "../../../../assets/files@2x.png";
import editIcon from "../../../../assets/edit@2x.png";
import allowSearchIcon from "../../../../assets/allow_search@2x.png";
import transferIcon from "../../../../assets/transfer@2x.png";
import deleteIcon from "../../../../assets/red@2x.png";
import muteIcon from '../../../../assets/unmute.png'
import muteGrayIcon from '../../../../assets/gray@2x.png'
import { setTimeVSNowTime } from '../../../../utils/notification'
import { getSilentModeForConversation } from '../../../../api/notificationPush'

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => {
	return {
		root: {
			width: "880px",
			height: "680px",
			display: "flex",
			overflow: "hidden",
		},
		gSettingleft: {
			width: "35%",
		},
		gInfoBox: {
			height: "30%",
			textAlign: "center",
			marginTop: "15px",
		},
		gAvatar: {
			height: "100px",
			width: "100px",
		},
		gNameText: {
			typeface: "Ping Fang SC",
			fontweight: "Semibold(600)",
			fontSize: "20px",
			character: "0",
			color: "#0D0D0D",
			width:"100%",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		gAppIdText: {
			typeface: "Ping Fang SC",
			fontWeight: "Regular(400)",
			fontSize: "12px",
			character: "0",
			lineHeight: "20(1.667)",
			color: "#999999",
		},
		gDescriptionText: {
			typeface: "Ping Fang SC",
			fontWeight: "Regular(400)",
			fontSize: "12px",
			character: "0",
			lineHeight: "16(1.333)",
			color: "#000000",
		},
		menus: {
			color: "#000000",
			fontSize: "14px",
			fontWeight: "500",
			typeface: "Ping Fang SC",
			textTransform: " none",
			maxWidth: "100%",
			display: "inherit",
			justifyContent: "flex-start",
		},
		content: {
			background: "#EDEFF2",
			width: "100%",
			height: "100%",
			'& .MuiBox-root': {
				padding: '0'
			}
		},
		gSettingRight: {
			width: "65%",
			height: "100%",
		},
		gButton: {
			width: "100%",
			textTransform: "none",
		},
		gCloseText: {
			typeface: "Ping Fang SC",
			fontWeight: "500",
			fontSize: "14px",
			character: "0",
			color: "#FF14CC",
			textTransform: "none",
		},
		itemBox: {
			width: "100%",
			maxWidth: "none",
		},
		membersBox: {
			width: "100%",
			cursor: "pointer",
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "flex-start",
			maxWidth: "none",
		},
		iconStyle: {
			height: "30px",
			width: "30px",
		},
		deleteGroupBox:{
			padding:"6px 12px"
		},
		muteImgstyle: {
			width: '12.86px',
			height: '12.86px',
		},
		selfGroupSetPopover: {

		},
		groupSetTabsBox: {
			'& .MuiTabs-indicator': {
				background: 'transparent',
			},
		},
		popoverTitleBox: {
			height: '34px',
			padding: '16px',
			margin: '0',
			borderBottom: '2px solid rgb(229, 230, 230)',
		},
		closeButton: {
			position: 'absolute',
			right: '8px',
			top: '8px',
			color: '#9e9e9e',
		},
	}
})

const GroupSettingsDialog = ({ open, onClose, currentGroupId, authorEl }) => {
	const classes = useStyles();
	const state = useSelector((state) => state);
	const [confirmStatus, setConfirmStatus] = useState(null)
	const groupsInfo = state?.groups?.groupsInfo || {};
	const groupNotice = state?.groups?.groupNotice;
	const loginUser = WebIM.conn.context?.userId;
	const isOwner = loginUser === groupsInfo?.owner;
	const groupId = groupsInfo?.id
	const groupName = groupsInfo?.name
	const [value, setValue] = useState(0);
	const [muteFlag, setmuteFlag] = useState(false);
	const [secondSure, setSecondSure] = useState(false)
	const [GroupStatus, setGroupStatus] = useState('')
	const [groupContent, setgroupContent] = useState('')
	const [btnWord, setBtnWord] = useState('')

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const showMuteImgOrNot = (flag) => {
		setmuteFlag(flag)
	}

	const handleConfirmDialogChange = (val) => {
		setBtnWord(val)
		setConfirmStatus(true)
		onClose()
	}

	const handleConfirmDialogClose = () => {
		setConfirmStatus(null)
	}
	const renderSetting = () => {
		const memberLabel = () => {
			return (
				<Button className={classes.membersBox}>
					<img
						src={membersIcon}
						alt="members"
						className={classes.iconStyle}
					/>
					<Typography className={classes.menus}>
						{i18next.t("Members")}
						<span style={{color: '#ccc',marginLeft: '5px'}}>({groupsInfo.affiliations_count})</span>
					</Typography>
				</Button>
			);
		};
		const addMembersLabel = () => {
			return (
				<Button className={classes.membersBox}>
					<img
						src={addMembersIcon}
						alt="addMembers"
						className={classes.iconStyle}
					></img>
					<Typography className={classes.menus}>
						{i18next.t("Add Members")}
					</Typography>
				</Button>
			);
		};
		const groupNoticeLabel = () => {
			return (
				<Button className={classes.membersBox}>
					<img
						src={noticeIcon}
						alt="notice"
						className={classes.iconStyle}
					></img>
					<Typography className={classes.menus}>
						{i18next.t("Group Notice")}
					</Typography>
				</Button>
			);
		};
		const notificationsLabel = () => {
			return (
				<Button className={classes.membersBox}>
					<img
						src={muteIcon}
						alt="files"
						className={classes.iconStyle}
					></img>
					<Typography className={classes.menus}>
						{i18next.t("Notifications")}
					</Typography>
				</Button>
			);
		};
		const groupFileLabel = () => {
			return (
				<Button className={classes.membersBox}>
					<img
						src={filesIcon}
						alt="files"
						className={classes.iconStyle}
					></img>
					<Typography className={classes.menus}>
						Group File
					</Typography>
				</Button>
			);
		};
		// const groupFileLabel = () => {
		// 	return (
		// 		<Button className={classes.membersBox}>
		// 			<img
		// 				src={filesIcon}
		// 				alt="files"
		// 				className={classes.iconStyle}
		// 			></img>
		// 			<Typography className={classes.menus}>
		// 				Group File
		// 			</Typography>
		// 		</Button>
		// 	);
		// };
		const groupInfoLabel = () => {
			return (
				<Button className={classes.membersBox}>
					<img
						src={editIcon}
						alt="addMembers"
						className={classes.iconStyle}
					></img>
					<Typography className={classes.menus}>
						{i18next.t("Group Chat Info")}
					</Typography>
				</Button>
			);
		};
		const transFerLabel = () => {
			return (
				<Button className={classes.membersBox}>
					<img
						src={transferIcon}
						alt="addMembers"
						className={classes.iconStyle}
					></img>
					<Typography className={classes.menus}>
						{i18next.t("Transfer Ownership")}
					</Typography>
				</Button>
			);
		};
		return (
      <Box className={classes.root}>
				<Box className={classes.gSettingleft}>
					<Box className={classes.gInfoBox}>
						<img
							src={groupAvatar}
							alt=""
							className={classes.gAvatar}
						/>
						<Typography className={classes.gNameText}>
							{groupsInfo?.name}
							{
								muteFlag ? <img alt="" className={classes.muteImgstyle} src={muteGrayIcon} /> : null
							}
						</Typography>
						<Typography className={classes.gAppIdText}>
							GroupID:{groupsInfo?.id}{" "}
						</Typography>
						<Typography className={classes.gDescriptionText}>
							{groupNotice}
						</Typography>
					</Box>
					<Tabs
						orientation="vertical"
						variant="scrollable"
						value={value}
						onChange={handleChange}
						aria-label="Vertical tabs example"
						style={{ maxWidth: "none", borderColor: 'transparent' }}
						className={classes.groupSetTabsBox}
					>
						<Tab
							label={memberLabel()}
							{...a11yProps(0)}
							className={classes.itemBox}
						/>
						<Tab
							label={addMembersLabel()}
							{...a11yProps(1)}
							className={classes.itemBox}
						/>
						<Tab
							label={groupNoticeLabel()}
							{...a11yProps(2)}
							className={classes.itemBox}
						/>
            {/* <Tab
							label={groupFileLabel()}
							{...a11yProps(3)}
							className={classes.itemBox}
						/> */}
            <Tab
							label={notificationsLabel()}
							{...a11yProps(3)}
							className={classes.itemBox}
						/>
						<Tab
							label={groupInfoLabel()}
							{...a11yProps(4)}
							className={classes.itemBox}
						/>
						{isOwner ? (
              <Tab
                label={transFerLabel()}
                {...a11yProps(5)}
                className={classes.itemBox}
              />
            ) : null}
          </Tabs>
					<Box className={classes.deleteGroupBox}>
						<Button className={classes.membersBox}>
							<img
								src={deleteIcon}
								alt="delete"
								className={classes.iconStyle}
							></img>
							{isOwner ? (
								<Typography
									className={classes.gCloseText}
									onClick={() => handleConfirmDialogChange('Disband')}
								>
									{i18next.t("Disband this Group")}
								</Typography>
							) : (
								<Typography
									className={classes.gCloseText}
									onClick={() => handleConfirmDialogChange('Leave')}
								>
									{i18next.t("Leave the Group")}
								</Typography>
							)}
						</Button>
					</Box>
				</Box>
				<Box className={classes.gSettingRight}>
					<TabPanel
						value={value}
						index={0}
						className={classes.content}
					>
						<Members />
					</TabPanel>
					<TabPanel
						value={value}
						index={1}
						className={classes.content}
					>
						<AddMembers onClose={onClose}/>
					</TabPanel>
					<TabPanel
						value={value}
						index={2}
						className={classes.content}
					>
						<GroupNotice />
					</TabPanel>
          {/* <TabPanel
						value={value}
						index={3}
						className={classes.content}
					>
						<GroupFiles onClose={onClose} />
					</TabPanel> */}
          <TabPanel
						value={value}
						index={3}
						className={classes.content}
					>
						<Notifications showMuteImgOrNot={showMuteImgOrNot} groupId={groupId} useScene="groupChat" useComponent="Group" />
					</TabPanel>
					<TabPanel
						value={value}
						index={4}
						className={classes.content}
					>
						<GroupChatInfo />
					</TabPanel>
					<TabPanel
						value={value}
						index={5}
						className={classes.content}
					>
						<TransFerOwner onClose={onClose} />
					</TabPanel>

				</Box>
				<ConfirmDialog 
					anchorEl={confirmStatus}
					onClose={handleConfirmDialogClose}
					type={"group"}
					btnWord={btnWord}
				/>
			</Box>
		);
	};

	return (
		authorEl ?
			<Popover
				open={Boolean(authorEl)}
				anchorEl={authorEl}
				onClose={onClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				className={classes.selfGroupSetPopover}
			>
				<div className={classes.popoverTitleBox}>
					<Typography variant="h6">{i18next.t("Group Settings")}</Typography>
					<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</div>
				{renderSetting()}
			</Popover>
		:	<CommonDialog
				open={Boolean(open)}
				onClose={onClose}
				title={i18next.t("Group Settings")}
				content={renderSetting()}
				maxWidth={880}
			></CommonDialog>
	);
};

export default GroupSettingsDialog;
