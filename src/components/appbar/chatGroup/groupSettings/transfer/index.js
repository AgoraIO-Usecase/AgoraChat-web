import React, { useState, useEffect, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	InputBase,
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Avatar
} from "@material-ui/core";
import i18next from "i18next";
import store from "../../../../../redux/store";
import Menu from "./menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import searchIcon from "../../../../../assets/search@2x.png";
import { userAvatar } from '../../../../../utils'

const useStyles = makeStyles((theme) => ({
	transBox: {
		height: "60px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		// borderRadius: "12px",
		padding: "0 24px 0 38px !important",
		background: "#F6F7F8",
	},
	searchBox: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		height: "30px",
		padding: "0 !important",
	},
	titleStyle: {
		fontFamily: "Ping Fang SC",
		fontWeight: "600",
		fontSize: "16px",
		color: "#000000",
	},
	root: {
		borderRadius: "16px",
		border: "1px solid #FFFFFF",
		padding: "0 8px",
		marginRight: "4px",
	},
	itemStyle: {
		display: "flex",
		justifyCcontent: "space-between",
		alignItems: "center",
	},
	searchIcon: {
		height: "32px",
		width: "32px",
		cursor: "pointer",
	},
	iconStyle: {
		height: "24px",
		width: "24px",
		borderRadius: "60%",
		"&:hover": {
			background: "#FFFFFF",
		},
	},
	cancelStyle: {
		fontFamily: "Ping Fang SC",
		fontWeight: "600",
		fontSize: "16px",
		lineHeight: "16px",
		color: "#005FFF",
		cursor: "pointer",
	},
	listStyle: {
		// background: "#F6F7F8",
		marginTop: "20px",
		borderRadius: "16px",
		height: "550px",
		overflowX: "hidden",
		overflowY: "scroll",
		'& .MuiListItem-gutters': {
			paddingLeft: '16px',
		},
		'& .MuiListItem-button:hover': {
			background: 'rgb(244, 245, 247)',
		}
	},
	mytransferMenu: {
		'& .MuiPopover-paper': {
			borderRadius: '12px',
		}
	},
	gMemberAvatar: {
		width: "36px",
		height: "36px",
		borderRadius: "20px",
		backgroundColor: "rgb(238, 171, 159)",
	},
	ListItemTextName: {
		marginLeft: '10px'
	},
	memberStyle: {
		color: '#999',
		'& .MuiTypography-body1': {
			fontSize: '14px',
		}
	}
}));

const TransFerOwner = ({ onClose }) => {
	const classes = useStyles();
	const [newMembers, setNewMembers] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [clickUser, setClickUser] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [searchMembers, setSearchMembers] = useState([]);

	const state = store.getState();
	const groupMembers = state?.groups?.groupsInfo.affiliations;
	let membersLength = newMembers.length > 0;
	let searchMembersLength = searchMembers.length > 0;
	useEffect(() => {
		console.log(groupMembers, 'groupMembers')
		let membersAry = [];
		groupMembers.length > 0 &&
			groupMembers.forEach((item) => {
				if (item.owner) return;
				membersAry.push(item.member);
			});
		setNewMembers(membersAry);
	}, [groupMembers]);

	const handleMenu = (e, item) => {
		setAnchorEl(e.currentTarget);
		setClickUser(item);
	};

	const handleClose = () => {
		setAnchorEl(null);
		onClose();
	};

	const handleSearch = () => {
		setShowSearch(true);
	};

	const handleClosrSearch = () => {
		setShowSearch(false);
		setSearchMembers([]);
	};

	const handleChengeValue = (e) => {
		let searchValue = e.target.value;
		setSearchMembers(newMembers.filter((v) => v.includes(searchValue)));
	};

	return (
		<Box>
			<Box className={classes.transBox}>
				<Typography className={classes.titleStyle}>
					{i18next.t("Transfer Ownership")}
				</Typography>
				<Box className={classes.searchBox}>
					{showSearch && (
						<Box className={classes.searchBox}>
							<InputBase
								type="search"
								placeholder={i18next.t("Member ID")}
								className={classes.root}
								onChange={handleChengeValue}
							/>
							<Typography
								onClick={handleClosrSearch}
								className={classes.cancelStyle}
							>
								{i18next.t("Cancel")}
							</Typography>
						</Box>
					)}
					{!showSearch && (
						<img
							src={searchIcon}
							alt=""
							className={classes.searchIcon}
							onClick={handleSearch}
						/>
					)}
				</Box>
			</Box>
			<List
				component="nav"
				aria-label="main mailbox folders"
				className={classes.listStyle}
			>
				{membersLength &&
					(searchMembersLength ? searchMembers : newMembers).map(
						(item, i) => {
							return (
								<ListItem
									button
									style={{ borderRadius: "16px" }}
									key={i}
								>
									<Box
										className={
											classes.gMemberAvatar
										}
									>
										<Avatar src={userAvatar(item)} />
									</Box>
									<ListItemText className={classes.ListItemTextName}>{item}</ListItemText>
									<Box className={classes.itemStyle}>
										<ListItemText className={classes.memberStyle}>Member</ListItemText>
										<Box
											className={classes.iconStyle}
											onClick={(e) => handleMenu(e, item)}
										>
											<MoreVertIcon />{" "}
										</Box>
									</Box>
								</ListItem>
							);
						}
					)}
			</List>
			<Menu open={anchorEl} onClose={handleClose} userId={clickUser} className={classes.mytransferMenu} />
		</Box>
	);
};

export default memo(TransFerOwner);
