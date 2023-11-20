import React, { useEffect, useState, memo, createRef } from "react";
import CommonDialog from "../common/dialog";
import {
  Box,
  ListItemAvatar,
  ListItem,
  List,
  InputBase,
  Button
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import i18next from "i18next";
import Loading from "../common/loading";
import search_icon from "../../assets/search.png";
import getGroups from "../../api/groupChat/getGroups";
import { Avatar, rootStore } from "chatuim2";
const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: theme.spacing(50),
      // maxHeight: '70vh',
      // minHeight: '35vh',
      height: "590px",
      margin: 0,
      padding: "15px 10px",
      overflowX: "hidden",
      boxSizing: "border-box"
    },
    navigation: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 10px",
      fontSize: "18px",
      color: "#000000",
      "& li": {
        listStyle: "none",
        cursor: "pointer",
        flex: 1,
        textAlign: "center",
        height: "24px",
        boxSizing: "border-box",
        "&:hover": {
          color: "#009EFF"
          // borderBottom: '2px solid #009EFF'
        }
      }
    },
    navigationActive: {
      color: "#009EFF",
      borderBottom: "2px solid #009EFF"
    },
    listItemContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      color: "#B3B3B3"
    },
    listLine: {
      borderTop: "1px solid #CCCCCC",
      width: "100%"
    },
    listItem: {
      height: theme.spacing(7.5),
      width: theme.spacing(50),
      maxWidth: "100%",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      padding: 0,
      color: "#0D0D0D",
      borderRadius: "8px",
      paddingLeft: "10px"
    },
    itemBox: {
      height: "100%",
      display: "flex",
      flex: 1,
      alignItems: "center",
      boxSizing: "border-box",
      position: "relative"
    },
    statusImg: {
      position: "absolute",
      bottom: "10px",
      left: theme.spacing(3.2),
      zIndex: 1,
      width: "18px",
      height: "18px"
    },
    avatar: {
      height: theme.spacing(4.5),
      width: theme.spacing(4.5)
    },
    MuiListItemTextSecondary: {
      color: "red"
    },
    textBox: {
      display: "flex",
      justifyContent: "space-between",
      flex: "1"
    },
    itemName: {
      fontSize: "16px",
      overflow: "hidden"
    },
    serchContainer: {
      padding: "0 10px"
    },
    baseInput: {
      color: "#000000",
      width: theme.spacing(40),
      border: "none",
      padding: "2px 10px",
      outline: "none",
      fontSize: "18px"
    },
    baseInputLabel: {
      fontSize: "18px"
    },
    // group
    inputBox: {
      display: "flex",
      alignItems: "center",
      background: "#F4F5F7",
      borderRadius: "23px",
      height: "36px",
      lineHeight: "36px"
    },
    inputSearch: {
      width: "90%",
      height: "22px",
      fontSize: "16px",
      lineHeight: "22px",
      cursor: "pointer",
      padding: "6px 5px 7px"
    },
    searchImg: {
      width: "18px",
      height: "18px",
      paddingLeft: "8px"
    },
    gItem: {
      height: "590px",
      overflowY: "scroll",
      overflowX: "hidden"
    },
    gInfoBox: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer"
    },
    gAvatar: {
      width: "50px",
      height: "50px",
      lineHeight: "50px"
      // backgroundColor: '#FF9F4D',
    },
    gName: {
      // borderRadius: '16px',
      margin: "0 10px",
      width: "100%",
      textAlign: "left",
      textTransform: "none",
      fontSize: "16px",
      display: "inherit",
      borderRadius: "8px"
    },
    gNameText: {
      typeface: "Ping Fang SC",
      fontWeight: "Semibold (600)",
      fontSize: "16px",
      character: "0",
      color: "#0D0D0D",
      height: "48px",
      lineHeight: "48px",
      overflowX: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "pre-wrap",
      width: "400px"
    }
  };
});

