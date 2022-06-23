import React, { useState, memo, useEffect } from "react";
import { useSelector } from 'react-redux'
import { makeStyles } from "@material-ui/core/styles";
import { Box, InputBase, Typography, Avatar } from "@material-ui/core";
import i18next from "i18next";
import store from "../../../../../redux/store";
import WebIM from "../../../../../utils/WebIM";
import { updateGroupNotice } from "../../../../../api/groupChat/getGroupInfo";
import { message } from '../../../../common/alert'
import avatarDefault from '../../../../../assets/avatar_default.jpg'
import { userAvatar } from '../../../../../utils'

const useStyles = makeStyles((theme) => {
	return {
		root: {
			// height:"100%",
			// width:"100%",
			padding: "0",
		},
		titleBox: {
			background: "#F6F7F8",
			opacity: "100%",
			height: "60px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "0 24px 0 20px !important",
			position: "relative",
			// borderRadius: "12px",
		},
		titleStyle: {
			fontFamily: "Ping Fang SC",
			fontWeight: "600",
			fontSize: "16px",
			color: "#000000",
		},
		editStyle: {
			position: "absolute",
			top: "20px",
			right: "20px",
			fontFamily: "Ping Fang SC",
			fontWeight: "600",
			fontSize: "14px",
			color: "#005FFF",
			cursor: "pointer",
		},
		noticeBox: {
			height: "120px",
			background: "#F4F5F7",
			borderBottomLeftRadius: '16px',
			borderBottomRightRadius: '16px',
			padding: '8px !important',
			boxSizing: 'border-box',
		},
		inputStyle: {
			width: "100%",
			overflowX: "hidden",
			overflowY: "scroll",
			padding: "10px",
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
		noStyle: {
			height: "584px",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			background: "#EDEFF2",
		},
		adminBox: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			background: "#F4F5F7",
			height: '54px',
			borderTopLeftRadius: '16px',
			borderTopRightRadius: '16px',
			padding: '8px !important',
			boxSizing: 'border-box',
			borderBottom: '1px solid #E6E6E6',
		},
		nameImgBox: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		avatarBox: {
			width: '40px',
			height: '40px',
			borderRadius: '50%',
			background: 'rgb(236, 164, 153)',
		},
		avatarImg: {
			width: '40px',
			height: '40px',
			borderRadius: '50%',
		},
		nameBox: {
			color: '#000',
			fontFamily: 'Roboto',
			fontSize: '16px',
			fontWeight: '600',
			marginLeft: '10px',
		},
		timeBox: {
			color: "#CCCCCC",
			fontFamily: 'Roboto',
			fontWeight: '600',
		},
		outBigBox: {
			margin: '20px 10px',
		}
	};
});

const GroupNotice = () => {
	const classes = useStyles();
	const state = useSelector((state) => state);
	const contentMaxLength = 300;
	let groupNotices = state.groups.groupNotices;
	let groupId = state.groups.groupsInfo?.id;
	let owner = state.groups.groupsInfo?.owner;
	let admin = state.groups.groupAdmins;
	let currentLoginUser = WebIM.conn.context.userId;
	let isPermissions =
		owner === currentLoginUser || admin.includes(currentLoginUser);
	let isGroupNotice = groupNotices.length > 0;

	const [editStatus, setEditStatus] = useState(true);
	const [disabledStatus, setDisabledStatus] = useState(true);
	const [noticeContent, setnoticeContent] = useState("");

	useEffect(() => {
		if (groupNotices) {
			setnoticeContent(groupNotices)
		}
	}, [groupNotices])
	const handleEdit = () => {
		setEditStatus(false);
		setDisabledStatus(false);
		setnoticeContent(groupNotices);
	};

	const handleSetNoitce = () => {
		updateGroupNotice(groupId, noticeContent);
		setEditStatus(true);
		setDisabledStatus(true);
	};

	const handleNoticeChange = (e) => {
		let value = e.target.value;
		if (value.length > contentMaxLength) {
			message.error(`${i18next.t("Content exceeded the limit")}`);
			return
		}
		setnoticeContent(value);
		
	};

	const renderNameEdit = () => {
		return (
			<>
				{editStatus ? (
					<Typography
						className={classes.editStyle}
						onClick={handleEdit}
					>
						{i18next.t("Edit")}
					</Typography>
				) : (
					<Typography
						className={classes.editStyle}
						onClick={handleSetNoitce}
					>
						{i18next.t("Done")}
					</Typography>
				)}
			</>
		);
	};
	const renderTime = (time) => {
		time = time ? new Date(time).toString() : new Date().toString()
		const timeList = time.split(' ')
		return `${timeList[1]}, ${timeList[2]} ${timeList[4].substr(0, 5)}`
	}
	return (
		<Box className={classes.root}>
			<Box className={classes.titleBox}>
				<Typography className={classes.titleStyle}>
					{i18next.t("Group Notice")}
				</Typography>
				<Typography>{isPermissions && renderNameEdit()}</Typography>
			</Box>
			<Box>
				{isGroupNotice || !disabledStatus ? (
					<Box className={classes.outBigBox}>
						<Box className={classes.adminBox}>
							<Box className={classes.nameImgBox}>
								<Box className={classes.avatarBox}>
									<Avatar src={userAvatar(currentLoginUser)} />
								</Box>
								<span className={classes.nameBox}>{currentLoginUser}</span>
							</Box>
							<Box className={classes.timeBox}>{renderTime()}</Box>
						</Box>
						<Box className={classes.noticeBox}>
							<InputBase
								type="text"
								multiline={true}
								rows={3}
								value={noticeContent}
								disabled={disabledStatus}
								className={classes.inputStyle}
								onChange={handleNoticeChange}
							/>
							<Box className={classes.numberBox}>
								<Typography className={classes.numberStyle}>
									{noticeContent.length}/{contentMaxLength}
								</Typography>
							</Box>
						</Box>
					</Box>
				) : (
					<Box className={classes.noStyle}>{i18next.t("No Set")}</Box>
				)}
			</Box>
		</Box>
	);
};

export default memo(GroupNotice);
