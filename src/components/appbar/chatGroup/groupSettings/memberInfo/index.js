import React, { memo, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, InputBase, Typography } from "@material-ui/core";
import i18next from "i18next";
import { rootStore } from "chatuim2";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => {
  return {
    titleBox: {
      background: "#F6F7F8",
      opacity: "100%",
      height: "60px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 24px 0 18px !important"
    },
    titleStyle: {
      fontFamily: "Roboto",
      fontWeight: "600",
      fontSize: "16px",
      color: "#000000"
    },
    infoBox: {
      display: "flex",
      marginTop: "20px",
      borderRadius: "16px",
      background: "#F4F5F7",
      margin: "16px 8px",
      padding: "8px !important",
      alignItems: "center"
    },
    countWrap: {
      minWidth: "35px",
      fontSize: "16px",
      lineHeight: "24px",
      marginRight: "16px",
      color: "#919BA1"
    },
    editBtn: {
      color: "#009EFF",
      fontSize: "16px",
      cursor: "pointer"
    },
    doneBtn: {
      color: (props) => {
        return props.value?.length > 0 ? "#009EFF" : "#919BA1";
      },
      cursor: "pointer"
    }
  };
});

const maxLength = 50;

const MemberInfo = () => {
  const state = useSelector((state) => state);
  const groupsInfo = state?.groups?.groupsInfo || {};
  const groupId = groupsInfo?.id;
  const [value, setValue] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const classes = useStyles({ value });
  const { client } = rootStore;

  const getMemberAttr = () => {
    client
      .getGroupMemberAttributes({ groupId, userId: client.user })
      .then((res) => {
        if (res.data) {
          setValue(res.data?.nickName || "");
        }
      });
  };

  const setMemberAttr = () => {
    if (!value) return;
    client
      .setGroupMemberAttributes({
        groupId,
        userId: client.user,
        memberAttributes: {
          nickName: value
        }
      })
      .then(() => {
        setEditStatus(false);
      });
  };

  useEffect(() => {
    getMemberAttr();
  }, []);

  return (
    <Box>
      <Box className={classes.titleBox}>
        <Typography className={classes.titleStyle}>
          {i18next.t("My Alias in Group")}
        </Typography>
      </Box>
      <Box className={classes.infoBox}>
        <InputBase
          value={value}
          inputProps={{ maxLength: maxLength }}
          disabled={!editStatus}
          fullWidth
          onInput={(e) => {
            setValue(e.target.value);
          }}
          placeholder={i18next.t("Nick name in the group")}
        ></InputBase>
        <Box className={classes.countWrap}>
          <p>{`${value.length}/${maxLength}`}</p>
        </Box>
        <div>
          {editStatus ? (
            <Box className={classes.doneBtn}>
              <div
                onClick={() => {
                  setMemberAttr();
                }}
              >
                Done
              </div>
            </Box>
          ) : (
            <Box className={classes.editBtn}>
              <div
                onClick={() => {
                  setEditStatus(true);
                }}
              >
                Edit
              </div>
            </Box>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default memo(MemberInfo);
