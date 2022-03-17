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
        }
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
                            < ListItemText>
                                {item}
                            </ListItemText>
                        </Button>
                        {owner && <ListItemText className={classes.gOwner}>{i18next.t('owner')}</ListItemText>}
                    </ListItem>
                })}
            </List> : <Typography className={classes.noDataText}>暂无数据</Typography>}
        </Box>
    )
}
export default AllowList;