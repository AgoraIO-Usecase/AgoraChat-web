import React from 'react'
import i18next from "i18next";
import { Box, List, ListItem, ListItemText, Button } from "@material-ui/core"
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
const useStyles = makeStyles((theme) => {
    return ({
        gUserName: {
            width: '100%',
            textAlign: 'left',
            textTransform: 'none',
            fontSize: '16px'
        },
        gOwner: {
            textAlign: 'right',
            color: '#999999'
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
    })
});

const AllowList = () => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const groupAllowList = state?.groups?.groupAllowList
    const groupOwner = state?.groups?.groupsInfo?.owner
    return (
        <Box>
            {groupAllowList.length > 0 ? <List>
                {groupAllowList.map((item, key) => {
                    let owner = item === groupOwner
                    return <ListItem key={key}>
                        <Button className={classes.gUserName}>
                            <Box
                                className={
                                classes.gMemberAvatar
                                }
                            ></Box>
                            < ListItemText>
                                {item}
                            </ListItemText>
                        </Button>
                        {owner && <ListItemText className={classes.gOwner}>{i18next.t('owner')}</ListItemText>}
                    </ListItem>
                })}
            </List> : <Typography className={classes.noDataText}></Typography>}
        </Box>
    )
}
export default AllowList;