import { useSelector } from 'react-redux'
import { List, ListItem, ListItemText, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import i18next from "i18next";

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
        }
    })
});



const AdminList = () => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const owner = state?.groups?.groupsInfo?.owner
    const admins = state?.groups?.groupAdmins
    return (
        <List>
            <ListItem disablepadding="true">
                <Button className={classes.gUserName}>
                    <ListItemText>{owner}</ListItemText>
                </Button>
                <ListItemText className={classes.gOwner}>{i18next.t('owner')}</ListItemText>
            </ListItem>
            {admins.length > 0 && admins.map((item,key)=>{
                return <ListItem key={key} disablePadding>
                    <Button className={classes.gUserName}>
                        <ListItemText>{item}</ListItemText>
                    </Button>
                </ListItem>
            })}
        </List>
    )
}
export default AdminList;