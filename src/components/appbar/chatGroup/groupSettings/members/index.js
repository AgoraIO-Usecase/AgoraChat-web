
import React, { useState, useEffect,memo } from 'react'
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Box, Tabs, Tab, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TabPanel, a11yProps } from '../../../../common/tabs'
import store from '../../../../../redux/store';
import WebIM from '../../../../../utils/WebIM'
import MembersList from './membersList'
import AdminList from './adminList'
import MuteList from './muteList'
import BlockList from './blockList'
import AllowList from './allowList'
import { getGroupBlock } from "../../../../../api/groupChat/groupBlock";
import rearchIcon from "../../../../../assets/search@2x.png";

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            padding: '0'
        },
        gUserBox: {
            height: '585px',
            overflowY: 'scroll',
            overflowX: 'hidden',
        },
        menus: {
            color: '#000000',
            fontSize: '16px',
            fontWeight: '600',
            fontFamily: 'Roboto',
            textTransform: ' none',
            maxWidth: '70px',
            minWidth: '0',
            padding: '0',
						margin: '0 8px',
        },
				tabsBox: {
					width: '100%',
					background: '#F6F7F8',
					'& .MuiTabs-fixed .MuiTabs-indicator': {
						background: '#114EFF',
						height: '3px',
						display: 'inline-block',
						borderRadius: '5px',
					},
					'& .MuiTabs-flexContainer': {
						justifyContent: 'space-between',
						alignItems: 'center',
					}
				},
				imgStyle: {
					width: "30px",
					height: '30px',
					cursor: "pointer",
				},
				textStyle: {
					fontFamily: 'Roboto',
					fontWeight: "400",
					fontSize: "16px",
					color: "#000000",
					width: "100%",
					padding: "10px",
					height: '48px',
				},
				inputBoxAndTab: {
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					background: '#F6F7F8',
					padding: '10px 10px 0px 5px',
				}
    })
});

const Members = () => {
	const classes = useStyles();
	const state = useSelector((state) => state);
	const groupsInfo = state?.groups?.groupsInfo || {};
	const groupAdmins = state?.groups?.groupAdmins || [];
	const groupMuteList = state?.groups?.groupMuteList || [];
	const loginUser = WebIM.conn.context?.userId;
	const isAdmins =
		loginUser === groupsInfo?.owner || groupAdmins.includes(loginUser);
	const [newMuteList, setNewMuteList] = useState([]);
	const [value, setValue] = useState(0);
	const [showInput, setShowInput] = useState(false)
	const [inputVal, setInputVal] = useState('')

	const handleChange = (event, newValue) => {
		if (newValue === 3) {
			let gid = store.getState()?.groups?.groupsInfo?.id;
			getGroupBlock(gid);
		}
		setValue(newValue);
	};

	useEffect(() => {
		if (groupMuteList) {
			let aryMute = [];
			groupMuteList.length > 0 &&
				groupMuteList.forEach((item, key) => {
					aryMute.push(item.user);
				});
			setNewMuteList(aryMute);
		}
	}, [groupMuteList.length]);
	const searchChangeValue = (e) => {
		const value = e.target.value
		setInputVal(value)
	}

	return (
		<Box className={classes.root}>
			<div className={classes.inputBoxAndTab}>
				{
					!showInput ?
					<Tabs
						variant="fullWidth"
						value={value}
						onChange={handleChange}
						aria-label="Vertical tabs example"
						className={classes.tabsBox}
					>
						<Tab
							label={i18next.t("All")}
							{...a11yProps(0)}
							className={classes.menus}
						/>
						<Tab
							label={i18next.t("Admin")}
							{...a11yProps(1)}
							className={classes.menus}
						/>
						{isAdmins && (
							<Tab
								label={i18next.t("Muted")}
								{...a11yProps(2)}
								className={classes.menus}
							/>
						)}
						{isAdmins && (
							<Tab
								label={i18next.t("Blocked")}
								{...a11yProps(3)}
								className={classes.menus}
							/>
						)}
						{isAdmins && (
							<Tab
								label={i18next.t("Allowed")}
								{...a11yProps(4)}
								className={classes.menus}
							/>
						)}
					</Tabs>
					: <InputBase
						type="search"
						placeholder={i18next.t("Member Name")}
						className={classes.textStyle}
						onChange={searchChangeValue}
					/>
				}
				{
					!showInput ?
					<img
						src={rearchIcon}
						alt=""
						className={classes.imgStyle}
						onClick={() => {
								setShowInput(true)
								setValue(0)
							}
						}
					/>
					: <span className={classes.cancelBtn} onClick={() => {
						setShowInput(false)
						setInputVal('')
					}
					}>Cancel</span>
				}
			</div>
			<TabPanel value={value} index={0} className={classes.gUserBox}>
				<MembersList newMuteList={newMuteList} inputVal={inputVal} />
			</TabPanel>
			<TabPanel value={value} index={1} className={classes.gUserBox}>
				<AdminList />
			</TabPanel>
			<TabPanel value={value} index={2} className={classes.gUserBox}>
				<MuteList
					newMuteList={newMuteList}
					className={classes.gUserBox}
				/>
			</TabPanel>
			<TabPanel value={value} index={3} className={classes.gUserBox}>
				<BlockList />
			</TabPanel>
			<TabPanel value={value} index={4} className={classes.gUserBox}>
				<AllowList />
			</TabPanel>
		</Box>
	);
};
export default memo(Members);
