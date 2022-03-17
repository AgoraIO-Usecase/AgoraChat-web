import React from 'react'
import { Box, List, ListItem, ListItemText, Button } from "@material-ui/core"
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
        noDataText: {
            color: '#999999',
            fontSize: '14px',
            textAlign: 'center'
        }
    })
});


const MuteList = ({ newMuteList }) => {
    const classes = useStyles();
    return (
        <Box>
            {newMuteList.length > 0 ? <List>
                {newMuteList.map((item, key) => {
                    return <ListItem key={key}>
                        <Button className={classes.gUserName} >
                            < ListItemText>
                                {item}
                            </ListItemText>
                        </Button>
                    </ListItem>
                })}
            </List> : <Typography className={classes.noDataText}>暂无数据</Typography>}
        </Box>
    )
}

export default MuteList;