function CombineDialog(props) {
  const { open, onClose, onClickItem } = props;
  const classes = useStyles();
  const state = useSelector((state) => state);
  const contacts = useSelector((state) => state?.contacts) || [];
  const [contactList, setContactList] = useState([]);
  const presenceList = useSelector((state) => state?.presenceList) || [];
  const [userInfoObj, setUserInfoObj] = useState({});
  const { appUsersInfo } = rootStore.addressStore;

  let getcontactsInfo = () => {
    let usersInfoData = JSON.parse(localStorage.getItem("usersInfo_1.0")) || [];
    usersInfoData.length > 0 &&
      usersInfoData.map((item) => {
        return setUserInfoObj(
          Object.assign(userInfoObj, { [item.username]: item.userAvatar })
        );
      });
  };

  let contactsData = contacts.map((user) => {
    return {
      name: user,
      jid: user,
      avatar: userInfoObj[user]
        ? userInfoObj[user]
        : Math.ceil(Math.random() * 7)
    };
  });

  const handleClick = (itemData) => {
    onClickItem(itemData);
    onClose?.();
  };

  const handleChange = (e) => {
    let serchValue = e.target.value;

    let serchContact = contactsData.filter((user) => {
      if (user.name.includes(serchValue)) {
        return true;
      }
      return false;
    });
    let serchList = getBrands(serchContact);
    setContactList(serchList);
  };

  const inputEl = createRef();
  useEffect(() => {
    inputEl.current && inputEl.current.focus();
  }, [open]);

  const [activeTable, setActiveTable] = useState("contact");
  const changeTab = (tab) => {
    return () => {
      setActiveTable(tab);
    };
  };

  // -------------- group ----------------

  useEffect(() => {
    getGroups();
  }, []);
  const groupList = state?.groups?.groupList || [];
  const isSearching = state?.isSearching || false;
  const [renderGroups, setRenderGroups] = useState([...groupList]);
  useEffect(() => {
    setRenderGroups(groupList);
  }, [groupList]);

  const handleSearchValue = (e) => {
    if (!e.target.value) {
      setRenderGroups(groupList);
    } else {
      let reRenderGroups = groupList.filter((item) => {
        return item.groupname.includes(e.target.value);
      });
      setRenderGroups(reRenderGroups);
    }
  };

  function renderGroup() {
    return (
      <Box style={{ display: activeTable == "contact" ? "none" : "block" }}>
        <Box className={classes.inputBox}>
          <img src={search_icon} alt="" className={classes.searchImg} />
          <InputBase
            type="search"
            placeholder="Search"
            className={classes.inputSearch}
            onChange={handleSearchValue}
          />
        </Box>
        <Loading show={isSearching} />
        <List className={classes.gItem}>
          {renderGroups.length > 0 &&
            renderGroups.map((item, key) => {
              return (
                <ListItem className={classes.gInfoBox} key={key}>
                  <Avatar className={classes.gAvatar}>{item.groupname}</Avatar>

                  <Box
                    style={{ flex: "1" }}
                    onClick={() => {
                      handleClick(item);
                    }}
                  >
                    <Button className={classes.gName}>
                      <Typography className={classes.gNameText}>
                        {item.groupname}
                      </Typography>
                    </Button>
                  </Box>
                </ListItem>
              );
            })}
        </List>
      </Box>
    );
  }

  function renderContent() {
    return (
      <div className={classes.root}>
        <ul className={classes.navigation}>
          <li
            className={
              activeTable === "contact" ? classes.navigationActive : null
            }
            onClick={changeTab("contact")}
          >
            Contact
          </li>
          <li
            className={
              activeTable === "group" ? classes.navigationActive : null
            }
            onClick={changeTab("group")}
          >
            Chat Group
          </li>
        </ul>
        {renderGroup()}
        <div style={{ display: activeTable === "contact" ? "block" : "none" }}>
          <Box className={classes.inputBox}>
            <img src={search_icon} alt="" className={classes.searchImg} />
            <InputBase
              type="search"
              placeholder="Search"
              className={classes.inputSearch}
              onChange={handleChange}
            />
          </Box>
          <List dense>
            {contactList.map((userGroup, index) => {
              return (
                <ListItem
                  key={userGroup.id}
                  className={classes.listItemContainer}
                >
                  <Typography>{userGroup.region}</Typography>
                  <hr className={classes.listLine} />
                  {userGroup.brands.map((user) => {
                    return (
                      <ListItem
                        key={user.name}
                        onClick={() => handleClick(user)}
                        data={user.name}
                        value={user.name}
                        button
                        className={classes.listItem}
                      >
                        <Box className={classes.itemBox}>
                          <ListItemAvatar>
                            <Avatar
                              className={classes.avatar}
                              src={appUsersInfo[user.name]?.avatarurl}
                              alt={`${user.name}`}
                            >
                              {user.name}
                            </Avatar>
                          </ListItemAvatar>
                          <Box>
                            <Typography className={classes.itemName}>
                              {user.name}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    );
                  })}
                </ListItem>
              );
            })}
          </List>
        </div>
      </div>
    );
  }

  function getBrands(members) {
    const reg = /[a-z]/i;
    members.forEach((item) => {
      if (reg.test(item.name.substring(0, 1))) {
        item.initial = item.name.substring(0, 1).toUpperCase();
      } else {
        item.initial = "#";
      }
    });

    members.sort((a, b) => a.initial.charCodeAt(0) - b.initial.charCodeAt(0));

    let someTtitle = null;
    let someArr = [];
    let lastObj;
    for (var i = 0; i < members.length; i++) {
      var newBrands = { brandId: members[i].jid, name: members[i].name };

      if (members[i].initial === "#") {
        if (!lastObj) {
          lastObj = {
            id: i,
            region: "#",
            brands: []
          };
        }
        lastObj.brands.push(newBrands);
      } else {
        if (members[i].initial !== someTtitle) {
          someTtitle = members[i].initial;
          var newObj = {
            id: i,
            region: someTtitle,
            brands: []
          };
          someArr.push(newObj);
        }
        newObj.brands.push(newBrands);
      }
    }
    someArr.sort((a, b) => a.region.charCodeAt(0) - b.region.charCodeAt(0));
    if (lastObj) {
      someArr.push(lastObj);
    }
    someArr.forEach((item) => {
      item.brands.forEach((val) => {
        presenceList.length &&
          presenceList.forEach((innerItem) => {
            if (val.name === innerItem.uid) {
              val.presence = innerItem;
            }
          });
      });
    });
    return someArr;
  }

  useEffect(() => {
    let list = getBrands(contactsData);
    console.log(contactsData, "contactsDatacontactsData");
    setContactList(list);
    let infoData = [];
    contactsData.length > 0 &&
      contactsData.map((item) => {
        infoData.push({
          username: item.name,
          userAvatar: item.avatar
        });
      });
    if (infoData.length > 0) {
      localStorage.setItem("usersInfo_1.0", JSON.stringify(infoData));
    }
    getcontactsInfo();
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts.length, presenceList.length]);

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title={i18next.t("Forward To")}
      content={renderContent()}
    ></CommonDialog>
  );
}


export default memo(CombineDialog);
