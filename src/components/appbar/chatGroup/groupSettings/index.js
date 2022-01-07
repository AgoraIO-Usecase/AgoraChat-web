
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import CommonDialog from '../../../common/dialog'
import i18next from "i18next";
import { Box, Tabs, Tab, List, ListItem, ListItemText, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import WebIM from '../../../../utils/WebIM'
import { TabPanel, a11yProps } from '../../../common/tabs'
import GroupInfo from './groupInfo'
import { closeGroup } from '../../../../api/groupChat/closeGroup'
import groupAvatar from '../../../../assets/groupAvatar.png'

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            width: '880px',
            height: '680px',
            display: 'flex',
            overflow: 'hidden'
        },
        gSettingleft: {
            width: '35%'
        },
        gInfoBox: {
            height: '30%',
            textAlign: 'center',
            marginTop: '15px'
        },
        gAvatar: {
            height: '100px',
            width: '100px'
        },
        gNameText: {
            typeface: 'Ping Fang SC',
            fontweight: 'Semibold(600)',
            fontSize: '20px',
            character: '0',
            color: '#0D0D0D'
        },
        gAppIdText: {
            typeface: 'Ping Fang SC',
            fontWeight: 'Regular(400)',
            fontSize: '12px',
            character: '0',
            lineHeight: '20(1.667)',
            color: '#999999'
        },
        gDescriptionText: {
            typeface: 'Ping Fang SC',
            fontWeight: 'Regular(400)',
            fontSize: '12px',
            character: '0',
            lineHeight: '16(1.333)',
            color: '#000000'
        },
        menus: {
            color: '#000000',
            fontSize: '14px',
            fontWeight: 'Medium(500)',
            typeface: 'Ping Fang SC',
            textTransform: ' none',
            maxWidth: '100%',
            minWidth: '0'
        },
        content: {
            background: '#EDEFF2',
            width: '100%',
            height: '100%',
        },
        gSettingRight: {
            width: '65%',
            height: '100%'
        },
        gButton: {
            width: '100%',
            textTransform: 'none'
        },
        gCloseText: {
            typeface: 'Ping Fang SC',
            fontWeight: 'Medium(500)',
            fontSize: '14px',
            character: '0',
            color: '#FF14CC'
        }
    })
});


const GroupSettingsDialog = ({ open, onClose, currentGroupId }) => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const groupsInfo = state?.groups?.groupsInfo || {};
    const groupNotice = state?.groups?.groupNotice
    const loginUser = WebIM.conn.context?.userId
    const isOwner = loginUser === groupsInfo?.owner;
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const renderSetting = () => {
        return (
            <Box className={classes.root}>
                <Box className={classes.gSettingleft}>
                    <Box className={classes.gInfoBox}>
                        <img src={groupAvatar} alt="" className={classes.gAvatar} />
                        <Typography className={classes.gNameText}>{groupsInfo?.name}</Typography>
                        <Typography className={classes.gAppIdText}>GroupID:{groupsInfo?.id} </Typography>
                        <Typography className={classes.gDescriptionText}>{groupNotice}</Typography>
                    </Box>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                    >
                        <Tab label="Members" {...a11yProps(0)} className={classes.menus} />
                        {/* <Tab label="Add Members" {...a11yProps(1)} className={classes.menus}/>
                        <Tab label="Group Notice" {...a11yProps(2)} className={classes.menus}/>
                        <Tab label="Group File" {...a11yProps(3)} className={classes.menus}/>
                        <Tab label="Group Chat Info" {...a11yProps(4)} className={classes.menus}/> */}
                    </Tabs>
                    <List>
                        <ListItem>
                            <Button className={classes.gButton}>
                                {isOwner ? <ListItemText primary={i18next.t('Delete the group')} className={classes.gCloseText} onClick={() => closeGroup(currentGroupId, 'dissolve', onClose)} /> :
                                    <ListItemText primary={i18next.t('leave the group')} className={classes.gCloseText} onClick={() => closeGroup(currentGroupId, 'quit', onClose)} />}
                            </Button>
                        </ListItem>
                    </List>

                </Box>
                <Box className={classes.gSettingRight}>
                    <TabPanel value={value} index={0} className={classes.content}>
                        <GroupInfo />
                    </TabPanel>
                    {/* <TabPanel value={value} index={1} className={classes.content}>
                        Add Members
                    </TabPanel>
                    <TabPanel value={value} index={2} className={classes.content}>
                        Group Notice
                    </TabPanel>
                    <TabPanel value={value} index={3} className={classes.content}>
                        Group File
                    </TabPanel>
                    <TabPanel value={value} index={4} className={classes.content}>
                        Group Chat Info
                    </TabPanel> */}
                </Box>
            </Box>
        )
    }


    return (
        <CommonDialog
            open={open}
            onClose={onClose}
            title={i18next.t('Group Settings')}
            content={renderSetting()}
            maxWidth={880}
        ></CommonDialog>
    )
}

export default GroupSettingsDialog;