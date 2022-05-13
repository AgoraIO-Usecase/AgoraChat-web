import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Popover, List, ListItem, Typography } from "@material-ui/core";
import i18next from "i18next";

import {
	transferOwner,
	closeGroup,
} from "../../../../../api/groupChat/closeGroup";
import store from "../../../../../redux/store";
import {downloadFile,deleteFile} from '../../../../../api/groupChat/getGroupInfo'
import downloadIcon from "../../../../../assets/download@2x.png";
import deleteIcon from "../../../../../assets/red@2x.png";


const useStyles = makeStyles((theme) => ({
	root:{
		width: "240px"
	},
	itemStyle: {
		borderRadius: "16px",
	},
	iconStyle: {
		width: "30px",
		height: "30px",
	},
	transferStyle: {
		fontFamily: "Ping Fang SC",
		fontWeight: "500",
		fontSize: "14px",
	},
	leaveStyle: {
		fontFamily: "Ping Fang SC",
		fontWeight: "500",
		fontSize: "14px",
		color: "#FF14CC",
	},
}));

const Menu = ({ open, onClose, fileId }) => {
	const classes = useStyles();
	const state = store.getState();
	const groupId = state?.groups?.groupsInfo.id;

	return (
		<Popover
			open={Boolean(open)}
			anchorEl={open}
			onClose={onClose}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "bottom",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center",
			}}
		>
			<List
				component="nav"
				aria-label="main mailbox folders"
				className={classes.root}
			>
				<ListItem
					button
					className={classes.itemStyle}
					onClick={() => {
						downloadFile(groupId, fileId);
					}}
				>
					<img
						src={downloadIcon}
						alt=""
						className={classes.iconStyle}
					/>
					<Typography className={classes.transferStyle}>
						{i18next.t("Download")}
					</Typography>
				</ListItem>
				<ListItem
					button
					className={classes.itemStyle}
					onClick={() => {
						deleteFile(groupId, fileId);
					}}
				>
					<img
						src={deleteIcon}
						alt=""
						className={classes.iconStyle}
					/>
					<Typography className={classes.leaveStyle}>
						{i18next.t("Delete")}
					</Typography>
				</ListItem>
			</List>
		</Popover>
	);
};

export default memo(Menu);
