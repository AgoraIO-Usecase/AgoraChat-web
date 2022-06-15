import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
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
import Loading from '../../common/loading'

const useStyles = makeStyles((theme) => {
  return ({
    popoverStyle: {
      '& .MuiPopover-paper': {
        borderRadius: '12px',
        width: '240px',
        height: '238px',
        padding: '10px',
        boxSizing: 'border-box',
        top: '34px !important',
        left: '60px !important',
      }
    },
    nameText: {
      fontSize: '14px',
      color: '#000',
      marginLeft: '10px',
      overflow: 'hidden',
      display: 'inline-block',
      width: '140px'
    },
    imgBox: {
      borderRadius: '50%',
      width: '17px',
      height: '17px',
      background: 'rgb(240, 242, 243)',
      textAlign: 'center',
      lineHeight: '20px',
      cursor: 'pointer',
    },
    imgStyle: {
      width: '14.29px',
      height: '14.29px',
      borderRadius: '50%',
      // verticalAlign: 'middle'
    },
    imgStyle1: {
      width: '15px',
      height: '15px',
      borderRadius: '50%',
    },
    statusBox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '224px',
      borderRadius: '8px',
      padding: '0 5px',
      height: '38px',
      cursor: 'pointer',
      marginBottom: '8px',
      boxSizing: 'border-box',
      '&:hover': {
        background: '#F6F7F8',
      }
    },
    leftBox: {
      display: 'inline-box'
    },
    checkedStyle: {
      width: '15px',
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
      paddingTop: '10px',
      borderRadius: '12px',
      outline: '0 none',
      '& #modal-modal-title': {
        fontSize: '18px',
        color: '#000',
      }
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
    },
    btnBox: {
      width: '444px',
      textAlign: 'center',
    },
    contentBox: {
      margin: '20px 18px',
    },
    btnStyle: {
      width: '150px',
      height: '36px',
      borderRadius: '26px',
      background: '#114eff',
      color: '#fff',
      margin: '10px'
    },
    outImgBox: {
      width: '30px',
      height: '30px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  })
});
// presenceStatus offline = 0, online = 1, busy = 100, donotdisturb = 101, leave = 102, custom = 103
const presenceList = [
  {
    id: 1,
    title: 'Online',
    checked: false,
    img: onlineIcon,
    subTitle: 'Available'
  },
  {
    id: 100,
    title: 'Busy',
    checked: false,
    img: busyIcon,
    subTitle: 'Busy'
  },
  {
    id: 101,
    title: 'Do not Disturb',
    checked: false,
    img: donotdisturbIcon,
    subTitle: 'Do Not Disturb'
  },
  {
    id: 102,
    title: 'Leave',
    checked: false,
    img: leaveIcon,
    subTitle: 'Away'
  },
  {
    id: 103,
    title: 'Custom Status',
    checked: false,
    img: customIcon,
    subTitle: 'Custom Status'
  },
  {
    id: 0,
    title: 'Offline',
    checked: false,
    img: offlineImg,
    subTitle: 'Offline'
  }
]

const PresencePopover = (props) => {
  const useClasses = useStyles();
  const presenceObj = useSelector(state => state?.statusObj)
  useEffect(() => {
    presenceList.forEach((item, index) => {
      item.checked = false
    })
    if (presenceObj?.index || presenceObj?.index === 0) {
      presenceList[presenceObj.index].checked = true
      if (presenceObj.index === 4) {
        presenceList[presenceObj.index].title = presenceObj.ext
      } else {
        presenceList[4].title = 'Custom Status'
      }
    }
  }, [presenceObj])

  const [useOpenModal, setOpenModal] = useState(false);
  const [useInputValue, setInputValue] = useState(null);
  const [useDialogOpen, setDialogOpen] = useState(false)
  const [useShowLoading, setShowLoading] = useState(false)
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = (val) => {
    if (val === 1) {
      if (!useInputValue) {
        message.warn(i18next.t('Custom Status Is Not Empty'))
      return
      } else {
        const params = {
          description: useInputValue
        };
        pubPresence(params).then(res => {
          presenceList.forEach((item, index) => {
            item.checked = false
            if (index === 4) {
              item.title = useInputValue
              item.checked = true
            }
          })
        }).catch(err => {
          // console.log(err)
        })
      }
    }
    setOpenModal(false)
  }

  const [usePopoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const handlePopoverClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const openPopover = Boolean(usePopoverAnchorEl);
  const id = openPopover ? 'simple-popover' : undefined;

  const [changeTitle, setChangeTitle] = useState('')

  const handlerPresence = (item, index) => {
    handlePopoverClose()
    const params = {
      description: item.title
    };
    if (item.id === 103) {
      handleModalOpen()
    } else {
      if (presenceList[4].checked) {
        setChangeTitle(item.title)
        setDialogOpen(true)
        return
      }
      pubPresence(params).then(res => {
        presenceList.forEach(val => {
          if (item.id === val.id) {
            val.checked = true
          } else {
            val.checked = false
          }
        })
      }).catch(err => {
        // console.log(err)
      })
    }
  }
  const pubPresence = (params) => {
    setShowLoading(true)
    return new Promise((resolve, reject) => {
      publishNewPresence(params).then(res => {
        store.dispatch(presenceStatusImg(params.description))
        resolve(res)
      }).catch(err => {
        reject(err)
      }).finally(e => {
        setShowLoading(false)
      })
    })
  }
  const handlerInput = e => {
    setInputValue(e.currentTarget.value)
  }
  const handlerChangeStatus = () => {
    const params = {
      description: changeTitle
    }
    pubPresence(params).then(res => {
      presenceList[4].title = 'Custom Status'
    })
    setDialogOpen(false)
  }
  const button = () => {
    return (
      <div className={useClasses.btnBox}>
        <Button className={useClasses.btnStyle} color="primary" variant="contained" onClick={handlerChangeStatus}>{i18next.t('Clear')}</Button>
      </div>
    )
  }
  const renderContent = (title) => {
    return (
      <div className={useClasses.contentBox}>
        {`Clear ”${presenceList[4].title}”, change to ${changeTitle}.`}
      </div>
    )
  }
  return (
    <div className={props.className} style={{...props.style}}>
      <div className={useClasses.outImgBox} onClick={handlePopoverClick}>
        <div className={useClasses.imgBox}>
          <img aria-describedby={id} src={presenceObj?.statusImg} className={useClasses.imgStyle1} alt="" />
        </div>
      </div>
      <Popover
        id={id}
        className={useClasses.popoverStyle}
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
          {i18next.t('Custom Status')}
          </div>
          <div id="modal-modal-description" className={useClasses.modalBottom}>
            <Input className={useClasses.inputStyle} placeholder="Custom Status" onChange={handlerInput} />
            <div className={useClasses.bottomBtn}>
              <Button variant="outlined" color="inherit" onClick={handleModalClose}>{i18next.t('Cancel')}</Button>
              <Button className={useClasses.rightBtn} variant="contained" color="primary" onClick={() => handleModalClose(1)}>{i18next.t('Confirm')}</Button>
            </div>
          </div>
        </div>
      </Modal>
      <AlertDialogSlide
        open={Boolean(useDialogOpen)}
        onClose={() => setDialogOpen(false)}
        title={i18next.t('Clear your Custom Status?')}
        content={renderContent()}
        footer={button()}
        maxWidth={'xs'}
      />
      <Loading show={Boolean(useShowLoading)} />
    </div>
	);
}

export default memo(PresencePopover);