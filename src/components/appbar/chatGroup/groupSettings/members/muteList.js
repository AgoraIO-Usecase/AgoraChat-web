import React from "react";
import { Box, List, ListItem, ListItemText, Button } from "@material-ui/core";
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
    noDataText: {
      color: "#999999",
      fontSize: "14px",
      textAlign: "center"
    },
    gMemberAvatar: {
      width: "36px",
      height: "36px",
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

const MuteList = ({ newMuteList }) => {
  const classes = useStyles();
  const { addressStore } = rootStore;
  const { appUsersInfo } = addressStore;
  return (
    <Box>
      {newMuteList.length > 0 ? (
        <List>
          {newMuteList.map((item, key) => {
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

export default MuteList;
