import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// import { useSelector } from "../../../EaseApp/index";
import i18next from "i18next";
import { Popover, Button, Box, Modal, Input } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import offlineImg from '../../../assets/Offline.png'
import onlineIcon from '../../../assets/Online.png'
import busyIcon from '../../../assets/Busy.png'
import donotdisturbIcon from '../../../assets/Do_not_Disturb.png'
import customIcon from '../../../assets/custom.png'
import leaveIcon from '../../../assets/leave.png'
import checkgrayIcon from '../../../assets/check_gray.png'

import { presenceStatusImg } from '../../../redux/actions'
import store from "../../../redux/store";
import { message } from '../../common/alert'

import { publishNewPresence } from '../../../api/presence'
import AlertDialogSlide from '../../common/dialog'

const useStyles = makeStyles((theme) => {
  return ({
    // boxStyle: {
    //   position: 'absolute',
    //   bottom: '7px',
    //   left: '40px'
    // },
    nameText: {
        Typeface: 'Ping Fang SC',
        fontWeight: 'Semibold(600)',
        fontSize: '14px',
        character: '0',
        color: '#0D0D0D',
        marginLeft: '8px'
    },
    imgStyle: {
      width: '18px',
      height: '18px',
      borderRadius: '50%',
      cursor: 'pointer',
      verticalAlign: 'middle'
    },
    statusBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '200px',
      padding: '5px',
      height: '30px',
      cursor: 'pointer'
    },
    leftBox: {
      display: 'inline-box'
    },
    checkedStyle: {
      width: '30px',
      verticalAlign: 'middle'
    },
    modalStyle: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      background: '#fff',
      textAlign: 'center',
      height: '200px',
      paddingTop: '10px'
    },
    modalBottom: {
      marginTop: '30px'
    },
    inputStyle: {
      width: '200px'
    },
    bottomBtn: {
      marginTop: '40px'
    },
    rightBtn: {
      marginLeft: '20px'
    }
  })
});
// presenceStatus offline = 0, online = 1, busy = 100, donotdisturb = 101, leave = 102, custom = 103
const presenceList = [
  {
    id: 1,
    title: 'Online',
    checked: false,
    img: onlineIcon
  },
  {
    id: 100,
    title: 'Busy',
    checked: false,
    img: busyIcon
  },
  {
    id: 101,
    title: 'Do not Disturb',
    checked: false,
    img: donotdisturbIcon
  },
  {
    id: 102,
    title: 'Leave',
    checked: false,
    img: leaveIcon
  },
  {
    id: 103,
    title: 'Custom Status',
    checked: false,
    img: customIcon
  },
  {
    id: 0,
    title: 'Offline',
    checked: false,
    img: offlineImg
  }
]

const PresencePopover = (props) => {
  const useClasses = useStyles();
  const presenceObj = useSelector(state => state?.statusObj)

  useEffect(() => {
    presenceList.forEach((item, index) => {
      item.checked = false
    })
    presenceList[presenceObj.index].checked = true
    presenceList[presenceObj.index].title = presenceObj.ext
  }, [presenceObj])

  const [useOpenModal, setOpenModal] = useState(false);
  const [useInputValue, setInputValue] = useState(null);
  const [useDialogOpen, setDialogOpen] = useState(false)
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = (val) => {
    console.log(useInputValue)
    if (val === 1) {
      if (!useInputValue) {
        message.warn('自定义状态不能为空')
      return
      } else {
        setPresenceIndex(4)
        const params = {
          description: useInputValue
        };
        presenceList.forEach((item, index) => {
          item.checked = false
          if (index === 4) {
            item.title = useInputValue
            item.checked = true
          }
        })
        pubPresence(params)
      }
    }
    setOpenModal(false)
  }

  const [usePopoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [usePresenceIndex, setPresenceIndex] = useState(0)
  const handlePopoverClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const openPopover = Boolean(usePopoverAnchorEl);
  const id = openPopover ? 'simple-popover' : undefined;
  let changeTitle = ''
  const handlerPresence = (item, index) => {
    handlePopoverClose()
    let tempArr = []
    const params = {
      description: item.title
    };
    if (item.id === 103) {
      handleModalOpen()
    } else {
      if (presenceList[4].checked) {
        changeTitle = item.title
        setDialogOpen(true)
        return
      }
      presenceList.forEach(val => {
        if (item.id === val.id) {
          val.checked = true
        } else {
          val.checked = false
        }
        tempArr.push(val)
      })
      pubPresence(params)
      setPresenceIndex(index)
    }
  }
  const pubPresence = (params) => {
    console.log(params)
    store.dispatch(presenceStatusImg(params.description))
    publishNewPresence(params)
  }
  const handlerInput = e => {
    setInputValue(e.currentTarget.value)
  }
  const closeDialog = () => {
    setDialogOpen(false)
  }
  const button = () => {
    return (
      <Button onClick={closeDialog}>Done</Button>
    )
  }
  return (
    <div className={props.className} style={{...props.style}}>
      <img aria-describedby={id} src={presenceObj.statusImg} className={useClasses.imgStyle} onClick={handlePopoverClick} alt="" />
      <Popover
        id={id}
        open={openPopover}
        anchorEl={usePopoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {
          presenceList.slice(0,5).map((item, index) => {
            return (
              <div key={index} className={useClasses.statusBox} onClick={() => handlerPresence(item, index)}>
                <div className={useClasses.leftBox}>
                  <img className={useClasses.imgStyle} src={item.img} alt="" />
                  <span className={useClasses.nameText}>
                    {item.title}
                  </span>
                </div>
                {item.checked ? <img alt="" className={useClasses.checkedStyle} src={checkgrayIcon} /> : ''}
              </div>
            )
          })
        }
      </Popover>
      <Modal
        open={useOpenModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={useClasses.modalStyle}>
          <div id="modal-modal-title">
            Custom Status
          </div>
          <div id="modal-modal-description" className={useClasses.modalBottom}>
            <Input className={useClasses.inputStyle} placeholder="Custom Status" onChange={handlerInput} />
            <div className={useClasses.bottomBtn}>
              <Button variant="outlined" color="info" onClick={handleModalClose}>取消</Button>
              <Button className={useClasses.rightBtn} variant="contained" color="primary" onClick={() => handleModalClose(1)}>确定</Button>
            </div>
          </div>
        </div>
      </Modal>
      <AlertDialogSlide
        open={Boolean(useDialogOpen)}
        close={() => setDialogOpen(false)}
        title={'Clear your Custom Status?'}
        content={`Clear ”${presenceList[4].title}”, change to ${changeTitle}.`}
        footer={button}
      />
    </div>
	);
}

export default memo(PresencePopover);