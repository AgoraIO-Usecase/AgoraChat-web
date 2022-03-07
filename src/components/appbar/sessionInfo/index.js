import React from "react";
import i18next from "i18next";
import { Popover, Box, Avatar, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
	addFromBlackList,
	deleteContact,
} from "../../../api/contactsChat/getContacts";
import avatarImg from "../../../assets/avatar1.png";
import blockIcon from "../../../assets/block@2x.png";
import deleteIcon from "../../../assets/red@2x.png";

const useStyles = makeStyles((theme) => {
	return {
		root: {
			height: "280px",
			width: "340px",
			background: "#FFFFFF",
		},
		infoBox: {
			textAlign: "center",
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
		},
	};
});

const SessionInfoPopover = ({ open, onClose, sessionInfo }) => {
	const classes = useStyles();
	let { to } = sessionInfo;
	return (
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
					<Typography className={classes.nameText}>{to}</Typography>
					<Typography className={classes.idText}>
						AgoraID:{to}
					</Typography>
				</Box>
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
	);
};

export default SessionInfoPopover;
