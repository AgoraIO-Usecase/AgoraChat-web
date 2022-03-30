
import React, { useState } from 'react'
import i18next from "i18next";
import { Box, Switch, InputBase } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddGroupMemberDialog from './addMember'
import { message } from '../../../common/alert'
import go_icon from '../../../../assets/go@2x.png'

const useStyles = makeStyles((theme) => {
    return ({
        inputBox: {
            borderRadius: '16px',
            background: '#F4F5F7',
            padding: '15px'
        },
        gNameBox: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #E6E6E6'
        },
        gNameText: {
            typeface: 'Ping Fang SC',
            fontWeight: '600',
            fontSize: '16px',
            character: '0',
        },
        gNameLimit:{
            position: 'absolute',
            right: '25px',
            color: '#d42e2e'
        },
        gDescriptionBox: {
            borderBottom: '1px solid #E6E6E6',
            marginBottom: '20px'
        },
        gDescription: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        gInputBaseWidth: {
            width: '360px',
            marginTop:"10px"
        },
        gDescriptionLenth: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '20px',
            color: '#CCCCCC',
            fontSize: '14px',
            fontWeight: 'Regular(400)'
        },
        gInfoSetting: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        gMumberInput: {
            width: '180px',
        },
        gSetting: {
            height: '55px',
            display: 'flex',
            justifyContent: 'space-between',
            background: '#F4F5F7',
            borderradius: '16px',
            marginTop: '20px',
            padding: '0 15px',
            alignItems: 'center',
        },
        gInvite: {
            color: '#CCCCCC',
            display: ' flex',
            alignItems: 'center',
            marginTop: '20px',
            justifyContent: 'space-between',
            padding: '0 15px',
            background: '#F4F5F7',
            height: '55px',
            borderRadius: '16px'
        },
        gNext: {
            display: 'flex',
            alignItems: 'center',
            borderRadius: '16px',
            cursor: 'pointer',
            color: '#CCCCCC',
            position: 'absolute',
            bottom: '20px',
            right: '20px'
        },
        gNextImg: {
            width: '20px',
            height: '20px'
        }
    })
});

