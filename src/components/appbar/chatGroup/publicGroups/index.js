import React, { useState, useEffect } from 'react'
import { useSelector} from 'react-redux'
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
            height: '100%',
            // '& ::-webkit-scrollbar': {
            //     display: 'none', /* Chrome Safari */
            // },
            // scrollbarWidth: 'none', /* firefox */
            // '-ms-overflow-style': 'none', /* IE 10+ */
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
            overflowX: 'hidden',
        },
        gItem: {
            marginBottom: '12px',
            display: 'flex',
            borderRadius: '16px',
            alignItems: 'center',
            padding: '8px',
            '&:hover': {
                background: 'rgb(243, 244, 246)',
            }
        },
        gAvatar: {
            width: '50px',
            height: '50px',
            borderRadius: 'inherit',
            // backgroundColor: '#FF9F4D',
            cursor: 'pointer',
        },
        gNameText: {
            fontFamily: 'Roboto',
            fontWeight: '600',
            fontSize: '16px',
            character: '0',
            color: '#0D0D0D',
            overflowX: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-wrap',
            width: '400px'
        },
        gIdText: {
            fontFamily: 'Roboto',
            fontWeight: '400',
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
            fontFamily: 'Roboto',
            fontWeight: '600',
            fontSize: '16px',
            character: '0',
            color: '#BDBDBD'
        },
        gAddText: {
            fontFamily: 'Roboto',
            fontWeight: '600',
            fontSize: '16px',
            character: '0',
            color: '#005FFF',
            visibility: 'hidden',
        }
    })
});


const PublicGroup = () => {
    const classes = useStyles();
    // const state = store.getState();
    const state = useSelector((state) => state);
    const addedGroups = state?.groups?.groupList;
    const publicGroupsList = state?.groups?.publicGroups;
    const isSearching = state?.isSearching || false
    const [addedGroupsId, setAddedGroupsId] = useState([])

    const [renderGroups, setRenderGroups] = useState([...publicGroupsList])

    useEffect(() => {
        let groupArr = []
        addedGroups.length > 0 && addedGroups.forEach((item, key) => {
            groupArr.push(item.groupid)
        })
        setAddedGroupsId(groupArr);
    }, [addedGroups])

    useEffect(() => {
        getPublicGroups();
    }, [])

    useEffect(() => {
        setRenderGroups(publicGroupsList)
    }, [publicGroupsList])
    
    
    

    const handleGroup = (groupId) => {
        addGroup(groupId);
        let newGroups = []
        renderGroups.forEach((item) => {
            if (groupId === item.groupid) {
                item.status = 'padding'   
			}
            newGroups.push(item);
        });
        setRenderGroups(newGroups);
    }
    const handleSearchValue = (e) => {
        if (!(e.target.value)) {
            // getPublicGroups()
            // store.dispatch(searchLoadAction(true))
            setRenderGroups(publicGroupsList)
        } else {
            let reRenderGroups = publicGroupsList.filter((item) => {
                return item.groupname.includes(e.target.value)
            });
            setRenderGroups(reRenderGroups)
            //store.dispatch(searchPublicGroupAction(e.target.value))
        }
    }
    const handlerOnMouseEnter = (item) => {
        const tempEle = document.getElementById(item.groupid)
        if (item.status === 'join') {
            tempEle.children[0].style.visibility = 'visible'
        }
    }
    const handlerOnMouseLeave = (item) => {
        const tempEle = document.getElementById(item.groupid)
        if (item.status === 'join') {
            tempEle.children[0].style.visibility = 'hidden'
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
                    renderGroups.length > 0 && renderGroups.map((item, key) => {
                        let isJoinGroups = addedGroupsId.includes(item.groupid)
                        item.status = isJoinGroups ? 'joined' : 'join'; 
                        return (
							<Box key={item.groupid} className={classes.gItem} onMouseEnter={() => handlerOnMouseEnter(item)} onMouseLeave={() => handlerOnMouseLeave(item)}>
								{/* <Box className={classes.gAvatar}></Box> */}
								<Avatar
									className={classes.gAvatar}
									src={groupAvatar_icon}
								></Avatar>
								<Box className={classes.gInfoBox}>
									<Box>
										<Typography
											className={classes.gNameText}
										>
											{item.groupname}
										</Typography>
										<Typography className={classes.gIdText}>
											{item.groupid}
										</Typography>
									</Box>
									<Box id={item.groupid}>
										<Typography
											className={
												item.status === "joined"
													? classes.gAddedText
													: classes.gAddText
											}
											onClick={
												() => {
                                                    handleGroup(
													item.groupid,
													item.status
												)
                                                }
											}
										>
											{item.status === "joined" ? i18next.t('Joined') : i18next.t('Join')}
										</Typography>
									</Box>
								</Box>
							</Box>
						);
                    })
                }
            </Box>
        </Box>
    )
}

export default PublicGroup;
