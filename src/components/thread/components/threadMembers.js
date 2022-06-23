import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import "./member.css"
import { Box, Popover } from "@material-ui/core";
import close from '../images/close.png'
import avatarImg from '../../../assets/avatar1.jpg'
import { getThreadMembers, removeMemberFromThread } from '../../../api/thread'
import store from "../../../redux/store";
import { setThreadInfo } from '../../../redux/actions'
import { userAvatar } from '../../../utils'

const useStyles = makeStyles(() => {
    return {
        container: {
            position: 'fixed',
            top: '10px',
            right: '20px',
            zIndex: '1000',
            width: '540px',
            background: '#EDEFF2',
            borderRadius: '0 12px 12px 0',
            boxShadow: '1px 1px 10px rgb(0 0 0 / 30%)',
            minHeight: '416px',
            maxHeight: '770px',
        },
    };
});

const ThreadMembers = ({ membersPanelEl }) => {
    const state = useSelector(state => state)
    const threadId = state?.thread?.threadId || '';
    const threadName = state?.thread?.threadName || '';
    const membersList = state?.thread?.membersList || [];
    const isAdmin = state?.thread?.isAdmin || false;
    const isLast = state?.thread?.isLast || false;
    const currentEditPage = state?.thread?.currentEditPage;
    const username = state?.myUserInfo?.agoraId
    const membersCon = useRef(null)
    useEffect(() => {
        if (threadId !== '' && currentEditPage === 'Members') {
            getThreadMembers(threadId)
        }
    }, [currentEditPage, threadId])

    useEffect(() => {
        if (currentEditPage === 'Members') {
            const handleMemberList = (e) => {
                if (!membersCon.current) {
                    return;
                }
                /**点击弹窗之内的，不关闭；点击弹窗之外的，关闭 */
                if (!membersCon.current.contains(e.target) && membersCon.current !== e.target && e.target !== membersPanelEl) {
                    onCloseMemberList();
                }
            }
            document.addEventListener('click', handleMemberList)
            return () => {
                document.removeEventListener('click', handleMemberList)
            }
        }
    }, [currentEditPage, membersPanelEl])

    const classes = useStyles();
    const [removeId, setRemoveId] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const selectRemovedMember = (e, item) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setAnchorEl(e.target);
        setRemoveId(item);
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const removeMember = () => {
        removeMemberFromThread({
            chatThreadId:threadId,
            username: removeId
        })
        handleClose();
        onCloseMemberList();
    }

    const membersDomEl = useRef(null);
    const [isPullingDown, setIsPullingDown] = useState(false);
    const handleScroll = (e) => {
        if (!isLast && e.target.scrollHeight === (e.target.scrollTop + e.target.clientHeight)) {
            if (!isPullingDown) {
                setIsPullingDown(true);
                setTimeout(() => {
                    setIsPullingDown(false);
                    getThreadMembers(threadId, 'isScroll')
                }, 500);
            }
        }
    };
    const onCloseMemberList = () => {
        store.dispatch(setThreadInfo({ currentEditPage: '' }))
    }

    return (
        <div>
            {currentEditPage === 'Members' && <div className={classes.container} ref={membersCon}>
                <div className='tlp-header'>
                    <span className='tlp-header-title'>{threadName}</span>
                    <Box>
                        <div className="tlp-header-icon" onClick={onCloseMemberList}>
                            <img className="tlp-header-icon-close" alt="" src={close} />
                        </div>
                    </Box>
                </div>
                <div className="list-con" ref={membersDomEl} onScroll={handleScroll}>
                    {membersList.length === 0 && <div className="list-empty">No member</div>}
                    {membersList.length > 0 && membersList.map((item, index) => {
                        return (
                            <div className="list-item" key={index}>
                                <div className="user-info">
                                    <img className="avatar" src={userAvatar(item)} alt='avatar' />
                                    <span className="username">{item}</span>
                                </div>
                                {isAdmin && (username !== item) && <div className="user-role">
                                    <div className="edit-con" onClick={(e) => selectRemovedMember(e, item)}>
                                        <span className="edit"></span>
                                    </div>
                                </div>}
                            </div>
                        )
                    })}
                </div>
                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                >
                    <div className="remove-con" onClick={removeMember}>
                        <div className="remove">
                            <span className="remove-icon"></span>
                            <span className="remove-text">Remove</span>
                        </div>
                    </div>
                </Popover></div>}
        </div>
    );
}
export default ThreadMembers