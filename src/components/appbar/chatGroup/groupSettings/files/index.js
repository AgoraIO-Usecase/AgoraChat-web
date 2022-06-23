import React, { useState, useEffect, useRef, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
} from "@material-ui/core";
import i18next from "i18next";
import store from "../../../../../redux/store";
import { uploadfile } from "../../../../../api/groupChat/getGroupInfo";
import Menu from "./menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
	titleBox: {
		background: "#F6F7F8",
		opacity: "100%",
		height: "60px",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "0 24px 0 38px !important",
		position: "relative",
		// borderRadius: "12px",
	},
	addStyle: {
		position: "absolute",
		top: "20px",
		right: "30px",
		fontFamily: "Ping Fang SC",
		fontWeight: "600",
		fontSize: "16px",
		color: "#005FFF",
		cursor: "pointer",
	},
	titleStyle: {
		fontFamily: "Ping Fang SC",
		fontWeight: "600",
		fontSize: "16px",
		color: "#000000",
	},
	listStyle: {
		background: "#F6F7F8",
		marginTop: "20px",
		borderRadius: "16px",
		height:"540px",
		overflowX:"hidden",
		overflowY:"scroll"
	},
	itemStyle: {
		display: "flex",
		justifyCcontent: "space-between",
		alignItems: "center",
	},
	iconStyle: {
		height: "24px",
		width: "24px",
		borderRadius: "60%",
		"&:hover": {
			background: "#FFFFFF",
		},
	},
	noStyle: {
		height: "584px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		background: "#EDEFF2",
	},
}));

const GroupFiles = ({ onClose }) => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [newFiles, setNewFiles] = useState([]);
	const [fileId, setFileId] = useState("")
	const [fileName, setFileName] = useState("");

	const state = store.getState();
	let groudId = state.groups.groupsInfo?.id;
	let groupFiles = state.groups.groupFiles;
	let isGroupFiles = groupFiles.length > 0;

	useEffect(() => {
		let files = [];
		isGroupFiles &&
			groupFiles.forEach((item) => {
				console.log("item>>>", item);
				let { file_name,file_id } = item;
				files.push({ name: file_name, id: file_id });
			});
		setNewFiles(files);
	}, [groupFiles]);
	const couterRef = useRef();
	const updateImage = () => {
		couterRef.current.focus();
		couterRef.current.click();
	};

	const handlefiles = (e) => {
		console.log('e>>>',e);
		uploadfile(groudId, e);
	};

	const handleMenu = (e, item) => {
		setAnchorEl(e.currentTarget);
		setFileId(item);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};


	return (
		<Box>
			<Box className={classes.titleBox}>
				<Typography className={classes.titleStyle}>
					{i18next.t("Group Files")}
				</Typography>
				<Typography className={classes.addStyle}>
					<div onClick={updateImage} className="chat-tool-item">
						{i18next.t("Add")}
						<input
							id="uploadImage"
							onChange={handlefiles}
							type="file"
							ref={couterRef}
							style={{
								display: "none",
							}}
						/>
					</div>
				</Typography>
			</Box>
			<Box>
				{isGroupFiles ? (
					<List
						component="nav"
						aria-label="main mailbox folders"
						className={classes.listStyle}
					>
						{newFiles.map((val, i) => {
							let { name, id } = val;
							return (
								<ListItem
									button
									style={{ borderRadius: "16px" }}
									key={i}
								>
									<ListItemText>{name}</ListItemText>
									<Box className={classes.itemStyle}>
										<Box
											className={classes.iconStyle}
											onClick={(e) => handleMenu(e, id)}
										>
											<MoreVertIcon />{" "}
										</Box>
									</Box>
								</ListItem>
							);
						})}
					</List>
				) : (
					<Box className={classes.noStyle}>
						{i18next.t("No Files")}
					</Box>
				)}
			</Box>
			<Menu open={anchorEl} onClose={handleClose} fileId={fileId} />
		</Box>
	);
};

export default memo(GroupFiles);
