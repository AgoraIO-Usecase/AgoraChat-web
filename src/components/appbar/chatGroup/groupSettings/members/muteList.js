import React from 'react'
import { Box, List, ListItem, ListItemText, Button, Avatar } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { userAvatar } from '../../../../../utils'

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


const MuteList = ({ newMuteList }) => {
    const classes = useStyles();
    return (
        <Box>
            {newMuteList.length > 0 ? <List>
                {newMuteList.map((item, key) => {
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
                    </ListItem>
                })}
            </List> : <Typography className={classes.noDataText}></Typography>}
        </Box>
    )
}

export default MuteList;