import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Avatar, Button, Tabs, Tab, Typography, IconButton } from '@material-ui/core';
import CommonDialog from '../../common/dialog'
import i18next from "i18next";
import ClearIcon from '@material-ui/icons/Clear';
import { useSelector } from 'react-redux'
import { acceptContactRequest, declineContactRequest } from '../../../api/contactsChat/getContacts'
import { acceptGroupRequest, declineGroupRequest } from '../../../api/groupChat/groupRequest'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '620px',
        height: theme.spacing(75),
        backgroundColor: 'rgba(206, 211, 217, .15)',
        boxSizing: 'border-box',
        overflowY: 'auto',
        flex: '1',
    },
    itemBox: {
        marginBottom: '15px'
    },
    header: {
        height: theme.spacing(13),
        borderBottom: '1px solid #f2f2f2',
        background: '#fff',
        lineHeight: theme.spacing(13),
        paddingLeft: '16px'
    },
    content: {
        height: theme.spacing(27.5),
        background: '#fff',
        display: 'flex',
        width: '100%',
        padding: '0 16px',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    msgBox: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        '& span:last-child': {
            marginLeft: '12px'
        }
    },
    btnBox: {
        '& button': {
            margin: '0 5px'
        }
    },
    noData: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        color: 'rgba(0,0,0,.15)',
        fontSize: '28px',
        height: '80vh'
    },

    requestItemBox: {
        height: '102px',
        backgroundColor: '#F7F7F7',
        flex: 1,
        width: '100%',
        borderRadius: '16px',
        margin: '5px',
        display: 'flex',
        padding: '8px',
        boxSizing: 'border-box',
        position: 'relative'
    },

    acceptButton: {
        width: '72px',
        height: '28px',
        borderRadius: '17.5px',
        fontSize: '14px',
        color: '#fff',
        marginRight: '10px'
    }
}))

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function RequestItem(props) {
    const classes = useStyles();
    const { data, text, type } = props
    const accept = () => {
        if (type === 'contact') {
            acceptContactRequest(data.name)
        } else {
            acceptGroupRequest(data.name, data.groupId)
        }
    }

    const ignore = () => {
        if (type === 'contact') {
            declineContactRequest(data.name)
        } else {
            declineGroupRequest(data.name, data.groupId)
        }
    }
    let buttonContent = null
    if (data.status === 'pedding') {
        buttonContent = (
            <>
                <Button color="primary" variant="contained" className={classes.acceptButton} onClick={accept} > {i18next.t('accept')}</Button >
                <IconButton style={{ width: '28px', height: '28px' }} onClick={ignore}><ClearIcon /></IconButton>
            </>
        )
    } else {
        buttonContent = (
            <div style={{ color: '#BDBDBD' }}>{data.status}</div>
        )
    }
    let localTime = data.time ? new Date(data.time).toLocaleDateString() : ''
    return (
        <div className={classes.requestItemBox}>
            <Avatar style={{ width: '50px', height: '50px', marginRight: '11px' }} />
            <div style={{ margin: '0 5px' }}>
                <div>
                    <div>{data.name}</div>
                    <div style={{ fontSize: '14px' }}>{text}</div>
                </div>
            </div>
            <div style={{ position: 'relative', right: '-36px', fontSize: '12px', color: '#666666' }}>{localTime}</div>
            <div style={{ position: 'absolute', bottom: '12px', right: '14px' }}>
                {buttonContent}
            </div>
        </div >
    )
}

function Notice(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const requests = useSelector(state => state?.requests) || { contact: [], group: [] }

    const { open, onClose } = props
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    function renderContent() {
        return (
            <div className={classes.root}>
                <Box
                    sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 590 }}
                    style={{ width: '100%' }}
                >
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <Tab label="New Friends" {...a11yProps(0)} />
                        <Tab label="Group Requests" {...a11yProps(1)} />
                    </Tabs>
                    <TabPanel value={value} index={0} style={{ overflowY: 'auto', flex: '1', backgroundColor: '#EDEFF2' }}>
                        {requests.contact.map(value => {
                            return (
                                <RequestItem key={value.name} data={value} type="contact" text="Sent you a friend request." />
                            )
                        })}
                    </TabPanel>
                    <TabPanel value={value} index={1} style={{ overflowY: 'auto', flex: '1', backgroundColor: '#EDEFF2' }}>
                        {requests.group.map((value,key) => {
                            return (
                                <RequestItem key={key} data={value} type="group" text={"Want to join the " + value.groupId} />
                            )
                        })}
                    </TabPanel>
                </Box>
            </div>
        )
    }

    return (
        <CommonDialog
            open={open}
            onClose={onClose}
            title={i18next.t("Request")}
            content={renderContent()}
            maxWidth={700}
        ></CommonDialog>
    );
}

export default memo(Notice)

