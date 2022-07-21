import React, { useState, useEffect } from 'react'
import './index.css'

import { Menu, MenuItem, Typography, Avatar } from '@material-ui/core';
import AddFriendDialog from './addFriend'
import ChatGroupDialog from './chatGroup'
import SettingsDialog from './settings'
import ContactDialog from './contactList'
import RequestDialog from './request'

import newChatIcon from '../../assets/newchat@2x.png'
import groupChatIcon from '../../assets/groupchat@2x.png'
import addContactIcon from '../../assets/addcontact@2x.png'
import requestsIcon from '../../assets/requests@2x.png'
import settingsIcon from '../../assets/settings@2x.png'
import logoutIcon from '../../assets/logout@2x.png'

import avater1 from '../../assets/avatar1.jpg'
import avater2 from '../../assets/avatar2.jpg'
import avater3 from '../../assets/avatar3.jpg'
import avater4 from '../../assets/avatar4.jpg'
import avater5 from '../../assets/avatar5.jpg'
import avater6 from '../../assets/avatar6.jpg'
import avater7 from '../../assets/avatar7.jpg'
import AgoraChat from '../../assets/AgoraChat@2x.png'
import menuIcon from '../../assets/menu@2x.png'
import store from '../../redux/store'
import { setMyUserInfo, closeGroupChatAction } from '../../redux/actions'
import { logout } from '../../api/loginChat'
import getGroups from '../../api/groupChat/getGroups'
import SecondConfirmDialog from "../common/secondConfirmDialog"

// import UserInfoPopover from './userInfo'
import PresenceStatus from './presence/index'
import { useSelector } from "react-redux";
import { getLocalStorageData } from '../../utils/notification'
import { acceptGroupRequest } from '../../api/groupChat/groupRequest'

