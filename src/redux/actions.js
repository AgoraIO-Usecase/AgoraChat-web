import offlineImg from '../assets/Offline.png'
import onlineIcon from '../assets/Online.png'
import busyIcon from '../assets/Busy.png'
import doNotDisturbIcon from '../assets/Do_not_Disturb.png'
import customIcon from '../assets/custom.png'
import leaveIcon from '../assets/leave.png'

export const contactsAction = (data) => {
    return { type: 'CONTACTS_ACTION', data };
};

export const groupListAction = (data) => {
    return { type: 'GROUP_LIST_ACTION', data };
};

export const publicGroupsAction = (data) => {
    return { type: 'PUBLIC_GROUPS_ACTION', data };
};


export const groupsInfoAction = (data) => {
    return { type: 'GROUPS_INFO_ACTION', data };
}

export const groupAdminsAction = (data) => {
    return { type: 'GROUP_ADMINS_ACTION', data };
}

export const groupMuteAction = (data, options) => {
    return { type: 'GROUP_MUTE_ACTION', data, options };
}

export const groupBlockAction = (data) => {
    return { type: 'GROUP_BLOCK_ACTION', data };
}

export const groupAllowAction = (data) => {
    return { type: 'GROUP_ALLOW_ACTION', data };
}

export const groupsNoticeAction = (data) => {
    return { type: 'GROUPS_NOTICE_ACTION', data };
}

export const groupsFilesAction = (data,option) => {
	return { type: "GROUPS_FILES_ACTION", data, option };
};

// set user info
export const setMyUserInfo = (data) => {
    console.log('setMyUserInfo --', data)
    return { type: 'SET_MY_USER_INFO', data };
}

// set black list
export const setBlackList = (data) => {
    return { type: 'SET_BLACK_LIST', data };
}

// set requests
export const setRequests = (data) => {
    return { type: 'SET_REQUESTS', data };
}

// update request status
export const updateRequestStatus = (data) => {
    return { type: 'UPDATE_REQUEST_STATUS', data };
}

// Whether show loading
export const setFetchingStatus = (data) => {
    return { type: 'SET_FETCHING_STATUS', data };
}

// search added group value
export const searchAddedGroupAction = (data ) => {
    return { type: 'SEARCH_ADDED_GROUP_ACTION', data}
}

// search public group value
export const searchPublicGroupAction = (data) => {
    return { type: 'SEARCH_PUBLIC_GROUP_ACTION', data }
}
// search loading
export const searchLoadAction = (data) => {
    return { type: 'SEARCH_LOAD_ACTION', data }
}

// search contacts value
export const searchContactsAction = (data) => {
    return { type: 'SEARCH_CONTACTS_ACTION', data }
}

// close Group Chat
export const closeGroupChatAction = (data) => {
	return { type: "CLOSE_GROUP_CHAT_ACTION", data };
};

export const presenceStatusImg = ext => {
    ext = decodeURIComponent(ext)
    let data = {
        statusImg: customIcon,
        index: 4,
        ext
    }
    if (ext === 'Offline') {
        data.statusImg = offlineImg
        data.index = 5
    } else if (ext === 'Online' || ext === '') {
        data.statusImg = onlineIcon
        data.index = 0
    } else if (ext === 'Busy') {
        data.statusImg = busyIcon
        data.index = 1
    } else if (ext === 'Do not Disturb') {
        data.statusImg = doNotDisturbIcon
        data.index = 2
    } else if (ext === 'Leave') {
        data.statusImg = leaveIcon
        data.index = 3
    }
    return { type: "PRESENCE_STATUS_IMG", data }
}

export const setPresenceList = (data) => {
    return { type: "SET_PRESENCE_LIST", data }
}

export const setMuteDataObj = (data) => {
    return { type: "SET_MUTE_DATA_OBJ", data }
}

export const setGlobalSilentMode = (data) => {
    return { type: "SET_GLOBAL_SILENT_MODE", data }
}

export const setUnread = (data) => {
    return { type: "SET_UNREAD", data }
}

export const setCurrentSessionId = (data) => {
    return { type: "SET_CURRENT_SESSION_ID", data }
}
//set thread info
export const setThreadInfo = (data) => {
    return { type: 'SET_THREAD_INFO',data}
}