
import React, { useState, useEffect } from 'react'
import i18next from "i18next";
import store from '../../../../redux/store'
// import { EaseApp } from "uikit-reaction";
// import { EaseApp } from "chat-uikit";
import { EaseApp } from "chat-uikit2";
import CommonDialog from '../../../common/dialog'
import createGroup from '../../../../api/groupChat/createGroup'
import { Box, Checkbox, List, ListItem, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash'
import getContacts from '../../../../api/contactsChat/getContacts'
import { searchContactsAction, searchLoadAction } from '../../../../redux/actions'
import Loading from '../../../common/loading'
import rearch_icon from '../../../../assets/search@2x.png'
import back_icon from '../../../../assets/back@2x.png'
import create_icon from '../../../../assets/create@2x.png'
import deldete_icon from '../../../../assets/delete@2x.png'
import groupAvatar from '../../../../assets/groupAvatar.png'

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            width: '880px',
            height: '680px',
            display: 'flex',
            overflow: 'hidden'
        },
        gInfoText: {
            textAlign: 'center',
            width: '62%',
            marginTop:'20%'
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
            fontFamily: 'Ping Fang SC',
            fontWeight: '400',
            fontSize: '12px',
            character: '0',
            lineHeight: '16px',
            color: '#000000',
            wordBreak: "break-all"
        },
        gUserBox: {
            width: '100%',
            display: 'flex'
        },
        backBox: {
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            left: '20px',
            bottom: '20px',
            cursor: 'pointer',
            color: '#005FFF'
        },
        goBox: {
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            right: '20px',
            bottom: '20px',
            cursor: 'pointer',
            color: '#005FFF'
        },
        gMemberAvatar: {
            width: '36px',
            height: '36px',
            borderRadius: '20px',
            backgroundColor: '#FF9F4D',
        },
        iconImg: {
            width: '20px',
            height: '20px'
        },
        searchBox: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '30px'
        },
        contactsItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '50px'
        },
        memberBox: {
            width: '50%',
            background: '#EDEFF2',
            padding: '10px'
        },
        gAvatar: {
            height: '100px',
            width: '100px'
        },
    })
});

const AddGroupMemberDialog = ({ groupInfoData, onClearValue, open, onClose }) => {
    const { groupNameValue, groupDescriptionValue } = groupInfoData
    const state = store.getState();
    const contacts = state?.constacts;
    const isSearching = state?.isSearching || false
    const classes = useStyles();
    const [searchValue, setSearchValue] = useState('')
    const [groupMembers, setGroupMembers] = useState([]);
    const [contactsObjs, setContactsObjs] = useState([]);

    useEffect(() => {
        let contactsObjs = contacts.map((value) => {
            return { id: value, checked: false }
        })
        setContactsObjs(contactsObjs)
    }, [contacts])


    // search value
    const searchChangeValue = (e) => {
        if (!(e.target.value)) {
            getContacts();
            store.dispatch(searchLoadAction(true))
        } else {
            setSearchValue(e.target.value)
        }
    }

    // click search
    const handleSearchValue = () => {
        if (searchValue === '') return
        store.dispatch(searchContactsAction(searchValue))
    }

    // click group 
    const handleClickSession = (itemData) => {
		// uikit
		let conversationItem = {
			conversationType: "groupChat",
			conversationId: itemData,
		};
		EaseApp.addConversationItem(conversationItem);
		onClose();
	};

    const handleSelect = (val) => (e) => {
        if (e.target.checked) {
            groupMembers.push(val)
            console.log('groupMembers', [...groupMembers])
            setGroupMembers([...groupMembers])
            contactsObjs.forEach((value) => {
                if (value.id === val) {
                    value.checked = true
                }
            })
            setContactsObjs([...contactsObjs])
        } else if (!(e.target.checked)) {
            let groupMembers2 = _.pull(groupMembers, val)
            setGroupMembers([...groupMembers2])
            contactsObjs.forEach((value) => {
                if (value.id === val) {
                    value.checked = false
                }
            })
            setContactsObjs([...contactsObjs])
        }
    }

    const deleteGroupMember = (val) => () => {
        let newGroupAry = _.pull(groupMembers, val);
        setGroupMembers(newGroupAry)
        contactsObjs.forEach((value) => {
            if (value.id === val) {
                value.checked = false
            }
        })
        setContactsObjs([...contactsObjs])

    }

    const handleCreateGroup = () => {
        createGroup(
			groupInfoData,
			groupMembers,
			onClearValue,
			onClose,
			handleClickSession
		);
    }
    let throttled = _.throttle(handleCreateGroup, 3000, { 'trailing': false });


    const renderMember = () => {
        return (
            <Box className={classes.root}>
                <Box className={classes.gInfoText}>
                    <Box>
                        <img src={groupAvatar} alt="" className={classes.gAvatar} />
                        <Typography className={classes.gNameText}>{groupNameValue}</Typography>
                        <Typography className={classes.gDescriptionText}>{groupDescriptionValue}</Typography>
                    </Box>
                </Box>
                <Box className={classes.gUserBox}>
                    <Box style={{ width: '50%', background: '#F5F7FA', padding: '10px' }}>
                        <Box className={classes.searchBox}>
                            <InputBase type="search"
                                placeholder={i18next.t('Your Contacts')}
                                style={{ width: '100%', padding: '5px' }}
                                onChange={searchChangeValue}
                            />
                            <img src={rearch_icon} alt=""
                                style={{ width: '32px', cursor: 'pointer' }}
                                onClick={handleSearchValue}
                            />
                        </Box>
                        <Loading show={isSearching} />
                        <List>
                            {contactsObjs.length > 0 && contactsObjs.map((item, key) => {
                                return (
                                    <ListItem key={key} onClick={handleSelect(item.id)} className={classes.contactsItem}>
                                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                                            <Box className={classes.gMemberAvatar}></Box>
                                            <Typography style={{ marginLeft: '10px' }}>{item.id}</Typography>
                                        </Box>
                                        <Checkbox checked={item.checked} />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                    <Box className={classes.memberBox}>
                        <Typography >{`${i18next.t('Group Members')}(${groupMembers.length})`}</Typography>
                        <List>
                            {groupMembers.length > 0 && groupMembers.map((item, key) => {
                                return (
                                    <ListItem key={key} className={classes.contactsItem}>
                                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                                            <Box className={classes.gMemberAvatar} ></Box>
                                            <Typography style={{ marginLeft: '10px' }}>{item}</Typography>
                                        </Box>
                                        <img src={deldete_icon} alt="" style={{ width: '20px', cursor: 'pointer' }} onClick={deleteGroupMember(item)} />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                </Box>
                {/* 返回 */}
                <Box className={classes.backBox} onClick={() => onClose()}>
                    <img src={back_icon} alt="" className={classes.iconImg} />
                    <Typography>{i18next.t('Back')}</Typography>
                </Box>
                {/* 创建 */}
                <Box className={classes.goBox} onClick={throttled}>
                    <Typography>{i18next.t('Create')}</Typography>
                    <img src={create_icon} alt="" className={classes.iconImg} />
                </Box>
            </Box>
        )
    }

    return (
        <CommonDialog
            open={open}
            onClose={onClose}
            title={i18next.t('Add a Group Chat')}
            content={renderMember()}
            maxWidth={880}
        ></CommonDialog>
    )
}

export default AddGroupMemberDialog;