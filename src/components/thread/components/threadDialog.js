import React, { useState, useEffect, createRef } from "react";
import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";
import closeIcon from '../images/close.png'
import deleteIcon from '../images/delete.png'
import store from "../../../redux/store";
import { setThreadInfo} from '../../../redux/actions'
import i18next from "i18next";
import { changeThreadName, leaveThread, destroyThread } from '../../../api/thread'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Notifications from '../../appbar/chatGroup/groupSettings/members/notifications'
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => {
    return {
        dialog: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '540px',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '1px 1px 10px rgb(0 0 0 / 30%)',
            zIndex: '100',
        },
        dialogHeader: {
            display: 'flex',
            justifyContent: "space-between",
            height: '59px',
            lineHeight: '59px',
            borderBottom: '1px solid #ccc',
        },
        title: {
            marginLeft: '24px',
            fontWeight: '600',
            color: '#000',
        },
        icon: {
            display: 'block',
            marginRight: '23px',
            marginTop: '23px',
            height: '14px',
            width: '14px',
            cursor: 'pointer',
        },
        buttons: {
            display: 'flex',
            height: '100px',
            paddingTop: '40px',
            boxSizing: 'border-box',
        },
        button1: {
            marginLeft: '341px',
            height: '36px',
            lineHeight: '36px',
            textAlign: 'center',
            width: '84px',
            borderRadius: '26px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: '#000',
            background:'#fff',
            '&:hover':{
                background: '#F2F2F2',
            },
            '&:active':{
                background: '#E6E6E6',
            }
        },
        button2: {
            marginLeft: '8px',
            height: '36px',
            lineHeight: '36px',
            textAlign: 'center',
            width: '84px',
            borderRadius: '26px',
            background: '#114EFF',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            '&:hover':{
                background: '#104AF2',
            },
            '&:active':{
                background: '#0F46E6',
            }
        },
        changeName: {
            display: 'flex',
            margin: '16px auto',
            height: '54px',
            width: '508px',
            background: '#F4F5F7',
            borderRadius: '16px',
        },
        changeNameInput: {
            marginLeft: '15px',
            lineHeight: '54px',
            width: '450px',
            outline: 'none',
            border: 'none',
            background: 'none',
            fontWeight: '500',
            fontSize: '18px',
            '&:focus': {
                outline: 'none',
            }
        },
        deleteIcon: {
            display: 'block',
            marginLeft: '8px',
            marginTop: '20px',
            height: '14px',
            width: '14px',
            cursor: 'pointer',
        }

    };
});

const ThreadDialog = () => {
    const classes = useStyles();
    const state = useSelector(state => state)
    const editNameRef = createRef();
    const threadName = state?.thread?.threadName || '';
    const [inputValue, changeInputValue] = useState('');
    const handleNameChange = (e) => {
        changeInputValue(e.target.value);
    }
    const threadId = state?.thread?.threadId || '';
    const currentEditPage = state?.thread?.currentEditPage || '';
    const clearInputValue = () => {
        changeInputValue('');
    }
    const closeDialog = () => {
        setShowDialog(false)
        store.dispatch(setThreadInfo({ currentEditPage:''}))
    }
    const save = () => {
        if (currentEditPage === 'EditThread') {
            changeThreadName({
                chatThreadId: threadId,
                name: inputValue
            })
            clearInputValue();
        } else if (currentEditPage === 'LeaveThread') {
            leaveThread({ chatThreadId: threadId })
        } else if (currentEditPage === 'DisbandThread') {
            destroyThread({ chatThreadId: threadId })
        }
        closeDialog();
    }
    let title = "";
    let btn2Text = 'Leave'
    switch (currentEditPage) {
        case "EditThread":
            title = i18next.t("Edit Thread Name")
            btn2Text = 'Save'
            break;
        case "LeaveThread":
            title = i18next.t("Leave this Thread?")
            break;
        case "DisbandThread":
            title = i18next.t("Disband this Thread")
            btn2Text = 'Disband'
            break;
        case "Notifications":
            title = i18next.t("Thread Notifications")
            break;
        default:
            title = '';
            break;
    }
    const renderContent = () => {
        if (currentEditPage === 'EditThread') {
            return (
                <div className={classes.changeName}>
                    <input ref={editNameRef} className={classes.changeNameInput} value={inputValue} onChange={handleNameChange} maxLength={64}></input>
                    {inputValue!=='' && <img src={deleteIcon} className={classes.deleteIcon} onClick={clearInputValue} alt="deleteIcon"></img>}
                </div>
            )
        }
    }
    const renderButtons = () => {
        return (
            <div className={classes.buttons}>
                <div className={classes.button1} onClick={closeDialog}>Cancel</div>
                <div className={classes.button2} onClick={save}>{btn2Text}</div>
            </div>
        )
    }
    const [showDialog, setShowDialog] = useState(false);
    useEffect(() => {
        setShowDialog(currentEditPage === 'EditThread' || currentEditPage === 'DisbandThread' || currentEditPage === 'LeaveThread'  || currentEditPage === 'Notifications')
    }, [currentEditPage])

    useEffect(()=>{
        if(showDialog && currentEditPage === 'EditThread'){
            changeInputValue(threadName);
        }
    },[currentEditPage,showDialog,threadName])

    useEffect(()=>{
        editNameRef.current && editNameRef.current.focus();
    },[editNameRef])
    
    const showMuteImgOrNot = (flag) => {
		// setmuteFlag(flag)
	}
    return (
        <Dialog
            open={showDialog}
            TransitionComponent={Transition}
            onClose={closeDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            {
                showDialog &&
                <div className={classes.dialog}>
                    <div className={classes.dialogHeader}>
                        <div className={classes.title}>{title}</div>
                        <img src={closeIcon} className={classes.icon} onClick={closeDialog} alt='close'></img>
                    </div>
                    {
                        currentEditPage === 'Notifications' ?
                            <Notifications showMuteImgOrNot={showMuteImgOrNot} groupId={threadId} useScene="groupChat" useComponent="Thread" />
                        : <>
                            {renderContent()}
                            {renderButtons()}
                        </>
                    }
                </div>
            }
        </Dialog>
    );
}
export default ThreadDialog