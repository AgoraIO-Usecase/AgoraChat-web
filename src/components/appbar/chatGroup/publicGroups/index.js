import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Box, InputBase, Avatar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import store from '../../../../redux/store'
import { searchPublicGroupAction, searchLoadAction } from '../../../../redux/actions'
import { addGroup } from '../../../../api/groupChat/addGroup'
import getPublicGroups from '../../../../api/groupChat/getPublicGroups'
import Loading from '../../../common/loading'
import search_icon from '../../../../assets/search.png'
import groupAvatar_icon from '../../../../assets/groupAvatar.png'

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            width: '100%',
            height: '100%'
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
        gList: {
            height: '590px',
            marginTop: '18px',
            overflowY: 'scroll',
            overflowX: 'hidden'
        },
        gItem: {
            marginBottom: '12px',
            display: 'flex',
            borderRadius: '16px',
            alignItems: 'center'
        },
        gAvatar: {
            width: '50px',
            height: '50px',
            borderRadius: 'inherit',
            // backgroundColor: '#FF9F4D',
            cursor: 'pointer',
        },
        gNameText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Semibold(600)',
            fontSize: '16px',
            character: '0',
            color: '#0D0D0D',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-wrap',
            width: '400px'
        },
        gIdText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Regular(400)',
            fontSize: '14px',
            character: '0',
            color: '#666666'
        },
        gInfoBox: {
            display: 'flex',
            alignItems: 'center',
            flex:'1',
            justifyContent: 'space-between',
            margin: '0 10px',
            cursor: 'pointer'
        },
        gAddedText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Semibold (600)',
            fontSize: '16px',
            character: '0',
            color: '#BDBDBD'
        },
        gAddText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Semibold (600)',
            fontSize: '16px',
            character: '0',
            color: '#005FFF',
        }
    })
});


const PublicGroup = () => {
    const classes = useStyles();
    // const state = store.getState();
    const state = useSelector((state) => state);
    const addedGroups = state?.groups?.groupList;
    const pulicGroupsList = state?.groups?.publicGroups;
    const isSearching = state?.isSearching || false
    const [addedGroupsId, setAddedGroupsId] = useState([])
    useEffect(() => {
        let groupArr = []
        addedGroups.length > 0 && addedGroups.forEach((item, key) => {
            groupArr.push(item.groupid)
        })
        setAddedGroupsId(groupArr);
    }, [addedGroups])


    const handleSearchValue = (e) => {
        if (!(e.target.value)) {
            getPublicGroups()
            store.dispatch(searchLoadAction(true))
        } else {
            store.dispatch(searchPublicGroupAction(e.target.value))
        }
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.inputBox}>
                <img src={search_icon} alt="" className={classes.searchImg} />
                <InputBase
                    type="search"
                    placeholder="Search"
                    className={classes.inputSearch} 
                    onChange={handleSearchValue}
                />
            </Box>
            <Box className={classes.gList}>
                <Loading show={isSearching} />
                {
                    pulicGroupsList.length > 0 && pulicGroupsList.map((item, key) => {
                        return (
                            <Box key={item.groupid} className={classes.gItem}>
                                {/* <Box className={classes.gAvatar}></Box> */}
                                <Avatar className={classes.gAvatar} src={groupAvatar_icon} ></Avatar>
                                <Box className={classes.gInfoBox}>
                                    <Box>
                                        <Typography className={classes.gNameText}>{item.groupname}</Typography>
                                        <Typography className={classes.gIdText}>{item.groupid}</Typography>
                                    </Box>
                                    <Box>
                                        {addedGroupsId.includes(item.groupid) ?
                                            <Typography className={classes.gAddedText}>{i18next.t('Added')}</Typography> :
                                            <Typography onClick={() => addGroup(item.groupid)} className={classes.gAddText}>{i18next.t('Add')}</Typography>}
                                    </Box>
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default PublicGroup;