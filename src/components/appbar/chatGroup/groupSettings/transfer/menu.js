import React, { memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Popover, List, ListItem, Typography } from "@material-ui/core";
import i18next from "i18next";

import {
	transferOwner,
	closeGroup,
} from "../../../../../api/groupChat/closeGroup";
import store from '../../../../../redux/store'
import transferIcon from "../../../../../assets/transfer@2x.png";
import leaveIcon from "../../../../../assets/leave@2x.png";

const useStyles = makeStyles((theme) => ({
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

const Menu = ({ open, onClose,userId }) => {
	const classes = useStyles();
	const state = store.getState();
	const groupId = state?.groups?.groupsInfo.id;

	const handleTransFer = () => {
		transferOwner(groupId, userId, onClose);
	}

	const handleTransFerLeave = () => {
		transferOwner(groupId, userId, onClose, 'quit')
	}

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
			<List component="nav" aria-label="main mailbox folders">
				<ListItem
					button
					className={classes.itemStyle}
					onClick={handleTransFer}
				>
					<img
						src={transferIcon}
						alt=""
						className={classes.iconStyle}
					/>
					<Typography className={classes.transferStyle}>
						{i18next.t("Transfer")}
					</Typography>
				</ListItem>
				<ListItem
					button
					className={classes.itemStyle}
					onClick={handleTransFerLeave}
				>
					<img src={leaveIcon} alt="" className={classes.iconStyle} />
					<Typography className={classes.leaveStyle}>
						{i18next.t("Transfer and Leave")}
					</Typography>
				</ListItem>
			</List>
		</Popover>
	);
};

export default memo(Menu);
