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

import adminIcon from "../../../../../assets/admin@2x.png";
import muteIcon from "../../../../../assets/mute@2x.png";
import blockIcon from "../../../../../assets/block@2x.png";
import allowIcon from "../../../../../assets/allow_search@2x.png";
import deleteIcon from "../../../../../assets/red@2x.png";

const useStyles = makeStyles((theme) => {
  return {
    moreMenus: {
      transform: "rotate(90deg)",
      cursor: "pointer",
    },
    userItem: {
      width: "100%",
      textTransform: "none",
      display: "flex",
      justifyContent: "space-between",
    },
    gUserName: {
      width: "100%",
      textAlign: "left",
      textTransform: "none",
      fontSize: "16px",
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
  };
});

const MembersList = ({ newMuteList }) => {
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
  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(item);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let _owner = [];
    let _member = [];
    members.length > 0 &&
      members.forEach((item) => {
        if (item.owner) {
          _owner.push(item.owner);
        } else if (item.member) {
          _member.push(item.member);
        }
        setNewMembers(_.concat(_owner, _member));
      });
  }, [members.length]);

  return (
    <Box>
      {newMembers.length > 0 &&
        newMembers.map((item, key) => {
          let owner = groupOwner === item ? `${i18next.t("owner")}` : "";
          let lander = loginUser === item;
          return (
            <List key={key}>
              <ListItem disablepadding="true" className={classes.userItem}>
                <Button className={classes.gUserName}>
                  <ListItemText>{item}</ListItemText>
                  {owner && (
                    <ListItemText className={classes.gOwner}>
                      {owner}
                    </ListItemText>
                  )}
                </Button>
                {isAdmins && !owner && !lander && (
                  <Button>
                    <ListItemText
                      id="user-more"
                      className={classes.moreMenus}
                      onClick={(event) => handleClick(event, item)}
                    >
                      ...
                    </ListItemText>
                    <Menu
                      id="user-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      {isOwner && (
                        <MenuItem>
                          <img
                            src={adminIcon}
                            alt="admin"
                            className={classes.iconStyle}
                          />
                          {groupAdmins.includes(selectedUser) ? (
                            <Typography
                              variant="inherit"
                              noWrap
                              onClick={() => {
                                onChengeGroupAdmin(
                                  groupId,
                                  selectedUser,
                                  "move",
                                  handleClose
                                );
                              }}
                              className={classes.menusName}
                            >
                              {i18next.t("Move Admin")}
                            </Typography>
                          ) : (
                            <Typography
                              variant="inherit"
                              noWrap
                              onClick={() => {
                                onChengeGroupAdmin(
                                  groupId,
                                  selectedUser,
                                  "make",
                                  handleClose
                                );
                              }}
                              className={classes.menusName}
                            >
                              {i18next.t("Make Admin")}
                            </Typography>
                          )}
                        </MenuItem>
                      )}
                      <MenuItem>
                        <img
                          src={muteIcon}
                          alt="mute"
                          className={classes.iconStyle}
                        />
                        {newMuteList.includes(selectedUser) ? (
                          <Typography
                            variant="inherit"
                            noWrap
                            onClick={() => {
                              onChangeGroipMute(
                                groupId,
                                selectedUser,
                                "move",
                                handleClose
                              );
                            }}
                            className={classes.menusName}
                          >
                            {i18next.t("Move to Muted List")}
                          </Typography>
                        ) : (
                          <Typography
                            variant="inherit"
                            noWrap
                            onClick={() => {
                              onChangeGroipMute(
                                groupId,
                                selectedUser,
                                "make",
                                handleClose
                              );
                            }}
                            className={classes.menusName}
                          >
                            {i18next.t("Make to Muted List")}
                          </Typography>
                        )}
                      </MenuItem>
                      <MenuItem>
                        <img
                          src={blockIcon}
                          alt="block"
                          className={classes.iconStyle}
                        />
                        <Typography
                          variant="inherit"
                          noWrap
                          onClick={() => {
                            onChangeGroupBlock(
                              groupId,
                              selectedUser,
                              "make",
                              handleClose
                            );
                          }}
                          className={classes.menusName}
                        >
                          {i18next.t("Make to Blocked List")}
                        </Typography>
                      </MenuItem>
                      <MenuItem>
                        <img
                          src={allowIcon}
                          alt="allow"
                          className={classes.iconStyle}
                        />
                        {groupAllowList.includes(selectedUser) ? (
                          <Typography
                            variant="inherit"
                            noWrap
                            onClick={() => {
                              rmGroupWhiteUser(
                                groupId,
                                selectedUser,
                                handleClose
                              );
                            }}
                            className={classes.menusName}
                          >
                            {i18next.t("Move to Allowed List")}
                          </Typography>
                        ) : (
                          <Typography
                            variant="inherit"
                            noWrap
                            onClick={() => {
                              addGroupWhiteUser(
                                groupId,
                                selectedUser,
                                handleClose
                              );
                            }}
                            className={classes.menusName}
                          >
                            {i18next.t("Make to Allowed List")}
                          </Typography>
                        )}
                      </MenuItem>
                      <MenuItem>
                        <img
                          src={deleteIcon}
                          alt="delete"
                          className={classes.iconStyle}
                        />
                        <Typography
                          variant="inherit"
                          noWrap
                          onClick={() =>
                            rmGroupUser(groupId, selectedUser, handleClose)
                          }
                          className={classes.menusName}
                        >
                          {i18next.t("Remove")}
                        </Typography>
                      </MenuItem>
                    </Menu>
                  </Button>
                )}
              </ListItem>
            </List>
          );
        })}
    </Box>
  );
};

export default MembersList;
