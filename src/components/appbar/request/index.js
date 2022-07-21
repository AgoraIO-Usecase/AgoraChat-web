import React, { memo, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Box, Avatar, Button, Tabs, Tab, Typography, IconButton, InputBase, Menu, MenuItem } from '@material-ui/core';
import CommonDialog from '../../common/dialog'
import i18next from "i18next";
import ClearIcon from '@material-ui/icons/Clear';
import { useSelector } from 'react-redux'
import { acceptContactRequest, declineContactRequest } from '../../../api/contactsChat/getContacts'
import { acceptGroupRequest, declineGroupRequest } from '../../../api/groupChat/groupRequest'
import addcontactIcon from '../../../assets/addcontact@2x.png'
import search_icon from '../../../assets/search.png'
import menu_icon from '../../../assets/menu@2x.png'
import accept_icon from '../../../assets/acceptall@2x.png'
import ignore_icon from '../../../assets/ignoreall@2x.png'
import clear_icon from '../../../assets/clearall@2x.png'
import group_request from '../../../assets/group_requates@2x.png'
import store from "../../../redux/store";
import { setRequests } from '../../../redux/actions'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '700px',
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
        margin: '5px 0',
        display: 'flex',
        padding: '8px',
        boxSizing: 'border-box',
        position: 'relative'
    },

    acceptButton: {
        width: '72px',
        height: '28px',
        borderRadius: '17.5px',
        color: '#fff',
        marginRight: '10px',
        background: '#114EFF',
        display: 'inline-block',
        lineHeight: '28px',
        fontSize: '14px',
        textAlign: 'center',
    },
    tabsRequest: {
        background: '#FFFFFF',
        padding: '8px 8px 0 8px',
        width: '200px',
        '& .MuiTab-textColorInherit.Mui-selected': {
            background: 'rgb(235, 237, 241)',
            borderRadius: '8px',
        },
        '& .MuiTabs-indicator': {
            background: 'transparent',
        },
        '& .MuiTab-root': {
            minHeight: '30px',
            paddingLeft: '0px',
        }
    },
    menusBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        cursor: 'pointer',
    },
    menus: {
        color: '#000000',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'Roboto',
        textTransform: ' none',
        character: '0',
        borderRadius: '8px',
    },
    IconButtonStyle: {
        color: '#ccc',
        padding: '6px',
        '& .MuiSvgIcon-root': {
            width: '15px',
            height: '15px',
            color: '#ccc',
            // padding: '6px',
        }
    },
    TabPanelStyle: {
        overflowY: 'auto',
        flex: '1',
        backgroundColor: '#EDEFF2',
        '& .MuiBox-root': {
            padding: '10px 8px 8px 8px',
        }
    },
    searchBox: {
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '23px',
        background: '#F4F5F7',
        flex: '1',
        marginRight: '5px'
    },
    inputSearch: {
        borderBottom: 'none',
        width: '100%',
        padding: '6px 5px 7px',
    },
    searchImg: {
        width: '18px',
        height: '18px',
        paddingLeft: '8px'
    },
    menuIcon: {
        width: '30px',
        height: '30px'
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
    if (data.status === 'pending') {
        buttonContent = (
            <>
                <div color="primary" variant="contained" className={classes.acceptButton} onClick={accept} > {i18next.t('accept')}</div >
                <IconButton className={classes.IconButtonStyle} onClick={ignore}><ClearIcon /></IconButton>
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
            <Avatar style={{ width: '40px', height: '40px', marginRight: '11px' }} />
            <div style={{ margin: '0 5px' }}>
                <div>
                    <div>{data.name}</div>
                    <div style={{ fontSize: '14px' }}>{text}</div>
                </div>
            </div>
            <div style={{ position: 'absolute', right: '22px', fontSize: '12px', color: '#666666' }}>{localTime}</div>
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
    const [requestsCp, setRequestsCp] = useState(requests)
    const { open, onClose } = props
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputValue = (event) => {
        const requestsCp2 = JSON.parse(JSON.stringify(requestsCp))
        if (value === 0) {
            requestsCp2.contact.forEach(item => {
                if (!item.name.includes(event.target.value)) {
                    item.hidden = true
                } else {
                    item.hidden = false
                }
            })
        } else {
            requestsCp2.group.forEach(item => {
                if (!item.name.includes(event.target.value)) {
                    item.hidden = true
                } else {
                    item.hidden = false
                }
            })
        }
        setRequestsCp(requestsCp2)
    }
    const AddedContactMenu = () => {
        return (
            <Box className={classes.menusBox}>
                <img src={addcontactIcon} alt='new chat' style={{ width: '30px' }} />
                <Typography style={{ marginLeft: '8px' }}>{`${i18next.t('New Friends')}`}</Typography>
            </Box>
        )
    }
    const AddedGroupsMenu = () => {
        return (
            <Box className={classes.menusBox}>
                <img src={group_request} alt='new chat' style={{ width: '30px' }} />
                <Typography style={{ marginLeft: '8px' }}>{`${i18next.t('Group Requests')}`}</Typography>
            </Box>
        )
    }
    const [sessionEl, setSessionEl] = useState(null);
    const handleMenuClick = (e) => {
        setSessionEl(e.currentTarget);
    };
    const handleMenuItemClick = (operate, chatType) => () => {
        console.log(operate, value)
        switch (operate) {
            case 'accept':
                if (value === 0) {
                    requests.contact.forEach((data) => {
                        console.log('data', data) // ignored  accepted pending
                        if (data.status === 'pending') {
                            acceptContactRequest(data.name)
                        }
                    })
                } else {
                    requests.group.forEach((data) => {
                        if (data.status === 'pending') {
                            acceptGroupRequest(data.name, data.groupId)
                        }
                    })
                }
                break;
            case 'ignore':
                if (value === 0) {
                    requests.contact.forEach((data) => {
                        console.log('data', data)
                        if (data.status === 'pending') {
                            declineContactRequest(data.name)
                        }
                    })
                } else {
                    requests.group.forEach((data) => {
                        if (data.status === 'pending') {
                            declineGroupRequest(data.name, data.groupId)
                        }
                    })
                }
                break;
            case 'clear':
                if (value === 0) {
                    store.dispatch(setRequests({
                        ...requests,
                        contact: []
                    }))
                } else {
                    store.dispatch(setRequests({
                        ...requests,
                        group: []
                    }))
                }
                break;
        }
        setSessionEl(null)
    }
    const renderMenu = () => {
        return (
            <Menu
                id="simple-menu"
                anchorEl={sessionEl}
                keepMounted
                open={Boolean(sessionEl)}
                onClose={() => setSessionEl(null)}
            >
                <MenuItem onClick={handleMenuItemClick('accept')}>
                    <img src={accept_icon} alt="" className={classes.menuIcon} />
                    <Typography variant="inherit" noWrap>
                        {i18next.t("Accept all")}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuItemClick('ignore')}>
                    <img className={classes.menuIcon} src={ignore_icon} alt="" />
                    <Typography variant="inherit" noWrap>
                        {i18next.t("Ignore all")}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={handleMenuItemClick('clear')}>
                    <img className={classes.menuIcon} src={clear_icon} alt="" />
                    <Typography variant="inherit" noWrap>
                        {i18next.t("Clear all")}
                    </Typography>
                </MenuItem>
            </Menu>
        );
    };

    useEffect(() => {
        setRequestsCp(requests)
    }, [
        requests
    ])
    function renderContent() {
        return (
            <div className={classes.root}>
                <Box
                    sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 600 }}
                    style={{ width: '100%' }}
                >
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                        className={classes.tabsRequest}
                    >
                        <Tab label={<AddedContactMenu />} {...a11yProps(0)} className={classes.menus} />
                        <Tab label={<AddedGroupsMenu />} {...a11yProps(1)} className={classes.menus} />
                    </Tabs>
                    <TabPanel value={value} index={0} className={classes.TabPanelStyle}>
                        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', margin: '10px 0 20px 0' }}>
                            <Box className={classes.searchBox}>
                                <img src={search_icon} alt="" className={classes.searchImg} />
                                <InputBase placeholder={i18next.t('Search')} className={classes.inputSearch} onChange={handleInputValue} />
                            </Box>
                            <IconButton circle style={{ borderRadius: '50%', width: '32px', height: '32px' }} onClick={handleMenuClick}>
                                <img src={menu_icon} alt="menu" style={{ width: '32px', height: '32px' }} />
                            </IconButton>
                        </Box>
                        {requestsCp.contact.map((value, index) => {
                            if (!value.hidden) {
                                return (
                                    <RequestItem key={value.name + Math.floor(Math.random() * 1000)} data={value} type="contact" text="Sent you a friend request." />
                                )
                            }
                        })}
                    </TabPanel>
                    <TabPanel value={value} index={1} className={classes.TabPanelStyle}>
                        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', margin: '10px 0 20px 0' }}>
                            <Box className={classes.searchBox}>
                                <img src={search_icon} alt="" className={classes.searchImg} />
                                <InputBase placeholder={i18next.t('Search')} className={classes.inputSearch} onChange={handleInputValue} />
                            </Box>
                            <IconButton onClick={handleMenuClick} circle style={{ borderRadius: '50%', width: '32px', height: '32px' }}>
                                <img src={menu_icon} alt="menu" style={{ width: '32px', height: '32px' }} />
                            </IconButton>
                        </Box>
                        {requestsCp.group.map((value, key) => {
                            if (!value.hidden) {
                                return (
                                    <RequestItem key={value.groupId + Math.floor(Math.random() * 1000)} data={value} type="group" text={"Want to join the " + value.groupId} />
                                )
                            }
                        })}
                    </TabPanel>
                </Box>
                {renderMenu()}
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

