
import WebIM from '../../utils/WebIM'
import store from '../../redux/store'
import {
	groupsInfoAction,
	groupsFilesAction,
	groupsNoticeAction,
} from "../../redux/actions";
import { getGroupAdmins } from './groupAdmin'
import { getGroupMuted } from './groupMute'
import { getGroupBlock } from './groupBlock'
import { getGroupWrite } from './groupWhite'
const getGroupInfo = (groupId, type) => {
    let options = {
        groupId: groupId
    };
    WebIM.conn.getGroupInfo(options).then((res) => {
        let id = res.data[0].id
        if (!type) {
            getGroupNotice(id)
            getGroupAdmins(id)
            getGroupMuted(id)
            getGroupBlock(id)
            getGroupWrite(id)
            getGroupFiles(id);
        }
        store.dispatch(groupsInfoAction(res.data[0]))
    })
}


export const modifyGroupInfo = (newGroupName, newDescription, handleClose) => {
    let state = store.getState();
	let groupId = state.groups.groupsInfo?.id;
    let groupName = state.groups.groupsInfo?.name || "";
	let groupDescription = state.groups.groupsInfo?.description || "";
	let option = {
		groupId: groupId,
		groupName: newGroupName ? newGroupName : groupName,
		description: newDescription ? newDescription : groupDescription,
	};
	WebIM.conn.modifyGroup(option).then((res) => {
		console.log("modifyGroupInfo>>>", res);
        getGroupInfo(groupId);
        handleClose && handleClose();
	});
};




const getGroupFiles = (groupId) => {
    let options = {
		groupId: groupId, 
	};
	WebIM.conn.fetchGroupSharedFileList(options).then((res) => {
		console.log("getGroupFiles>>>", res);
		store.dispatch(groupsFilesAction(res.data,{type:"getFile"}));
	});
}

export const uploadfile = (groupId, file) => {
	let options = {
		groupId: groupId,
		file: file,
		onFileUploadProgress: function (res) {
			console.log("start uploadfile>>>", res);
		}, 
		onFileUploadComplete: function (res) {
			console.log("upload succes>>>", res);
			// res.data.file_name = file.target.files[0].name;
			store.dispatch(groupsFilesAction(res.data,{type:"uploda"}));
		}, 
		onFileUploadError: function (e) {},
		onFileUploadCanceled: function (e) {
		},
	};
	WebIM.conn.uploadGroupSharedFile(options);
};

export const downloadFile = (groudId,fileId) => {
	console.log("groudId,fileId", groudId, fileId);
	let options = {
		groupId: groudId,
		fileId: fileId, 
		onFileDownloadComplete: function (res) {
			console.log("downloadFile succes",res);
		},
		onFileDownloadError: function (e) {
			console.log("downloadFile fail", e);
		}, 
	};
	WebIM.conn.downloadGroupSharedFile(options);
};

export const deleteFile = (groudId, fileId) => {
	let options = {
		groupId: groudId, 
		fileId: fileId, 
		onFileDownloadComplete: function (res) {
			console.log("deleteFile success",res);
			getGroupFiles(groudId);
		}, 
		onFileDownloadError: function (e) {
			console.log("deleteFile fail", e);

		},
	};
	WebIM.conn.downloadGroupSharedFile(options);
};

export const updateGroupNotice = (groupId,content) => {
	let options = {
		groupId: groupId,
		announcement: content,
	};
	WebIM.conn.updateGroupAnnouncement(options).then((res) => {
		getGroupNotice(groupId);
	});
};


const getGroupNotice = (groupId) => {
	let options = {
		groupId,
	};
	WebIM.conn.fetchGroupAnnouncement(options).then((res) => {
		store.dispatch(groupsNoticeAction(res.data.announcement));
	});
};

export default getGroupInfo;