const CreateGroup = () => {
    const classes = useStyles();
    let descMaxLength = 300;
    const [groupNameValue, setGroupNameValue] = useState('')
    const [groupDescriptionValue, setGroupDescriptionValue] = useState('')
    // const [groupMaximumValue, setGroupMaximumValue] = useState('')
    const [groupPublicChecked, setGroupPublicChecked] = useState(true);
    const [groupApprovalChecked, setGroupApprovalChecked] = useState(true)
    const [groupInviteChecked, setGroupInviteChecked] = useState(false);
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
    const [groupInfoData, setGroupInfoData] = useState({})
    const [showGroupNamelimit, setShowGroupNamelimit] = useState(false)

    // Group Name
    const handleNameChange = (event) => {
        let inputValue = event.target.value
        if (inputValue.length > 20) {
            setShowGroupNamelimit(true)
            setGroupNameValue(inputValue.slice(0,20))
            return
        }else{
            setShowGroupNamelimit(false)
            setGroupNameValue(inputValue)
        }
       
    }
    // Group Description
    const handleDescriptionChange = (event) => {
        let value = event.target.value;
        if (value.length > descMaxLength) {
            message.error(
              i18next.t("The group description exceeded the upper limit")
            );
            return;
        } 
        setGroupDescriptionValue(value)
    }
    //
    // const handleMaximumChange = (event) => {
    //     setGroupMaximumValue(event.target.value)
    // }

    // Group Type： prublic/private
    const handleGrooupPublicChange = (event) => {
        setGroupPublicChecked(event.target.checked);
    };
    const handleGrooupApprovalChange = (event) => {
        setGroupApprovalChecked(event.target.checked)
    }
    const handleGroupInviteChange = (event) => {
        setGroupInviteChecked(event.target.checked);
    };

    const handleSelectUserDialog = () => {
        if (groupNameValue.match(/^\s*$/)) {
            message.error(i18next.t('group name cannot be empty'))
            return;
        }
        setShowAddMemberDialog(true);
        setGroupInfoData({ groupNameValue, groupDescriptionValue, groupPublicChecked, groupApprovalChecked, groupInviteChecked })
    }
    const handleSelectUserDialogClose = () => {
        setShowAddMemberDialog(false);
    }

    const handleClearValue = () => {
        setGroupNameValue('');
        setGroupDescriptionValue('');
    }

    return (
      <Box>
        {showAddMemberDialog ? (
          <AddGroupMemberDialog
            groupInfoData={groupInfoData}
            onClearValue={handleClearValue}
            open={showAddMemberDialog}
            onClose={handleSelectUserDialogClose}
          />
        ) : (
          <Box>
            <Box className={classes.inputBox}>
              <Box className={classes.gNameBox}>
                <Typography className={classes.gNameText}>GroupName</Typography>
                <InputBase
                  type="text"
                  max={20}
                  className={classes.gInputBaseWidth}
                  placeholder={i18next.t("groupName")}
                  value={groupNameValue}
                  onChange={handleNameChange}
                />
                {showGroupNamelimit && (
                  <Typography className={classes.gNameLimit}>
                    {i18next.t("Only 20 characters")}
                  </Typography>
                )}
              </Box>
              <Box className={classes.gDescriptionBox}>
                <Box className={classes.gDescription}>
                  <Typography className={classes.gNameText}>
                    Group Description
                  </Typography>
                  <InputBase
                    type="text"
                    multiline={true}
                    maxRows={3}
                    style={{
                      height: "60px",
                      overflowX: "hidden",
                      overflowY: "scroll",
                    }}
                    className={classes.gInputBaseWidth}
                    placeholder={i18next.t("Not required")}
                    value={groupDescriptionValue}
                    onChange={handleDescriptionChange}
                  />
                </Box>
                <Box className={classes.gDescriptionLenth}>
                  {groupDescriptionValue.length}/{descMaxLength}
                </Box>
              </Box>
              <Box style={{ color: "#CCCCCC", pointerEvents: "none" }}>
                <Box className={classes.gInfoSetting}>
                  <Typography className={classes.gNameText}>
                    Maximum Mumber
                  </Typography>
                  <InputBase
                    type="number"
                    value={200}
                    style={{ color: "#CCCCCC" }}
                    placeholder={i18next.t("No More Than 2000")}
                    // onChange={groupMaximumValue}
                  />
                </Box>
              </Box>
            </Box>
            <Box className={classes.gSetting}>
              <Typography className={classes.gNameText}>
                Set to a Public Group
              </Typography>
              <Switch
                checked={groupPublicChecked}
                onChange={handleGrooupPublicChange}
                color="primary"
              />
            </Box>
            <Box
              className={classes.gSetting}
              key={groupPublicChecked}
              style={{
                color: groupPublicChecked ? "rgba(0, 0, 0, 0.87)" : "#CCCCCC",
                pointerEvents: groupPublicChecked ? "all" : "none",
              }}
            >
              <Typography className={classes.gNameText}>
                Authorizated to join
              </Typography>
              <Switch
                checked={groupPublicChecked ? groupApprovalChecked : true}
                onChange={handleGrooupApprovalChange}
                color="primary"
              />
            </Box>
            <Box
              className={classes.gInvite}
              style={{
                color: groupPublicChecked ? "#CCCCCC" : "rgba(0, 0, 0, 0.87)",
                pointerEvents: groupPublicChecked ? "none" : "all",
              }}
            >
              <Typography className={classes.gNameText}>
                Allow Members to Invite
              </Typography>
              <Switch
                checked={groupPublicChecked ? false : groupInviteChecked}
                onChange={handleGroupInviteChange}
                color="primary"
              />
            </Box>
            <Box
              className={classes.gNext}
              onClick={() => handleSelectUserDialog()}
            >
              <Typography
                className={classes.gNameText}
                style={{ color: "#005FFF" }}
              >
                {i18next.t("Next")}
              </Typography>
              <img src={go_icon} alt="" className={classes.gNextImg} />
            </Box>
          </Box>
        )}
      </Box>
    );
}

export default CreateGroup;