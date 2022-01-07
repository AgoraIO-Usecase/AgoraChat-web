import React from 'react';
import { useSelector } from 'react-redux'
import i18next from "i18next";
import { Popover, Box, Avatar, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import avatarImg from '../../../assets/avatar1.png'
import newChatIcon from '../../../assets/newchat@2x.png'
import addContactIcon from '../../../assets/addcontact@2x.png'

const useStyles = makeStyles((theme) => {
    return ({
        root: {
            height: '280px',
            width: '340px',
            background: '#FFFFFF'
        },
        infoBox: {
            textAlign: 'center'
        },
        avatarImg: {
            width: '100px',
            height: '100px',
            margin: '25px auto'
        },
        nameText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Semibold(600)',
            fontSize: '20px',
            character: '0',
            color: '#0D0D0D'
        },
        idText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Regular(400)',
            fontSize: '12px',
            character: '0',
            LineHeight: '20(1.667)',
            color: '#999999'
        },
        infoBtn: {
            width: '100%',
            textTransform: 'none',
            marginTop: '15px',
            display: 'flex',
            // justifycontent: 'flex-start'
        },
        infoBtnText: {
            Typeface: 'Ping Fang SC',
            fontWeight: 'Medium(500)',
            marginLeft: '8px',
            fontSize: '14px',
            character: '0',
            color: '#000000'
        }
    })
});


const UserInfoPopover = ({ open, anchorEl, onClose }) => {
    const classes = useStyles();
    const state = useSelector((state) => state);
    const constacts = state?.constacts || [];
    return (
		<Popover
			// id={id}
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{
				vertical: "top",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center",
			}}
		>
			<Box className={classes.root}>
				<Box className={classes.infoBox}>
					<Avatar
						src={avatarImg}
						className={classes.avatarImg}
					></Avatar>
					<Typography className={classes.nameText}>
						NicaName
					</Typography>
					<Typography className={classes.idText}>
						Agora:12345
					</Typography>
				</Box>
				{constacts.includes("userId") ? (
					<Button className={classes.infoBtn}>
						<img
							src={newChatIcon}
							alt="chat"
							style={{ width: "30px" }}
						/>
						<Typography className={classes.infoBtnText}>
							{i18next.t("Chat")}
						</Typography>
					</Button>
				) : (
					<Button className={classes.infoBtn}>
						<img
							src={addContactIcon}
							alt="new chat"
							style={{ width: "30px" }}
						/>
						<Typography className={classes.infoBtnText}>
							{i18next.t("Add Contact")}
						</Typography>
					</Button>
				)}
			</Box>
		</Popover>
	);
}

export default UserInfoPopover;