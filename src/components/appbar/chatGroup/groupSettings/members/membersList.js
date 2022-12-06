import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import i18next from "i18next";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Menu,
  MenuItem,
  Typography,
  Avatar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import WebIM from "../../../../../utils/WebIM";
import { onChengeGroupAdmin } from "../../../../../api/groupChat/groupAdmin";
import { onChangeGroipMute } from "../../../../../api/groupChat/groupMute";
import { onChangeGroupBlock } from "../../../../../api/groupChat/groupBlock";
import {
  rmGroupWhiteUser,
  addGroupWhiteUser,
} from "../../../../../api/groupChat/groupWhite";
import { rmGroupUser } from "../../../../../api/groupChat/closeGroup";
import _ from "lodash";
import { userAvatar } from '../../../../../utils'
import adminIcon from "../../../../../assets/admin@2x.png";
import muteIcon from "../../../../../assets/mute@2x.png";
import blockIcon from "../../../../../assets/block@2x.png";
import allowIcon from "../../../../../assets/allow_search@2x.png";
import deleteIcon from "../../../../../assets/red@2x.png";
import SecondConfirmDialog from "../../../../common/secondConfirmDialog"
import moreMenu from '../../../../../assets/menu@2x.png'
const useStyles = makeStyles((theme) => {
  return {
    moreMenus: {
      // transform: "rotate(90deg)",
      cursor: "pointer",
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
    gUserName: {
      width: "100%",
      textAlign: "left",
      textTransform: "none",
      fontSize: "16px",
      borderRadius: "12px",
    },
    gOwner: {
      textAlign: "right",
      color: "#999999",
    },
    iconStyle: {
      width: "30px",
      height: "30px",
    },
    menusName: {
      typeface: "Ping Fang SC",
      fontWeight: "Medium (500)",
      fontSize: "14px",
      color: "#000000",
    },
    myselfMenu: {
      '& .MuiMenu-paper': {
        borderRadius: '12px',
      },
      '& .MuiList-padding': {
        padding: '8px',
      },
      '& .MuiMenuItem-root:hover': {
        borderRadius: '8px',
      },
      '& .MuiListItem-gutters': {
        paddingLeft: '6px',
      }
    },
    gMemberAvatar: {
			width: "36px",
			height: "36px",
			borderRadius: "20px",
			backgroundColor: "rgb(238, 171, 159)",
      marginRight: '10px',
		},
    imgActive: {
      borderRadius: '50%',
      width: '32px',
      height: '32px',
    },
    imgActiveBgc: {
      background: '#fff',
    },
    moreText: {
      height: '32px',
      padding: '0',
      borderRadius: '50%',
      minWidth: '32px',
      lineHeight: '10px',
      '&:hover': {
        background: '#fff !important',
      }
    }
  };
});

const MembersList = ({ newMuteList, inputVal }) => {
  const classes = useStyles();
  const state = useSelector((state) => state);
  const groupsInfo = state?.groups?.groupsInfo || {};
  const groupAdmins = state?.groups?.groupAdmins || [];
  const groupAllowList = state?.groups?.groupAllowList || [];
  const members = groupsInfo?.affiliations || [];
  const loginUser = WebIM.conn.context?.userId;
  const groupOwner = groupsInfo?.owner;
  const groupId = groupsInfo?.id;
  const isOwner = loginUser === groupOwner;
  const isAdmins = groupAdmins.includes(loginUser) || loginUser === groupOwner;
  const [newMembers, setNewMembers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [secondSure, setSecondSure] = useState(false)
	const [GroupStatus, setGroupStatus] = useState('')
	const [groupContent, setgroupContent] = useState('')
	const [action, setAction] = useState('')
  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(item);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlerMemers = () => {
    let _owner = [];
    let _member = [];
    members.forEach((item) => {
      if (item.owner) {
        _owner.push(item.owner);
      } else if (item.member) {
        _member.push(item.member);
      }
      setNewMembers(_.concat(_owner, _member));
    });
  }
  useEffect(() => {
    members.length > 0 && handlerMemers()
  }, [members.length]);
  useEffect(() => {
    if (inputVal) {
      const tempArr = []
      newMembers.forEach(item => {
        if (item.includes(inputVal)) {
          tempArr.push(item)
        }
      })
      setNewMembers(tempArr)
    } else {
      handlerMemers()
    }
  }, [inputVal])
  const showSecondDialog = (val, action, text) => {
		setGroupStatus(val)
    action && setAction(action)
    setgroupContent(text)
		setSecondSure(true)
    handleClose()
	}
  const confirmQuitGroup = () => {
		if (GroupStatus === 1) {
      onChengeGroupAdmin(
        groupId,
        selectedUser,
        action,
        handleClose
      );
    } else if (GroupStatus === 2) {
      onChangeGroipMute(
        groupId,
        selectedUser,
        action,
        handleClose
      );
    } else if (GroupStatus === 3) {
      onChangeGroupBlock(
        groupId,
        selectedUser,
        action,
        handleClose
      );
    } else if (GroupStatus === 4) {
      rmGroupWhiteUser(
        groupId,
        selectedUser,
        handleClose
      );
    } else if (GroupStatus === 5) {
      addGroupWhiteUser(
        groupId,
        selectedUser,
        handleClose
      );
    } else if (GroupStatus === 6) {
      rmGroupUser(groupId, selectedUser, handleClose)
    }
		setSecondSure(false)
	}
  return (
    <>
    <Box>
      {newMembers.length > 0 &&
        newMembers.map((item, key) => {
          let owner = groupOwner === item ? `${i18next.t("owner")}` : "";
          let lander = loginUser === item;
          return (
            <List key={key}>
              <ListItem disablepadding="true" className={classes.userItem}>
                <Button className={classes.gUserName}>
                  <Box
                    className={
                      classes.gMemberAvatar
                    }>
                      <Avatar src={userAvatar(item)} />
                    </Box>
                  <ListItemText>{item}</ListItemText>
                  {owner && (
                    <ListItemText className={classes.gOwner}>
                      {owner}
                    </ListItemText>
                  )}
                  {isAdmins && !owner && !lander && (
                  <Button className={classes.moreText}>
                    <span
                      id="user-more"
                      className={classes.moreMenus}
                      onClick={(event) => handleClick(event, item)}
                    >
                      <img src={moreMenu} alt="menu" className={`${classes.imgActive} ${Boolean(anchorEl) ? classes.imgActiveBgc : ''}`} />
                    </span>
                    <Menu
                      id="user-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      className={classes.myselfMenu}
                    >
                      {isOwner && (
                        <MenuItem onClick={() => groupAdmins.includes(selectedUser) ? showSecondDialog(1, "move", "Move Admin"): showSecondDialog(1, "make", "Make Admin")}>
                          <img
                            src={adminIcon}
                            alt="admin"
                            className={classes.iconStyle}
                          />
                          {groupAdmins.includes(selectedUser) ? (
                            <Typography
                              variant="inherit"
                              noWrap
                              className={classes.menusName}
                            >
                              {i18next.t("Move Admin")}
                            </Typography>
                          ) : (
                            <Typography
                              variant="inherit"
                              noWrap
                              className={classes.menusName}
                            >
                              {i18next.t("Make Admin")}
                            </Typography>
                          )}
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => newMuteList.includes(selectedUser) ? showSecondDialog(2, "move", "Remove from Muted List"): showSecondDialog(2, "make", "Move to Muted List")}>
                        <img
                          src={muteIcon}
                          alt="mute"
                          className={classes.iconStyle}
                        />
                        {newMuteList.includes(selectedUser) ? (
                          <Typography
                            variant="inherit"
                            noWrap
                            className={classes.menusName}
                          >
                            {i18next.t("Remove from Muted List")}
                          </Typography>
                        ) : (
                          <Typography
                            variant="inherit"
                            noWrap
                            className={classes.menusName}
                          >
                            {i18next.t("Move to Muted List")}
                          </Typography>
                        )}
                      </MenuItem>
                      <MenuItem onClick={() => showSecondDialog(3, "make", "Move to Blocked List")}>
                        <img
                          src={blockIcon}
                          alt="block"
                          className={classes.iconStyle}
                        />
                        <Typography
                          variant="inherit"
                          noWrap
                          className={classes.menusName}
                        >
                          {i18next.t("Move to Blocked List")}
                        </Typography>
                      </MenuItem>
                      <MenuItem onClick={() => groupAllowList.includes(selectedUser) ? showSecondDialog(4, null, "Remove from Allowed List"): showSecondDialog(5, null, "Move to Allowed List")}>
                        <img
                          src={allowIcon}
                          alt="allow"
                          className={classes.iconStyle}
                        />
                        {groupAllowList.includes(selectedUser) ? (
                          <Typography
                            variant="inherit"
                            noWrap
                            className={classes.menusName}
                          >
                            {i18next.t("Remove from Allowed List")}
                          </Typography>
                        ) : (
                          <Typography
                            variant="inherit"
                            noWrap
                            className={classes.menusName}
                          >
                            {i18next.t("Move to Allowed List")}
                          </Typography>
                        )}
                      </MenuItem>
                      <MenuItem onClick={() => showSecondDialog(6, null, "Remove")}>
                        <img
                          src={deleteIcon}
                          alt="delete"
                          className={classes.iconStyle}
                        />
                        <Typography
                          variant="inherit"
                          noWrap
                          className={classes.menusName}
                        >
                          {i18next.t("Remove The Member")}
                        </Typography>
                      </MenuItem>
                    </Menu>
                  </Button>
                )}
                </Button>
              </ListItem>
            </List>
          );
        })}
    </Box>
    <SecondConfirmDialog
      open={Boolean(secondSure)}
      onClose={() => setSecondSure(false)}
      confirmMethod={() => confirmQuitGroup()}
      confirmContent={{
        content: groupContent
      }}
    ></SecondConfirmDialog>
  </>
  );
};

export default MembersList;
