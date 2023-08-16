import React from "react";
import i18next from "i18next";
import { Box, List, ListItem, ListItemText, Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
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
    noDataText: {
      color: "#999999",
      fontSize: "14px",
      textAlign: "center"
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

const AllowList = () => {
  const classes = useStyles();
  const state = useSelector((state) => state);
  const groupAllowList = state?.groups?.groupAllowList;
  const groupOwner = state?.groups?.groupsInfo?.owner;
  const { addressStore, client } = rootStore;
  const { appUsersInfo } = addressStore;
  return (
    <Box>
      {groupAllowList.length > 0 ? (
        <List>
          {groupAllowList.map((item, key) => {
            let owner = item === groupOwner;
            return (
              <ListItem key={key} className={classes.userItem}>
                <Button className={classes.gUserName}>
                  <Box className={classes.gMemberAvatar}>
                    <Avatar src={appUsersInfo[item]?.avatarurl}>
                      {appUsersInfo[item]?.nickname || item}
                    </Avatar>
                  </Box>
                  <ListItemText>{item}</ListItemText>
                </Button>
                {owner && (
                  <ListItemText className={classes.gOwner}>
                    {i18next.t("owner")}
                  </ListItemText>
                )}
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Typography className={classes.noDataText}></Typography>
      )}
    </Box>
  );
};
export default AllowList;
