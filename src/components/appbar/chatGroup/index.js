
import React, { useState, useEffect } from 'react'
import CommonDialog from '../../common/dialog'
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Box, Tabs, Tab, Popover } from '@material-ui/core';
import { TabPanel, a11yProps } from '../../common/tabs'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddedGroups from './addedGroup'
import CreateGroup from './createGroup'
import JoinGroup from './joinGroup'
import PublicGroup from './publicGroups'
import addedGroupIcon from '../../../assets/groupchat@2x.png'
import newGroupIcon from '../../../assets/new_group@2x.png'
import joinGroupIcon from '../../../assets/join_a_group@2x.png'
import publicGroupsIcon from '../../../assets/public_group@2x.png'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            display: 'flex',
            width: '880px',
            height: '680px',
            overflow: 'hidden'
        },
        tabs: {
            background: '#FFFFFF',
            width: '45%',
            padding: '8px',
            '& .MuiTab-textColorInherit.Mui-selected': {
                background: 'rgb(235, 237, 241)',
                borderRadius: '8px',
            },
            '& .MuiTabs-indicator': {
				background: 'transparent',
			},
        },
        menusBox: {
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-start', 
            width: '100%',
            cursor:'pointer',
        },
        menus: {
            color: '#000000',
            fontSize: '14px',
            fontWeight: '500',
            typeface: 'Ping Fang SC',
            textTransform: 'none',
            character:'0',
            borderRadius: '8px',
        },
        content: {
            background: '#EDEFF2',
            width: '100%',
            height: '100%',
            '& .MuiBox-root': {
                paddingBottom: '0px'
            },
            '& ::-webkit-scrollbar': {
                display: 'none', /* Chrome Safari */
            },
            scrollbarWidth: 'none', /* firefox */
            '-ms-overflow-style': 'none', /* IE 10+ */
        },

		popoverTitleBox: {
			height: '34px',
			padding: '16px',
			margin: '0',
			borderBottom: '2px solid rgb(229, 230, 230)',
		},
		closeButton: {
			position: 'absolute',
			right: '8px',
			top: '8px',
			color: '#9e9e9e',
		},
        selfGroupChatPopover: {
            '& .MuiPopover-paper': {
                top: '10px !important',
            }
        }
    })
});

const ChatGroupDialog = ({ open, onClose, authorEl }) => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const groupList = state?.groups?.groupList || [];
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [groupCount, setGroupCount] = useState(0)
    useEffect(() => {
        setGroupCount(groupList.length)
    }, [groupList.length])


    const AddedGroupsMenu = () => {
        return (
            <Box className={classes.menusBox}>
                <img src={addedGroupIcon} alt='new chat' style={{ width: '30px' }} />
                <Typography  style={{ marginLeft: '8px' }}>{`${i18next.t('Added Groups')}(${groupCount})`}</Typography>
            </Box> 
        )
    }
    const NewGroupMenu = () => {
        return (
            <Box className={classes.menusBox}>
                <img src={newGroupIcon} alt='new chat' style={{ width: '30px' }} />
                <Typography  style={{marginLeft:'8px'}}>{i18next.t('New Group')}</Typography>
            </Box>
        )
    }
    const JoinGroupMenu = () => {
        return (
            <Box className={classes.menusBox}>
                <img src={joinGroupIcon} alt='new chat' style={{ width: '30px' }} />
                <Typography  style={{ marginLeft: '8px' }}>{i18next.t('Join a Group')}</Typography>
            </Box>
        )
    }
    const PublicGroupMenu = () => {
        return (
            <Box className={classes.menusBox}>
                <img src={publicGroupsIcon} alt='new chat' style={{ width: '30px' }} />
                <Typography  style={{ marginLeft: '8px' }}>{i18next.t('Public Group')}</Typography>
            </Box>
        )
    }

    const renderGroupContent = () => {
        return (
            <Box className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label={<AddedGroupsMenu />} {...a11yProps(0)} className={classes.menus}/>
                    <Tab label={<NewGroupMenu />} {...a11yProps(1)} className={classes.menus} />
                    <Tab label={<JoinGroupMenu />} {...a11yProps(2)} className={classes.menus} />
                    <Tab label={<PublicGroupMenu />} {...a11yProps(3)} className={classes.menus} />

                </Tabs>
                <TabPanel value={value} index={0} className={classes.content}>
                    <AddedGroups onClose={onClose}/>
                </TabPanel>
                <TabPanel value={value} index={1} className={classes.content}>
                    <CreateGroup onClose={onClose} />
                </TabPanel>
                <TabPanel value={value} index={2} className={classes.content}>
                    <JoinGroup />
                </TabPanel>
                <TabPanel value={value} index={3} className={classes.content}>
                    <PublicGroup />
                </TabPanel>
            </Box>
        )
    }

    return (
        authorEl ?
        <Popover
            open={Boolean(open)}
            anchorEl={authorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            className={classes.selfGroupChatPopover}
        >
            <div className={classes.popoverTitleBox}>
                <Typography variant="h6">{i18next.t("Group Chat")}</Typography>
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            {renderGroupContent()}
        </Popover>
        :
        <CommonDialog
            open={open}
            onClose={onClose}
            title={i18next.t('Group Chat')}
            content={renderGroupContent()}
            maxWidth={880}
        ></CommonDialog>
    )
}

export default ChatGroupDialog;