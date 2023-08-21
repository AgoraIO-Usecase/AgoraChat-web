import React, { useEffect } from "react";
import i18next from "i18next";
import { Box, Button, Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { addContact } from "../../../../api/contactsChat/getContacts";
import newChatIcon from "../../../../assets/newchat@2x.png";
import addContactIcon from "../../../../assets/addcontact@2x.png";
import offlineImg from "../../../../assets/Offline.png";
import onlineIcon from "../../../../assets/Online.png";
import busyIcon from "../../../../assets/Busy.png";
import donotdisturbIcon from "../../../../assets/Do_not_Disturb.png";
import customIcon from "../../../../assets/custom.png";
import leaveIcon from "../../../../assets/leave.png";
import { useSelector } from "react-redux";
import { rootStore, Avatar } from "chatuim2";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      justifyContent: "center",
      flexFlow: "row wrap",
      width: "240px",
      background: "#FFFFFF"
    },
    infoBox: {
      display: "inline-block",
      textAlign: "center",
      position: "relative"
    },
    avatarImg: {
      display: "flex",
      width: "100px",
      height: "100px",
      margin: "25px auto",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "30px"
    },
    nameText: {
      Typeface: "Ping Fang SC",
      fontWeight: "Semibold(600)",
      fontSize: "20px",
      character: "0",
      color: "#0D0D0D"
    },
    idText: {
      Typeface: "Ping Fang SC",
      fontWeight: "Regular(400)",
      fontSize: "12px",
      character: "0",
      LineHeight: "20(1.667)",
      color: "#999999"
    },
    infoBtn: {
      width: "100%",
      textTransform: "none",
      marginTop: "15px",
      display: "flex",
      justifyContent: "flex-start"
    },
    infoBtnText: {
      Typeface: "Ping Fang SC",
      fontWeight: "Medium(500)",
      marginLeft: "8px",
      fontSize: "14px",
      character: "0",
      color: "#000000"
    },
    imgBox: {
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      background: "#fff",
      textAlign: "center",
      position: "absolute",
      right: 0,
      top: "100px"
    },
    imgStyle: {
      width: "30px",
      height: "30px",
      borderRadius: "50%"
    }
  };
});

const statusImgObj = {
  Offline: offlineImg,
  Online: onlineIcon,
  Busy: busyIcon,
  "Do not Disturb": donotdisturbIcon,
  Leave: leaveIcon,
  "": onlineIcon
};

const CustomUserProfile = ({ userId }) => {
  const classes = useStyles();
  const state = useSelector((state) => state);
  const { getUserInfoWithPresence, appUsersInfo } = rootStore.addressStore;
  const { setCurrentCvs } = rootStore.conversationStore;
  const { client } = rootStore;
  const contacts = state?.contacts || [];
  const userInfo = appUsersInfo[userId];
  let presenceExt = userInfo?.isOnline ? userInfo?.presenceExt : "Offline";

  useEffect(() => {
    if (!appUsersInfo[userId]) {
      getUserInfoWithPresence([userId]);
    }
  }, []);

  const handleClickChat = (userId) => {
    let conversationItem = {
      chatType: "singleChat",
      conversationId: userId
    };

    setCurrentCvs(conversationItem);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.infoBox}>
        <Avatar src={userInfo?.avatarurl} className={classes.avatarImg}>
          {userInfo?.nickname || userId}
        </Avatar>
        <Tooltip title={presenceExt} placement="bottom-end">
          <div className={classes.imgBox}>
            <img
              alt=""
              src={statusImgObj[presenceExt] || customIcon}
              className={classes.imgStyle}
            />
          </div>
        </Tooltip>
        <Typography className={classes.nameText}>
          {userInfo?.nickname}
        </Typography>
        <Typography className={classes.idText}>AgoraID:{userId}</Typography>
      </Box>

      {userId !== client.user &&
        (contacts.includes(userId) ? (
          <Button
            className={classes.infoBtn}
            onClick={() => handleClickChat(userId)}
          >
            <img src={newChatIcon} alt="chat" style={{ width: "30px" }} />
            <Typography className={classes.infoBtnText}>
              {i18next.t("Chat")}
            </Typography>
          </Button>
        ) : (
          <Button
            className={classes.infoBtn}
            onClick={() => {
              addContact(userId, "hi");
            }}
          >
            <img
              src={addContactIcon}
              alt="new chat"
              style={{ width: "30px" }}
            />
            <Typography className={classes.infoBtnText}>
              {i18next.t("Add Contact")}
            </Typography>
          </Button>
        ))}
    </Box>
  );
};

export default CustomUserProfile;
