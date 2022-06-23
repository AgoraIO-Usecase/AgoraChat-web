import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Box, List, ListItem, ListItemText, Button, Menu, MenuItem, Avatar } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { onChangeGroupBlock } from '../../../../../api/groupChat/groupBlock'
import SecondConfirmDialog from "../../../../common/secondConfirmDialog"
import { userAvatar } from '../../../../../utils'

const useStyles = makeStyles((theme) => {
    return ({
        moreMenus: {
            transform: 'rotate(90deg)',
            cursor: 'pointer'
        },
        gUserName: {
            width: '100%',
            textAlign: 'left',
            textTransform: 'none',
            fontSize: '16px'
        },
        noDataText: {
            color: '#999999',
            fontSize: '14px',
            textAlign: 'center'
        },
        gMemberAvatar: {
            width: "36px",
            height: "36px",
            borderRadius: "20px",
            backgroundColor: "rgb(238, 171, 159)",
            marginRight: '10px',
        },
        userItem: {
            width: "100%",
            textTransform: "none",
            display: "flex",
            justifyContent: "space-between",
            paddingTop: '0px',
            paddingBottom: '0px',
            '& .MuiButton-root:hover': {
              background: '#F6F7F8',
            }
        },
    })
});

const BlockList = () => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const groupId = state?.groups?.groupsInfo?.id
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState('')
    const groupBlockList = state?.groups?.groupBlockList
    const [secondSure, setSecondSure] = useState(false)

    const handleClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(item)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const showSecondDialog = () => {
		setSecondSure(true)
        handleClose()
	}
    const confirmQuitGroup = () => {
        onChangeGroupBlock(
            groupId,
            selectedUser,
            'move',
            handleClose
        );
		setSecondSure(false)
    }
    return (
        <Box>
            {
                groupBlockList.length > 0 ? <List>
                    {groupBlockList.map((item, key) => {
                        return <ListItem key={key} className={classes.userItem}>
                            <Button className={classes.gUserName} >
                                <Box
                                    className={
                                    classes.gMemberAvatar
                                    }
                                >
                                    <Avatar src={userAvatar(item)} />
                                </Box>
                                < ListItemText>
                                    {item}
                                </ListItemText>
                            </Button>
                            <ListItemText id="user-more" className={classes.moreMenus} onClick={(event) => handleClick(event, item)}>...</ListItemText>
                            <Menu
                                id="user-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem>
                                    <Typography variant="inherit" noWrap onClick={() => showSecondDialog()}>
                                        {i18next.t('Move to Blocked List')}
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </ListItem>
                    })}
                </List> : <Typography className={classes.noDataText}></Typography>
            }
            <SecondConfirmDialog
            open={Boolean(secondSure)}
            onClose={() => setSecondSure(false)}
            confirmMethod={() => confirmQuitGroup()}
            confirmContent={{
                content: 'Move to Blocked List'
            }}
            ></SecondConfirmDialog>
        </Box>
    )
}
export default BlockList;