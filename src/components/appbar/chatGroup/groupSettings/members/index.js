
import React, { useState, useEffect,memo } from 'react'
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Box, Tabs, Tab } from '@material-ui/core';
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
            fontWeight: 'Semibold (600)',
            typeface: 'Ping Fang SC',
            textTransform: ' none',
            maxWidth: '100%',
            minWidth: '0',
            padding: '0'
        },
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

	return (
		<Box className={classes.root}>
			<Tabs
				variant="fullWidth"
				value={value}
				onChange={handleChange}
				aria-label="Vertical tabs example"
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
			<TabPanel value={value} index={0} className={classes.gUserBox}>
				<MembersList newMuteList={newMuteList} />
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
