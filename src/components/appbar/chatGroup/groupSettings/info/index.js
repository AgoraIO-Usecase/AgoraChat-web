import React, { useState, memo, createRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, InputBase, Typography } from "@material-ui/core";
import i18next from "i18next";
import store from "../../../../../redux/store";
import WebIM from '../../../../../utils/WebIM'
import { modifyGroupInfo } from "../../../../../api/groupChat/getGroupInfo";
import { message } from "../../../../common/alert";

const useStyles = makeStyles((theme) => {
	return {
		titleBox: {
			background: "#F6F7F8",
			opacity: "100%",
			height: "60px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "0 24px 0 18px !important",
			// borderRadius: "12px",
		},
		titleStyle: {
			fontFamily: "Roboto",
			fontWeight: "600",
			fontSize: "16px",
			color: "#000000",
		},
		infoBox: {
			marginTop: "20px",
			borderRadius: "16px",
			background: "#F4F5F7",
			margin: '16px 8px',
    	padding: '8px !important',
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
			fontFamily: "Roboto",
			fontWeight: "600",
			fontSize: "16px",
			color: "#0D0D0D",
		},
		nameEditStatusStyle: {
			position: "absolute",
			top: "20px",
			right: "30px",
			fontFamily: "Roboto",
			fontWeight: "600",
			fontSize: "14px",
			color: "#005FFF",
			cursor: "pointer",
		},
		descEditStatusStyle: {
			position: "absolute",
			right: "30px",
			fontFamily: "Roboto",
			fontWeight: "600",
			fontSize: "14px",
			color: "#005FFF",
			cursor: "pointer",
		},
		nameContentBox: {
			width: "60%",
			margin: "15px 6px",
			'& .Mui-disabled': {
				color: '#000',
			}
		},
		nameContentStyle: {
			fontFamily: "Roboto",
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
			'& ::-webkit-scrollbar': {
        display: 'none', /* Chrome Safari */
      },
      scrollbarWidth: 'none', /* firefox */
      '-ms-overflow-style': 'none', /* IE 10+ */
		},
		contentBox: {
			height: "60px",
			width: "61%",
			marginBottom: "50px",
			overflowY: "scroll",
			'& .Mui-disabled': {
				color: '#000',
			},
			'& ::-webkit-scrollbar': {
        display: 'none', /* Chrome Safari */
      },
      scrollbarWidth: 'none', /* firefox */
      '-ms-overflow-style': 'none', /* IE 10+ */
		},
		contentStyle: {
			fontFamily: "Roboto",
			fontWeight: "400",
			fontSize: "14px",
			color: "#000000",
			lineHeight: "20px",
		},
		descriptionEditStyle: {
			position: "absolute",
			bottom: "10px",
			right: "15px",
			fontFamily: "Roboto",
			fontWeight: "400",
			fontSize: "14px",
			color: "#005FFF",
			cursor: "pointer",
		},
		inputTextAreaBox: {
			'& ::-webkit-scrollbar': {
        display: 'none', /* Chrome Safari */
      },
      scrollbarWidth: 'none', /* firefox */
      '-ms-overflow-style': 'none', /* IE 10+ */
		}
	};
});

const GroupChatInfo = () => {
	const classes = useStyles();
	const [nameEditStatus, setNameEditStatus] = useState(true)
	const [nameValue, setNameValue] = useState("")
	const [descEditStatus, setDescEditStatus] = useState(true);
	const [descValue, setDescValue] = useState("");
	let state = store.getState();
	let groupName = state.groups.groupsInfo?.name || "";
	let groupDescription = state.groups.groupsInfo?.description || "";
	let owner = state.groups.groupsInfo?.owner;
	let admin = state.groups.groupAdmins;
	let currentLoginUser = WebIM.conn.context.userId;
	let isPermissions =
		owner === currentLoginUser || admin.includes(currentLoginUser);
	useEffect(() => {
		if (groupDescription) {
			setDescValue(groupDescription);
		}
		if (groupName) {
			setNameValue(groupName)
		}
	}, [groupName, groupDescription])
	const handleNameChange = (e) => {
		let value = e.target.value;
		if (value.length === 0 || value.length > 20) {
			message.error(`${i18next.t("Group name is empty or exceeds the limit")}`);
			return;
		} 
		setNameValue(value)
	}

	const handleDescChange = (e) => {
		setDescValue(e.target.value);
	}

	const handleModifyGroupInfo = () => {
		modifyGroupInfo(nameValue, descValue, handleClose);
	}

	const handleClose = () => {
		setNameEditStatus(true)
		setDescEditStatus(true);
	}
	const inputEl = createRef()
	const inputTextarea = createRef()
	useEffect(() => {
		inputEl.current && inputEl.current.focus()
		inputTextarea.current && inputTextarea.current.focus()
	}, [nameEditStatus, descEditStatus])

	const rendernameEditStatus = () => {
		return <>
			{nameEditStatus ? (
				<Typography
					className={classes.nameEditStatusStyle}
					onClick={() => setNameEditStatus(false)}
				>
					{i18next.t("Edit")}
				</Typography>
			) : (
				<Typography
					className={classes.nameEditStatusStyle}
					onClick={() => {
						handleModifyGroupInfo();
					}}
				>
					{i18next.t("Done")}
				</Typography>
			)}
		</>
	}

	const renderdescEditStatus = () => {
		return (
			<>
				{descEditStatus ? (
					<Typography
						className={classes.descEditStatusStyle}
						onClick={() => {
							setDescEditStatus(false);
							setTimeout(() => {
								inputTextarea.current && inputTextarea.current.focus()
							}, 300)
						}}
					>
						{i18next.t("Edit")}
					</Typography>
				) : (
					<Typography
						className={classes.descEditStatusStyle}
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
							inputRef={inputEl}
							type="text"
							max={20}
							value={nameValue}
							disabled={nameEditStatus}
							onChange={handleNameChange}
						/>
						{isPermissions && rendernameEditStatus()}
					</Box>
				</Box>
				<Box className={classes.noticeBox}>
					<Typography className={classes.nameStyle}>
						{i18next.t("Group Description")}
					</Typography>
					<Box className={classes.contentBox}>
						<InputBase
							inputRef={inputTextarea}
							type="text"
							multiline={true}
							max={20}
							rows={3}
							value={descValue}
							disabled={descEditStatus}
							style={{
								height: "60px",
								width:"100%",
								overflowX: "hidden",
								overflowY: "scroll",
							}}
							className={classes.inputTextAreaBox}
							onChange={handleDescChange}
						/>
						{isPermissions && renderdescEditStatus()}
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default memo(GroupChatInfo);
