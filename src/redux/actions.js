

export const contactsAciton = (data) => {
    return { type: 'CONTACTS_ACTION', data };
};

export const groupListAciton = (data) => {
    return { type: 'GROUP_LIST_ACTION', data };
};

export const publicGroupsAciton = (data) => {
    return { type: 'PUBLIC_GROUPS_ACITON', data };
};


export const groupsInfoAction = (data) => {
    return { type: 'GROUPS_INFO_ACITON', data };
}

export const groupAdminsAction = (data) => {
    return { type: 'GROUP_ADMINS_ACITON', data };
}

export const groupMuteAction = (data, options) => {
    return { type: 'GROUP_MUTE_ACITON', data, options };
}

export const groupBlockAction = (data) => {
    return { type: 'GROUP_BLOCK_ACITON', data };
}

export const groupAllowAction = (data) => {
    return { type: 'GROUP_ALLOW_ACITON', data };
}

export const groupsNoticeAction = (data) => {
    return { type: 'GROUPS_NOTICE_ACITON', data };
}

export const groupsFilesAction = (data,option) => {
	return { type: "GROUPS_FILES_ACITON", data, option };
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

