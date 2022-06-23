import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import MembersIcon from '../images/members.png'
import NotificationsIcon from '../images/Notifications.png'
import FullViewIcon from '../images/FullView.png'
import SplitViewIcon from '../images/SplitView.png'
import EditThreadIcon from '../images/EditThread.png'
import LeaveThreadIcon from '../images/LeaveThread.png'
import DisbandThreadIcon from '../images/DisbandThread.png'
import getGroupInfo from '../../../api/groupChat/getGroupInfo'
import store from "../../../redux/store";
import { setThreadInfo } from '../../../redux/actions'
import { Popover } from "@material-ui/core";

const EDIT_THREAD_TYPES = {
    Members: {
        icon: MembersIcon,
        type: 'Members',
        level: 0
    },
    Notifications: {
        icon: NotificationsIcon,
        type: 'Notifications',
        level: 0
    },
    FullView: {
        icon: FullViewIcon,
        type: 'SplitView',
        level: 3
    },
    SplitView: {
        icon: SplitViewIcon,
        type: 'SplitView',
        level: 3
    },
    EditThread: {
        icon: EditThreadIcon,
        type: 'Edit Thread',
        level: 1
    },
    LeaveThread: {
        icon: LeaveThreadIcon,
        type: 'Leave Thread',
        level: 0
    },
    DisbandThread: {
        icon: DisbandThreadIcon,
        type: 'Disband Thread',
        level: 1
    },
}
const useStyles = makeStyles(() => {
    return {
        container: {
            padding: '0 8px 8px',
            minHeight: "116px",
            width: '240px',
            borderRadius: '12px',
            background: '#fff',
            color: '#000',
            fontSize: '14px',
            boxSizing: 'border-box',
        },
        itemType: {
            display: 'flex',
            marginTop: '8px',
            width: '100%',
            height: '38px',
            lineHeight: '38px',
            borderRadius: '8px',
            '&:hover': {
                backgroundColor: '#F6F7F8'
            },
            '&:active': {
                backgroundColor: '#F4F5F7'
            },
            cursor: 'pointer',
        },
        typeIcon: {
            display: 'block',
            marginTop: '4px',
            height: '30px',
            width: '30px',
        },
        typeText: {
            marginLeft: '8px',
            fontWeight: '500'
        }

    };
});

export default function EditThreadPanel({ anchorEl, onClose, onchangeEditPanelStatus }) {
    const classes = useStyles();
    const state = useSelector(state => state)
    const groupId = state?.thread?.groupId || '';
    const groupsInfo = state?.groups?.groupsInfo || {};
    const groupAdmins = state?.groups?.groupAdmins || [];
    const username = state?.myUserInfo?.agoraId || '';
    const threadOwner = state?.thread?.threadOwner || '';
    const owner = groupsInfo?.owner || [];
    let isAdmin = (owner === username || groupAdmins.indexOf(username) > -1) ? true : false;
    let isThreadOwner = threadOwner === username ? true : false;
    useEffect(() => {
        if (groupId && groupId !== '') {
            getGroupInfo(groupId, 'thread')
        }
    }, [groupId])
    useEffect(() => {
        store.dispatch(setThreadInfo({ isAdmin }))
    }, [isAdmin])
    let editTypes = [];
    for (var key in EDIT_THREAD_TYPES) {
        if (isAdmin && EDIT_THREAD_TYPES[key].level <= 1) {
            editTypes.push(key)
        } else if ((!isAdmin && EDIT_THREAD_TYPES[key].level === 0) || (isThreadOwner && key === 'EditThread')) {
            editTypes.push(key)
        }
    }
    const changepanelstates = (e, type) => {
        onchangeEditPanelStatus(e, type);
        onClose();
    }

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <div className={classes.container}>
                {editTypes.length && editTypes.map((itemType, index) => {
                    return (
                        <div className={classes.itemType} onClick={(e) => { changepanelstates(e, itemType) }} key={index}>
                            <img src={EDIT_THREAD_TYPES[itemType].icon} className={classes.typeIcon} alt='editIcon'></img>
                            <span className={classes.typeText} style={{ color: itemType === "DisbandThread" ? "#FF14CC" : '#000' }}>{EDIT_THREAD_TYPES[itemType].type}</span>
                        </div>
                    );
                })}
            </div>
        </Popover>
    );
}