import React, { useState, useEffect } from "react";
import i18next from "i18next";
import store from "../../../../../redux/store";
import { EaseApp } from "chat-uikit";
import {
	Box,
	Checkbox,
	List,
	ListItem,
	InputBase,
	Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import getContacts from "../../../../../api/contactsChat/getContacts";
import { inviteUsersToGroup } from "../../../../../api/groupChat/inviteUsers";
import {
	searchContactsAction,
	searchLoadAction,
} from "../../../../../redux/actions";
import { message } from "../../../../common/alert";

import Loading from "../../../../common/loading";
import rearchIcon from "../../../../../assets/search@2x.png";
import doneActiveIcon from "../../../../../assets/create@2x.png";
import doneDisabledIcon from "../../../../../assets/go@2x.png";
import deldeteIcon from "../../../../../assets/delete@2x.png";

const useStyles = makeStyles((theme) => {
	return {
		root: {
			height: "630px",
		},
		gUserBox: {
			width: "100%",
			height: "100%",
			display: "flex",
		},
		searchBox: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			height: "30px",
			padding: "0 important",
		},
		contactsItem: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			height: "50px",
		},
		gMemberAvatar: {
			width: "36px",
			height: "36px",
			borderRadius: "20px",
			backgroundColor: "#FF9F4D",
		},
		memberBox: {
			width: "50%",
			background: "#EDEFF2",
			padding: "10px",
		},
		textStyle: {
			fontTypeface: "Ping Fang SC",
			fontWeight: "Regular (400)",
			fontSize: "12px",
			lineHeight: "16 (1.333)",
			color: "#000000",
			width: "100%",
			padding: "5px",
		},
		imgStyle: {
			width: "20px",
			cursor: "pointer",
		},
		itemBox: {
			display: "flex",
			alignItems: "center",
		},
		marginStyle: {
			marginLeft: "10px",
		},
		doneBox: {
			display: "flex",
			alignItems: "center",
			position: "absolute",
			right: "20px",
			bottom: "20px",
			cursor: "pointer",
			color: (props) => (props.isActiveBtn ? "#005FFF" : ""),
		},
		doneStyle: {
			textTransform: "none",
		},
		iconStyle: {
			width: "20px",
			height: "20px",
		},
	};
});

