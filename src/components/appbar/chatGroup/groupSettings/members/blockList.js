import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Box, List, ListItem, ListItemText, Button, Menu, MenuItem } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { onChangeGroupBlock } from '../../../../../api/groupChat/groupBlock'

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
        }
    })
});

const BlockList = () => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const groupId = state?.groups?.groupsInfo?.id
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState('')
    const groupBlockList = state?.groups?.groupBlockList
    const handleClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(item)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            {
                groupBlockList.length > 0 ? <List>
                    {groupBlockList.map((item, key) => {
                        return <ListItem key={key}>
                            <Button className={classes.gUserName} >
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
                                    <Typography variant="inherit" noWrap onClick={() => { onChangeGroupBlock(
                                      groupId,
                                      selectedUser,
                                      "move",
                                      handleClose
                                    ); }}>
                                        {i18next.t('Move to Blocked List')}
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </ListItem>
                    })}
                </List> : <Typography className={classes.noDataText}>暂无数据</Typography>
            }
        </Box>
    )
}
export default BlockList;