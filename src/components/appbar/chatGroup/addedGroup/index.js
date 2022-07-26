
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box, InputBase, List, ListItem, Button, Avatar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { EaseApp } from "agora-chat-uikit";
import store from '../../../../redux/store'
import { searchAddedGroupAction, searchLoadAction } from '../../../../redux/actions'
import GroupSettingsDialog from '../groupSettings'
import getGroupInfo from '../../../../api/groupChat/getGroupInfo'
import getGroups from '../../../../api/groupChat/getGroups'
import Loading from '../../../common/loading'
import search_icon from '../../../../assets/search.png'
import groupAvatar_icon from '../../../../assets/groupAvatar.png'

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            height: '100%',
            width: '100%'
        },
        inputBox: {
            display: 'flex',
            alignItems: 'center',
            background: '#F4F5F7',
            borderRadius: '23px',
            height: '36px',
            lineHeight: '36px',
        },
        inputSearch: {
            width: '100%',
            height: '22px',
            fontSize: '16px',
            lineHeight: '22px',
            cursor: 'pointer',
            padding: '6px 5px 7px'
        },
        searchImg: {
            width: '18px',
            height: '18px',
            paddingLeft: '8px'
        },
        gItem: {
            height: '590px',
            overflowY: 'scroll',
            overflowX: 'hidden',
        },
        gInfoBox: {
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
        },
        gAvatar: {
            width: '50px',
            height: '50px',
            borderRadius: 'inherit',
            // backgroundColor: '#FF9F4D',
        },
        gName: {
            // borderRadius: '16px',
            margin: '0 10px',
            width: '100%',
            textAlign: 'left',
            textTransform: 'none',
            fontSize: '16px',
            display: 'inherit',
            borderRadius: '8px',
        },
        gNameText: {
            typeface: 'Ping Fang SC',
            fontWeight: 'Semibold (600)',
            fontSize: '16px',
            character: '0',
            color: '#0D0D0D',
            height: '48px',
            lineHeight: '48px',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-wrap',
            width: '400px'
        }
    })
});

const AddedGroups = ({ onClose }) => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const groupList = state?.groups?.groupList || [];
    const isSearching = state?.isSearching || false
    const [showGroupSettings, setshowGroupSettings] = useState(false)
    const [currentGroupId, setCurrentGroupId] = useState('')

    const [renderGroups, setRenderGroups] = useState([...groupList])
    const muteDataObj = useSelector((state) => state?.muteDataObj) || {}
    useEffect(() => {
        setRenderGroups(groupList)
    }, [groupList])

    // click group avatar
    const handleGroupInfo = (groupid) => {
        getGroupInfo(groupid)
        setshowGroupSettings(true)
        setCurrentGroupId(groupid)
    }

    const handleCloseGroupInfo = () => {
        setshowGroupSettings(null);
        onClose();
    }

    const handleSearchValue = (e) => {
        if (!(e.target.value)) {
            // getGroups()
            // store.dispatch(searchLoadAction(true))
            setRenderGroups(groupList)
        } else {
            let reRenderGroups = groupList.filter((item) => {
                return item.groupname.includes(e.target.value)
            });
            setRenderGroups(reRenderGroups)
            // store.dispatch(searchAddedGroupAction(e.target.value))
        }
    }

    // click group name
    const handleClickSession = (itemData) => {
        // uikit
        let conversationItem = {
            conversationType: "groupChat",
            conversationId: itemData,
            ext: {
                muteFlag: muteDataObj[itemData]
            }
        };
        EaseApp.addConversationItem(conversationItem);
        onClose();
    }


    return (
        <>
            <Box className={classes.root}>
                <Box className={classes.inputBox}>
                    <img
                        src={search_icon}
                        alt=""
                        className={classes.searchImg}
                    />
                    <InputBase
                        type="search"
                        placeholder="Search"
                        className={classes.inputSearch}
                        onChange={handleSearchValue}
                    />
                </Box>
                <Loading show={isSearching} />
                <List className={classes.gItem}>
                    {renderGroups.length > 0 &&
                        renderGroups.map((item, key) => {
                            return (
                                <ListItem
                                    className={classes.gInfoBox}
                                    key={key}
                                >
                                    {/* <Box  onClick={() => handleGroupInfo(item.groupid)}></Box> */}
                                    <Avatar
                                        className={classes.gAvatar}
                                        src={groupAvatar_icon}
                                        onClick={() =>
                                            handleGroupInfo(item.groupid)
                                        }
                                    ></Avatar>

                                    <Box
                                        style={{ flex: "1" }}
                                        onClick={() => {
                                            handleClickSession(item.groupid);
                                        }}
                                    >
                                        <Button className={classes.gName}>
                                            <Typography
                                                className={classes.gNameText}
                                            >
                                                {item.groupname}
                                            </Typography>
                                        </Button>
                                    </Box>
                                </ListItem>
                            );
                        })}
                </List>
            </Box>
            <GroupSettingsDialog
                open={showGroupSettings}
                onClose={handleCloseGroupInfo}
                currentGroupId={currentGroupId}
            ></GroupSettingsDialog>
        </>
    );
}

export default AddedGroups;