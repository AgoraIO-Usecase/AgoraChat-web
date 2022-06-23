import React, { memo } from "react";
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Popover, Box, Avatar, Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import WebIM from '../../utils/WebIM'
import { deleteContact } from "../../api/contactsChat/getContacts"
import { closeGroup, transferOwner } from "../../api/groupChat/closeGroup";
import closeIcon from '../../../src/assets/close.png'
import avatar from '../../../src/assets/avatar2.jpg'
import defaultAvatar from '../../../src/assets/avatar_default.jpg'
import groupAvatar from "../../../src/assets/avatar_group.jpg";

const useStyles = makeStyles((theme) => {
    return {
        root: {
            height: "340px",
            width: "340px",
            background: "#FFFFFF",
            borderRadius: "12px"
        },
        iconBox: {
            width: "100%",
            height: "60px",
            cursor: "pointer"
        },
        iconStyle: {
            width: "32px",
            height: "32px",
            padding: "14px 14px 14px 294px",
            cursor: "pointer"
        },
        infoBox: {
            width: "100%",
            textAlign: "center"
        },
        avatarStyle: {
            width: "100px",
            height: "100px",
            margin: "0px auto"
        },
        groupAvatarStyle: {
            width: "100px",
            height: "100px",
        },
        avatarBox: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        userTextStyle: {
            fontFamily: "Ping Fang SC",
            fontWeight: "600",
            fontSize: "20px",
            color: "#0D0D0D",
            marginTop: (props) => (props.isTransfer ? "0" : "12px" )
        },
        defaultTextStyle: {
            // width:"292px",
            height: "20px",
            fontFamily: "Ping Fang SC",
            fontWeight: "400",
            fontSize: "14px",
            color: "#999999",
            lineHeight: "20px"
        },
        btnBox: {
            width: "100%",
            height: "85px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "16px"
        },
        btnStyle: {
            width: "150px",
            height: "36px",
            borderRadius: "26px",
            background: "#114EFF",
            '&:hover': {
                background: "#114EFF",
            }
        },
        btnTextStyle: {
            fontFamily: "Ping Fang SC",
            fontWeight: "600",
            fontSize: "14px",
            color: "#FFFFFF",
            textTransform: "none"
        },
        transferAvatarStyle: {
            width: "100px",
            height: "100px",
            marginLeft: "-30px",
            border: "4px solid #FFFFFF"
        }
    };
});

const ConfirmDialog = (props) => {
    const state = useSelector((state) => state);
    let { anchorEl, onClose, type, id, apiType, btnWord } = props;
    let isContact = type === "contact"
    let isGroup = type === "group"
    let isTransfer = type === "transfer"
    const classes = useStyles({
        isTransfer,
    });
    let currentLoginUser = WebIM.conn.context.userId;
    const groupsInfo = state?.groups?.groupsInfo || {};
    const groupId = groupsInfo?.id;
    const groupName = groupsInfo?.name;

    let isOwner = groupsInfo?.owner === currentLoginUser;

    const handleDelete = () => {
        if (isContact) {
            deleteContact(id, onClose)
        } else if (isGroup) {
            if (isOwner) {
                closeGroup(groupId, "dissolve", onClose)
            } else {
                closeGroup(groupId, "quit", onClose)
            }
        } else if (isTransfer) {
            if (apiType === "quit") {
                transferOwner(groupId, id, onClose, 'quit')
            } else {
                transferOwner(groupId, id, onClose);
            }
        }
    }

    const renderDeleteModel = () => {
        return <>
            <img src={closeIcon} alt="close" className={classes.iconStyle} onClick={onClose} />
            <Box className={classes.infoBox}>
                <Avatar src={isContact ? avatar : groupAvatar} className={classes.avatarStyle}></Avatar>
                <Typography className={classes.userTextStyle}>{`${i18next.t(btnWord || "Delete") + ' '}${isContact ? id : groupName}?`}</Typography>
                <Typography className={classes.defaultTextStyle}>{i18next.t(`${btnWord || 'Delete'} this ${type} and associated Chats.`)}</Typography>
            </Box>
            <Box className={classes.btnBox}>
                <Button className={classes.btnStyle} onClick={handleDelete}>
                    <Typography className={classes.btnTextStyle}>{i18next.t(btnWord || "Delete")}</Typography>
                </Button>
            </Box>
        </>
    }

    const renderTransferModel = () => {
        return <>
            <img src={closeIcon} alt="close" className={classes.iconStyle} onClick={onClose} />
            <Box className={classes.infoBox}>
                <Box className={classes.avatarBox}>
                    <Avatar src={avatar} className={classes.groupAvatarStyle}></Avatar>
                    <Avatar src={defaultAvatar} className={classes.transferAvatarStyle}></Avatar>
                </Box>
                <Typography className={classes.userTextStyle}>{i18next.t("Transfer Ownership to ")}</Typography>
                <Typography className={classes.userTextStyle}>{i18next.t(`${id} and Leave this Group?`)}</Typography>
            </Box>
            <Box className={classes.btnBox}>
                <Button className={classes.btnStyle} onClick={handleDelete}>
                    <Typography className={classes.btnTextStyle}>{i18next.t("Yes")}</Typography>
                </Button>
            </Box>
        </>
    }

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "left",
            }}
        >
            <Box className={classes.root}>
                {isTransfer ? renderTransferModel() : renderDeleteModel()}
            </Box>
        </Popover>
    )
}

export default memo(ConfirmDialog);
