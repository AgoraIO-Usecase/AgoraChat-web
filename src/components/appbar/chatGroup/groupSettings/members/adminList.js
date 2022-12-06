import { useSelector } from 'react-redux'
import { List, ListItem, ListItemText, Button, Box, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import i18next from "i18next";
import { userAvatar } from '../../../../../utils'

const useStyles = makeStyles((theme) => {
    return ({
        gUserName:{
            width:'100%',
            textAlign:'left',
            textTransform:'none',
            fontSize:'16px'
        },
        gOwner: {
            textAlign: 'right',
            color: '#999999',
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



const AdminList = () => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const owner = state?.groups?.groupsInfo?.owner
    const admins = state?.groups?.groupAdmins
    return (
        <List>
            <ListItem disablepadding="true" className={classes.userItem}>
                <Button className={classes.gUserName}>
                    <Box className={classes.gMemberAvatar}>
                        <Avatar src={userAvatar(owner)} />
                    </Box>
                    <ListItemText>{owner}</ListItemText>
                </Button>
                <ListItemText className={classes.gOwner}>{i18next.t('owner')}</ListItemText>
            </ListItem>
            {admins.length > 0 && admins.map((item,key)=>{
                return <ListItem key={key} disablePadding>
                    <Button className={classes.gUserName}>
                        <Box className={classes.gMemberAvatar}>
                            <Avatar src={userAvatar(item)} />
                        </Box>
                        <ListItemText>{item}</ListItemText>
                    </Button>
                </ListItem>
            })}
        </List>
    )
}
export default AdminList;