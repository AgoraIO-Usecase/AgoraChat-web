
import WebIM from '../../utils/WebIM'
import getGroups from './getGroups'
import { message } from '../../components/common/alert'
import i18next from "i18next";
const createGroup = (groupInfo, member, onClearValue, onClose) => {
    const { groupNameValue, groupDescriptionValue, groupPublicChecked, groupApprovalChecked, groupInviteChecked } = groupInfo
    let options = {
        data: {
            groupname: groupNameValue,
            desc: groupDescriptionValue,
            members: member,
            public: groupPublicChecked,
            approval: groupApprovalChecked,
            allowinvites: groupInviteChecked,
            inviteNeedConfirm: false
        },
    };
    WebIM.conn.createGroupNew(options).then((res) => {
        console.log('createGroupNew>>>', res)
        message.success(i18next.t('created success'))
        getGroups();
        onClearValue();
        onClose();
    })
}

export default createGroup;