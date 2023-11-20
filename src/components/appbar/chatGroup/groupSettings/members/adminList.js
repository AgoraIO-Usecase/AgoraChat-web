import { useSelector } from "react-redux";
import { List, ListItem, ListItemText, Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import i18next from "i18next";
import { userAvatar } from "../../../../../utils";
import { rootStore, Avatar } from "chatuim2";
const useStyles = makeStyles((theme) => {
  return {
    gUserName: {
      width: "100%",
      textAlign: "left",
      textTransform: "none",
      fontSize: "16px"
    },
    gOwner: {
      textAlign: "right",
      color: "#999999"
    },
    gMemberAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "20px",
      marginRight: "10px"
    },
    userItem: {
      width: "100%",
      textTransform: "none",
      display: "flex",
      justifyContent: "space-between",
      paddingTop: "0px",
      paddingBottom: "0px",
      "& .MuiButton-root:hover": {
        background: "#F6F7F8"
      }
    }
  };
});

const AdminList = () => {
  const classes = useStyles();
  const state = useSelector((state) => state);
  const owner = state?.groups?.groupsInfo?.owner;
  const admins = state?.groups?.groupAdmins;
  const { addressStore, client } = rootStore;
  const { appUsersInfo } = addressStore;
  return (
    <List>
      <ListItem disablepadding="true" className={classes.userItem}>
        <Button className={classes.gUserName}>
          <Box className={classes.gMemberAvatar}>
            <Avatar
              style={{ width: "36px", height: "36px" }}
              src={appUsersInfo[owner]?.avatarurl}
            >
              {appUsersInfo[owner]?.nickname || owner}
            </Avatar>
          </Box>
          <ListItemText>{owner}</ListItemText>
        </Button>
        <ListItemText className={classes.gOwner}>
          {i18next.t("owner")}
        </ListItemText>
      </ListItem>
      {admins.length > 0 &&
        admins.map((item, key) => {
          return (
            <ListItem key={key} disablePadding>
              <Button className={classes.gUserName}>
                <Box className={classes.gMemberAvatar}>
                  <Avatar
                    style={{ width: "36px", height: "36px" }}
                    src={appUsersInfo[item]?.avatarurl}
                  >
                    {appUsersInfo[item]?.nickname || item}
                  </Avatar>
                </Box>
                <ListItemText>{item}</ListItemText>
              </Button>
            </ListItem>
          );
        })}
    </List>
  );
};
export default AdminList;
