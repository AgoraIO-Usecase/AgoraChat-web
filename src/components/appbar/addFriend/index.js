import React, { useState } from 'react'
import CommonDialog from '../../common/dialog'
import i18next from "i18next";
import { Box, TextField, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { message } from '../../common/alert'
import { addContact } from '../../../api/contactsChat/getContacts'
import JoinGroup from '../chatGroup/joinGroup/index'

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: theme.spacing(4),
            padding: '16px 24px',
            width: theme.spacing(60),
            boxSizing: 'border-box'
        },
        inputLabel: {
            marginBottom: theme.spacing(4),
            width: '100%'
        },
        button: {
            width: '50%',
            marginTop: theme.spacing(11),
            color: "#fff"
        }
    })
});

export default function AddfriendDialog({ open, onClose }) {
    const classes = useStyles();
    // const dispatch = useDispatch()
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState(null)
    const addFriend = (inputValue) => {
        if (!inputValue) {
            return setError(true)
        }
        addContact(inputValue, 'hi')
        message.success(i18next.t('Successfully send the application'))
        setInputValue('')
        setError(null)
        onClose()
    }
    const handleChange = (event) => {
        setInputValue(event.target.value)
        setError(null)
    }
    const handleClose = () => {
        setInputValue('')
        setError(null)
        onClose()
    }
    function renderContent() {
        return (
            false ?
            <Box className={classes.root}>
                <Typography className={classes.inputLabel}>
                    {i18next.t('login-UserID')}
                </Typography>

                <TextField
                    label={i18next.t('login-UserID')} variant="outlined" fullWidth autoFocus name="email"
                    error={error}
                    value={inputValue}
                    onChange={handleChange} />

                <Button
                    onClick={addFriend} variant="contained" color="primary" className={classes.button}>
                    {i18next.t('Send')}
                </Button>
            </Box>
            : <div style={{width: '500px', height: '400px', padding: '10px'}}>
                <JoinGroup
                    contentObj={{
                        placeholder: i18next.t('login-UserID'),
                        title: 'AgoraID'
                    }}
                    sendMethod={addFriend}
                />
            </div>
        )
    }

    return (
        <CommonDialog
            open={open}
            onClose={handleClose}
            title={i18next.t('Send Contact Adding Request')}
            content={renderContent()}
        ></CommonDialog>
    )
}

