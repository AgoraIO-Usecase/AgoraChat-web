import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CommonDialog from "./dialog";
import i18next, { use } from "i18next";

const useStyles = makeStyles((theme) => {
  return {
    footerBtn: {
			textAlign: 'right',
			height: '50px',
			width: '440px',
			borderRadius: '12px',
			boxSizing: 'border-box',
			'& span': {
				height: '36px',
				width: '84px',
				borderRadius: '26px',
				display: 'inline-block',
				fontFamily: 'Roboto',
				fontStyle: 'normal',
				fontWeight: '600',
				fontSize: '16px',
				lineHeight: '36px',
				textAlign: 'center',
				color: '#000000',
				cursor: 'pointer',
			}
		},
		secondSpan: {
			color: '#FFFFFF !important',
			marginRight: '23px',
			background: '#114EFF',
		},
		myGroupsignupdialog: {
			'& .MuiDialog-paper': {
				borderRadius: '12px'
			}
		},
		contentBox: {
			fontWeight: 600,
			padding: '10px 0 0 20px',
			boxSizing: 'border-box',
		}
  }
})
const confirmDialog = ({ confirmContent, onClose, open, confirmMethod }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const classes = useStyles();
  const footerCom = () => {
    return (
      <div className={classes.footerBtn}>
          <span onClick={onClose}>{confirmContent.cancel ? confirmContent.cancel : 'Cancel'}</span>
          <span className={classes.secondSpan} onClick={confirmMethod}>{confirmContent.sure ? confirmContent.sure : 'Sure'}</span>
      </div>
    )
  }
  const groupContentCom = () => {
    return (
      <div className={classes.contentBox}>{confirmContent.content}</div>
    )
  }
  return (
    <CommonDialog
      open={Boolean(open)}
      onClose={onClose}
      title={i18next.t(confirmContent.title ? confirmContent.title : "Are You Sure!")}
      footer={footerCom()}
      content={groupContentCom()}
      className='myGroupsignupdialog'
    ></CommonDialog>
  )
}

export default confirmDialog