import React, { useState, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, InputBase, Typography } from "@material-ui/core";
import i18next from "i18next";
import store from "../../../../../redux/store";
import WebIM from '../../../../../utils/WebIM'
import { modifyGroupInfo } from "../../../../../api/groupChat/getGroupInfo";

const useStyles = makeStyles((theme) => {
	return {
		titleBox: {
			background: "#F6F7F8",
			opacity: "100%",
			height: "60px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "0 15px",
		},
		titleStyle: {
			fontFamily: "Ping Fang SC",
			fontWeight: "600",
			fontSize: "16px",
			color: "#000000",
		},
		infoBox: {
			marginTop: "20px",
			borderRadius: "16px",
			background: "#F4F5F7",
		},
		nameBox: {
			height: "60px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "0 15px",
			borderBottom: "1px solid #E6E6E6",
			position: "relative",
		},
		nameStyle: {
			fontFamily: "Ping Fang SC",
			fontWeight: "600",
			fontSize: "16px",
			color: "#0D0D0D",
		},
		nameEditStyle: {
			position: "absolute",
			top: "20px",
			right: "30px",
			fontFamily: "Ping Fang SC",
			fontWeight: "400",
			fontSize: "14px",
			color: "#005FFF",
			cursor: "pointer",
		},
		descEditStyle: {
			position: "absolute",
			right: "30px",
			fontFamily: "Ping Fang SC",
			fontWeight: "400",
			fontSize: "14px",
			color: "#005FFF",
			cursor: "pointer",
		},
		nameContentBox: {
			width: "60%",
			margin: "15px 6px",
		},
		nameContentStyle: {
			fontFamily: "Ping Fang SC",
			fontWeight: "400",
			fontSize: "16px",
			color: "#000000",
		},
		noticeBox: {
			display: "flex",
			justifyContent: "space-between",
			padding: "0 15px",
			marginTop: "15px",
			position: "relative",
		},
		contentBox: {
			height: "60px",
			width: "61%",
			marginBottom: "50px",
			overflowY: "scroll",
		},
		contentStyle: {
			fontFamily: "Ping Fang SC",
			fontWeight: "400",
			fontSize: "14px",
			color: "#000000",
			lineHeight: "20px",
		},
		descriptionEditStyle: {
			position: "absolute",
			bottom: "10px",
			right: "15px",
			fontFamily: "Ping Fang SC",
			fontWeight: "400",
			fontSize: "14px",
			color: "#005FFF",
			cursor: "pointer",
		},
	};
});

const GroupChatInfo = () => {
	const classes = useStyles();
	const [nameEdit, setNameEdit] = useState(true)
	const [nameValue, setNameValue] = useState("")
	const [descEdit, setDescEdit] = useState(true);
	const [descValue, setDescValue] = useState("");
	let state = store.getState();
	let groupName = state.groups.groupsInfo?.name || "";
	let groupDescription = state.groups.groupsInfo?.description || "";
	let owner = state.groups.groupsInfo?.owner;
	let admin = state.groups.groupAdmins;
	let currentLoginUser = WebIM.conn.context.userId;
	let isPermissions =
		owner === currentLoginUser || admin.includes(currentLoginUser);

	const handleNameChange = (e) => {
		setNameValue(e.target.value)
	}

	const handleDescChange = (e) => {
		setDescValue(e.target.valu);
	}

	const handleModifyGroupInfo = () => {
		modifyGroupInfo(nameValue, descValue, handleClose);
	}

	const handleClose = () => {
		setNameEdit(true)
		setDescEdit(true);
	}

	const renderNameEdit = () => {
		return <>
			{nameEdit ? (
				<Typography
					className={classes.nameEditStyle}
					onClick={() => {
						setNameEdit(false);
					}}
				>
					{i18next.t("Edit")}
				</Typography>
			) : (
				<Typography
					className={classes.nameEditStyle}
					onClick={() => {
						handleModifyGroupInfo();
					}}
				>
					{i18next.t("Done")}
				</Typography>
			)}
		</>
	}

	const renderDescEdit = () => {
		return (
			<>
				{descEdit ? (
					<Typography
						className={classes.descEditStyle}
						onClick={() => {
							setDescEdit(false);
						}}
					>
						{i18next.t("Edit")}
					</Typography>
				) : (
					<Typography
						className={classes.descEditStyle}
						onClick={() => {
							handleModifyGroupInfo();
						}}
					>
						{i18next.t("Done")}
					</Typography>
				)}
			</>
		);
	};

	return (
		<Box>
			<Box className={classes.titleBox}>
				<Typography className={classes.titleStyle}>
					{i18next.t("Group Chat Info")}
				</Typography>
			</Box>
			<Box className={classes.infoBox}>
				<Box className={classes.nameBox}>
					<Typography className={classes.nameStyle}>
						{i18next.t("GroupName")}
					</Typography>
					<Box className={classes.nameContentBox}>
						<InputBase
							type="text"
							max={20}
							defaultValue={groupName}
							disabled={nameEdit}
							onChange={handleNameChange}
						/>
						{isPermissions && renderNameEdit()}
					</Box>
				</Box>
				<Box className={classes.noticeBox}>
					<Typography className={classes.nameStyle}>
						{i18next.t("Group Description")}
					</Typography>
					<Box className={classes.contentBox}>
						<InputBase
							type="text"
							multiline={true}
							max={20}
							rows={3}
							defaultValue={groupDescription}
							disabled={descEdit}
							style={{
								height: "60px",
								overflowX: "hidden",
								overflowY: "scroll",
							}}
							onChange={handleDescChange}
						/>
						{isPermissions && renderDescEdit()}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default memo(GroupChatInfo);