const AddMembers = ({ onClose }) => {
	const [searchValue, setSearchValue] = useState("");
	const [groupMembers, setGroupMembers] = useState([]);
	const [contactsObjs, setContactsObjs] = useState([]);
	const [groupMembersObjs, setGroupMembersObjs] = useState([]);
	const isActiveBtn = groupMembers.length > 0;
	const classes = useStyles({
		isActiveBtn: isActiveBtn,
	});
	const state = store.getState();
	const contacts = state?.constacts;
	const isSearching = state?.isSearching || false;
	const groupId = state?.groups?.groupsInfo?.id;
	const members = state?.groups?.groupsInfo?.affiliations || [];

	useEffect(() => {
		let groupMembersObjs = [];
		members.length > 0 && members.map((item) => {
			if (item.owner) {
				return;
			} else {
				return groupMembersObjs.push(item.member);
			}
		});
		setGroupMembersObjs(groupMembersObjs);
	}, [members]);

	useEffect(() => {
		let contactsObjs = contacts.map((value) => {
			return { id: value, checked: false };
		});
		setContactsObjs(contactsObjs);
	}, [contacts]);

	// search value
	const searchChangeValue = (e) => {
		if (!e.target.value) {
			getContacts();
			store.dispatch(searchLoadAction(true));
		} else {
			setSearchValue(e.target.value);
		}
	};

	// click search
	const handleSearchValue = () => {
		if (searchValue === "") return;
		store.dispatch(searchContactsAction(searchValue));
	};

	// click group
	const handleClickSession = () => {
		// uikit
		// TODO insert an invitation message
		let conversationItem = {
			conversationType: "groupChat",
			conversationId: groupId,
		};
		EaseApp.addConversationItem(conversationItem);
		onClose();
	};

	const handleSelect = (val) => (e) => {
		if (groupMembersObjs.includes(val)) return;
		if (e.target.checked) {
			groupMembers.push(val);
			setGroupMembers([...groupMembers]);
			contactsObjs.forEach((value) => {
				if (value.id === val) {
					value.checked = true;
				}
			});
			setContactsObjs([...contactsObjs]);
		} else if (!e.target.checked) {
			let newGroupMembers = _.pull(groupMembers, val);
			setGroupMembers([...newGroupMembers]);
			contactsObjs.forEach((value) => {
				if (value.id === val) {
					value.checked = false;
				}
			});
			setContactsObjs([...contactsObjs]);
		}
	};

	const deleteGroupMember = (val) => () => {
		let newGroupAry = _.pull(groupMembers, val);
		setGroupMembers(newGroupAry);
		contactsObjs.forEach((value) => {
			if (value.id === val) {
				value.checked = false;
			}
		});
		setContactsObjs([...contactsObjs]);
	};

	const handleCreateGroup = () => {
		inviteUsersToGroup(groupId, groupMembers, onClose);
		handleClickSession();
	};
	let throttled = _.throttle(handleCreateGroup, 3000, { trailing: false });

	return (
		<Box className={classes.root}>
			<Box className={classes.gUserBox}>
				<Box
					style={{
						width: "50%",
						background: "#F5F7FA",
						padding: "10px",
					}}
				>
					<Box className={classes.searchBox}>
						<InputBase
							type="search"
							placeholder={i18next.t("Your Contacts")}
							className={classes.textStyle}
							onChange={searchChangeValue}
						/>
						<img
							src={rearchIcon}
							alt=""
							className={classes.imgStyle}
							onClick={handleSearchValue}
						/>
					</Box>
					<Loading show={isSearching} />
					<List>
						{contactsObjs.length > 0 &&
							contactsObjs.map((item, key) => {
								return (
									<ListItem
										key={key}
										onClick={handleSelect(item.id)}
										className={classes.contactsItem}
									>
										<Box className={classes.itemBox}>
											<Box
												className={
													classes.gMemberAvatar
												}
											></Box>
											<Typography
												className={classes.marginStyle}
											>
												{item.id}
											</Typography>
										</Box>
										{/* <Checkbox checked={item.checked} /> */}
										{groupMembersObjs.includes(item.id) ? (
											<Checkbox checked disabled />
										) : (
											<Checkbox checked={item.checked} />
										)}
									</ListItem>
								);
							})}
					</List>
				</Box>
				<Box className={classes.memberBox}>
					<Typography className={classes.textStyle}>{`${i18next.t(
						"Selected"
					)}(${groupMembers.length})`}</Typography>
					<List>
						{groupMembers.length > 0 &&
							groupMembers.map((item, key) => {
								return (
									<ListItem
										key={key}
										className={classes.contactsItem}
									>
										<Box className={classes.itemBox}>
											<Box
												className={
													classes.gMemberAvatar
												}
											></Box>
											<Typography
												className={classes.marginStyle}
											>
												{item}
											</Typography>
										</Box>
										<img
											src={deldeteIcon}
											alt=""
											className={classes.imgStyle}
											onClick={deleteGroupMember(item)}
										/>
									</ListItem>
								);
							})}
					</List>
				</Box>
			</Box>
			<Button
				className={classes.doneBox}
				onClick={throttled}
				disabled={isActiveBtn ? false : true}
			>
				<Typography className={classes.doneStyle}>
					{i18next.t("Done")}
				</Typography>
				<img
					src={isActiveBtn ? doneActiveIcon : doneDisabledIcon}
					alt=""
					className={classes.iconStyle}
				/>
			</Button>
		</Box>
	);
};
export default AddMembers;
