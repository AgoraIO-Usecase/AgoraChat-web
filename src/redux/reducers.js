import _ from 'lodash'
import onlineIcon from '../assets/Online.png'
let defaultState = {
	constacts: [],
    groups: {
        groupList: [],
        publicGroups: [],
        groupsInfo: [],
        groupAdmins: [],
        groupMuteList: [],
        groupBlockList: [],
        groupAllowList: [],
        groupNotices: '',
    },
    sessionList: [],
    requests: { contact: [], group: [] },
    // requests: { group: [{ name: 'zdzd', group: '123456', status: 'pedding', time: '', type: 'apply' }], contact: [{ name: 'zdzd', status: 'pedding', time: '' }] },
    blackList: [],
    myUserInfo: {
        agoraId: null,
        nickName: null,
        avatarIndex: null
    },
    isFetching: false,
    isSearching: false,
    isShowGroupChat: false,
		thread: {
			groupId:'',
			threadId:'',
			threadName:'',
			threadOwner:'',
			membersList: [],
			isLast: false,
			cursor:'',
			isAdmin:false,
			currentEditPage:''
		},
    statusObj: {
        statusImg: onlineIcon,
        index: 0,
        ext: ''
    },
    presenceList: [],
    muteDataObj: {},
    globalSilentMode: {
        global: {},
        single: {},
        group: {},
        threading: {}
    },
    unread: {
        singleChat: {},
        groupChat: {},
        chatRoom: {},
    },
    currentSessionId: ''
};

const reducer = (state = defaultState, action) => {
    const { type, data,option } = action;
    switch (type) {
		case "CONTACTS_ACTION": {
			return {
				...state,
				constacts: data,
			};
		}
		case "GROUP_LIST_ACTION":
			return {
				...state,
				groups: {
					...state.groups,
					groupList: data,
				},
			};
		case "PUBLIC_GROUPS_ACTION":
			return {
				...state,
				groups: {
					...state.groups,
					publicGroups: data,
				},
			};
		case "GROUPS_INFO_ACTION":
			return {
				...state,
				groups: {
					...state.groups,
					groupsInfo: data,
				},
			};
		case "GROUP_ADMINS_ACTION":
			return {
				...state,
				groups: {
					...state.groups,
					groupAdmins: data,
				},
			};
		case "GROUP_MUTE_ACTION":
			return {
				...state,
				groups: {
					...state.groups,
					groupMuteList: data,
				},
			};
		case "GROUP_BLOCK_ACTION":
			return {
				...state,
				groups: {
					...state.groups,
					groupBlockList: data,
				},
			};
		case "GROUP_ALLOW_ACTION":
			return {
				...state,
				groups: {
					...state.groups,
					groupAllowList: data,
				},
			};
		case "GROUPS_NOTICE_ACTION":
			return {
				...state,
				groups: {
					...state.groups,
					groupNotices: data,
				},
			};

		case "GROUPS_FILES_ACTION":
			let { type } = option;
			let files = []
			if (type === "getFile") {
				files = data
			}else {
				files = _.concat(state.groups.groupFiles,data)
			}
			return {
				...state,
				groups: {
					...state.groups,
					groupFiles: files,
				},
			};
		case "SET_SESSION_LIST":
			return {
				...state,
				sessionList: data,
			};
		case "SET_REQUESTS":
			return {
				...state,
				requests: data,
			};
		case "UPDATE_REQUEST_STATUS":
			let requests = state.requests;
			let newRequests = {};
			if (data.type === "contact") {
				let updatedReq = requests.contact.map((value) => {
					if (value.name === data.name) {
						value.status = data.status;
					}
					return value;
				});
				newRequests = { ...requests, contact: updatedReq };
			} else {
				// let updatedReq = requests.group.map(value => {
				//     if (value.name === data.name) {
				//         value.status = data.status
				//     }
				//     return value
				// })
				let groupReqs = [...requests.group];
				let len = groupReqs.length;
				for (let index = 0; index < len; index++) {
					if (groupReqs[index].name === data.name) {
						groupReqs[index].status = data.status;
						break;
					}
				}

				newRequests = { ...requests, group: groupReqs };
			}
			return {
				...state,
				requests: newRequests,
			};
		case "SET_MY_USER_INFO":
			let { myUserInfo } = state;
			return {
				...state,
				myUserInfo: { ...myUserInfo, ...data },
			};
		case "SET_BLACK_LIST":
			return {
				...state,
				blackList: data,
			};
		case "SET_FETCHING_STATUS":
			return {
				...state,
				isFetching: data,
			};
		case "SEARCH_ADDED_GROUP_ACTION":
			let searchAddedGroups = state.groups.groupList.filter((item) =>
				item.groupname.includes(data)
			);
			return {
				...state,
				groups: {
					...state.groups,
					groupList: searchAddedGroups,
				},
			};
		case "SEARCH_PUBLIC_GROUP_ACTION":
			let searcPublichGroups = state.groups.publicGroups.filter((item) =>
				item.groupname.includes(data)
			);
			return {
				...state,
				groups: {
					...state.groups,
					publicGroups: searcPublichGroups,
				},
			};
		case "SEARCH_LOAD_ACTION":
			return {
				...state,
				isSearching: data,
			};

		case "SEARCH_CONTACTS_ACTION":
			let searchContacts = state.constacts.filter((item) =>
				item.includes(data)
			);
			return {
				...state,
				constacts: searchContacts,
			};
		case "CLOSE_GROUP_CHAT_ACTION":
			return {
				...state,
				isShowGroupChat: data,
			};
		case 'PRESENCE_STATUS_IMG':
			return {
				...state,
				statusObj: data
			}
		case 'SET_PRESENCE_LIST':
			return {
				...state,
				presenceList: data
			}
		case 'SET_MUTE_DATA_OBJ':
			return {
				...state,
				muteDataObj: { ...state.muteDataObj, ...data}
			}
		case 'SET_GLOBAL_SILENT_MODE':
			for (let item in data) {
				state.globalSilentMode[item] = {...state.globalSilentMode[item], ...data[item]}
			}
			return {
				...state,
				globalSilentMode: { ...state.globalSilentMode }
			}
		case 'SET_UNREAD':
			for (let item in data) {
				for (let val in data[item]) {
					state.unread[item][val] = { ...state.unread[item][val], ...data[item][val] }
				}
			}
			return {
				...state,
				unread: { ...state.unread }
			}
		case 'SET_CURRENT_SESSION_ID':
			return {
				...state,
				currentSessionId: data
			}

		case 'SET_THREAD_INFO':
			let threadInfo = data;
			if(data.isScroll === 'isScroll'){
				data.data.membersList = state.thread.membersList.concat(data.data.membersList)
				threadInfo = data.data
			}
			return {
				...state,
				thread:{
					...state.thread,
					...threadInfo
				}
			}
		default:
			break;
	}
}

export default reducer;