const AVATARS = [avater1, avater2, avater3, avater4, avater5, avater6, avater7]
export default function Header() {
    const [addEl, setAddEl] = useState(null)
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [showUserSetting, setShowUserSetting] = useState(false)
    const [showContact, setShowContact] = useState(false)
    const [showRequest, setShowRequest] = useState(false)
    const [secondSure, setSecondSure] = useState(false)
    const [groupAuthor, setGroupAuthor] = useState(null)
    // userInfo
    // const [showUserInfoPopover, setShowUserInfoPopover] = useState(false)
    // const [userInfoaddEl, setUserInfoAddEl] = useState(null)
    const [unDealRequestsNum, setUnDealRequestsNum] = useState(0)
    // let state = store.getState()
    const state = useSelector(state => state)
    let myUserInfo = state?.myUserInfo
    let requests = state?.requests || {}
    let showChatGroup = state?.isShowGroupChat
    // let unDealRequestsNum = countNum(requests.group) + countNum(requests.contact)

    useEffect(() => {
        if (getLocalStorageData().groupRequestSwitch && requests?.group.length) {
            requests.group.forEach(item => {
                acceptGroupRequest(item.name, item.groupId)
            })
        }
        let unDealRequestsNum = countNum(requests.group) + countNum(requests.contact)
        setUnDealRequestsNum(unDealRequestsNum)
    }, [requests])

    function countNum(arr) {
        if (!Array.isArray(arr)) return 0
        return arr.reduce((prev, curr) => {

            console.log(prev, curr)
            if (curr.status === 'pending') {
                prev++
                return prev
            }
            return prev
        }, 0)
    }
    let avatarUrl = null
    if (myUserInfo && myUserInfo.avatarIndex !== null) {
        avatarUrl = AVATARS[myUserInfo.avatarIndex]
    }
    useEffect(() => {
        let avatarIndex = localStorage.getItem('avatarIndex_1.0')
        if (avatarIndex !== undefined) {
            store.dispatch(setMyUserInfo({
                ...myUserInfo,
                avatarIndex: avatarIndex
            }))
        }
    }, [])

    const handleClickMore = (e) => {
        setAddEl(e.currentTarget);
        getGroups();
    }

    const handleNewChatDialog = () => {
        setShowContact(true)
        setAddEl(null)
    }


    function handleAddFriendDialogClose() {
        setShowAddFriend(false)
        setAddEl(null)
    }

    function addFriend() {
        setShowAddFriend(true)
        setAddEl(null)
    }

    function handleRequestsDialog() {
        setShowRequest(true)
        setAddEl(null)
    }

    function handlleSettingDialog(params) {
        setShowUserSetting(true)
        setAddEl(null)
    }

    function createGroupDialog(e) {
        store.dispatch(closeGroupChatAction(true));
        setAddEl(null);
        setGroupAuthor(e.currentTarget)
    }
    function handleCreateGroupDialogClose() {
        store.dispatch(closeGroupChatAction(false));
    }

    // const handleUserInfo = (e) => {
    //     setUserInfoAddEl(e.currentTarget)
    //     setShowUserInfoPopover(true);
    // }
    // const handleUserInfoClose = () => {
    //     setShowUserInfoPopover(false);
    // }
    const confirmLogout = () => {
        setSecondSure(true)
    }
    const confirmQuitGroup = () => {
		logout()
		setSecondSure(false)
        setAddEl(null)
	}
    return (
        <>
            <div className='chatlist-header'>
                {/* <div className='chatlist-header-avatar'></div> */}
                <Avatar style={{ width: 40, height: 40 }} src={avatarUrl} ></Avatar>
                <PresenceStatus style={{position: 'absolute', bottom: '2px', left: '35px'}} />
                <div className='chatlist-header-title'>
                    <img src={AgoraChat} alt="agora chat"/>
                </div>
                <div className='chatlist-header-more' onClick={handleClickMore}>
                    <img src={menuIcon} alt="menu" className={Boolean(addEl) ? 'img-active' : ''} />
                {unDealRequestsNum > 0 ? <p style={{ width: '6px', height: '6px', background: '#FF14CC', borderRadius: '3px', position: 'absolute', top: '-12px', left: '-5px' }}></p> : null}
                </div>

                <Menu
                    id="simple-menu"
                    anchorEl={addEl}
                    keepMounted
                    open={Boolean(addEl)}
                    onClose={() => setAddEl(null)}
                    className='myself-menu'
                >
                    <MenuItem onClick={handleNewChatDialog}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={newChatIcon} alt='new chat' style={{ width: '30px' }} />
                            New Chat
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={createGroupDialog}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={groupChatIcon} alt='new chat' style={{ width: '30px' }} />
                            Add a Group Chat
                    </Typography>
                    </MenuItem>
                    <MenuItem onClick={addFriend}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={addContactIcon} alt='new chat' style={{ width: '30px' }} />
                            Add Contact
                    </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleRequestsDialog} style={{ justifyContent: 'space-between' }}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={requestsIcon} alt='new chat' style={{ width: '30px' }} />
                            Requests
                        </Typography>
                        {unDealRequestsNum > 0 ? <p style={{ width: '12px', height: '12px', background: '#FF14CC', borderRadius: '6px' }}></p> : null}

                    </MenuItem>
                    <MenuItem onClick={handlleSettingDialog}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={settingsIcon} alt='new chat' style={{ width: '30px' }} />
                            Settings
                    </Typography>
                    </MenuItem>
                    <MenuItem onClick={confirmLogout}>
                        <Typography variant="inherit" noWrap style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={logoutIcon} alt='new chat' style={{ width: '30px' }} />
                            Log out
                    </Typography>
                    </MenuItem>
                </Menu>

            </div>
            <AddFriendDialog
                open={showAddFriend}
                onClose={handleAddFriendDialogClose} />

            <ChatGroupDialog
                open={showChatGroup}
                onClose={handleCreateGroupDialogClose}
            />

            <SettingsDialog
                open={showUserSetting}
                onClose={() => setShowUserSetting(false)}
            ></SettingsDialog>

            <ContactDialog
                open={showContact}
                onClose={() => setShowContact(false)}
            >
            </ContactDialog>

            <RequestDialog
                open={showRequest}
                onClose={() => setShowRequest(false)}
            >
            </RequestDialog>

            {/* <UserInfoPopover
                open={showUserInfoPopover}
                anchorEl={userInfoaddEl}
                onClose={handleUserInfoClose}
            /> */}
            <SecondConfirmDialog
                open={Boolean(secondSure)}
                onClose={() => setSecondSure(false)}
                confirmMethod={() => confirmQuitGroup()}
                confirmContent={{
                    content: 'Log Out'
                }}
            ></SecondConfirmDialog>
        </>
    )
}

