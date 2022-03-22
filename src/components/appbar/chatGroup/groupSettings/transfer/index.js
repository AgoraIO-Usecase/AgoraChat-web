import React, { useState, useEffect, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	InputBase,
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
} from "@material-ui/core";
import i18next from "i18next";
import store from "../../../../../redux/store";
import Menu from "./menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import searchIcon from "../../../../../assets/search@2x.png";

const useStyles = makeStyles((theme) => ({
	transBox: {
		height: "60px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		borderRadius: "12px",
		padding: "0 15px",
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
		background: "#F6F7F8",
		marginTop: "20px",
		borderRadius: "16px",
		height: "550px",
		overflowX: "hidden",
		overflowY: "scroll",
	},
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
					{i18next.t("TransFerOwner")}
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
									<ListItemText>{item}</ListItemText>
									<Box className={classes.itemStyle}>
										<ListItemText>Role</ListItemText>
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
			<Menu open={anchorEl} onClose={handleClose} userId={clickUser} />
		</Box>
	);
};

export default memo(TransFerOwner);
