

import i18next from "i18next";
import CommonDialog from '../common/dialog'
import React, { memo, useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { divide } from "lodash";
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import WebIM from '../../utils/WebIM';
import { message } from '../common/alert'
import { rootStore } from 'chatuim2'
import store from "../../redux/store";
import {
    setSettingVisible
  } from "../../redux/actions";
const useStyles = makeStyles((theme) => ({
    root: {
        width: '620px',
        height: theme.spacing(45),
        backgroundColor: 'rgba(206, 211, 217, .15)',
        boxSizing: 'border-box',
        overflowY: 'auto',
        flex: '1',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
    },
    btnBox: {
        display: 'flex',
        justifyContent: 'end',
        gap: '20px',
        padding: '24px'
    },
    textBox: {
        padding: '24px',
    }
}))

export function TranslateDialog(props){
    const {open = true, onClose} = props
    const classes = useStyles();
    const state = store.getState() || {};
    const lang = state.targetLanguage
    const renderTransContent = () => {
        const text = lang === 'none' || lang == '' ? 'Please set preferred language to activate the functionality' : 'Please turn on on-demand translation to activate the functionality'
        return (
            <div className={classes.textBox}>
                {text}
            </div>
        )
    }
    useEffect(() => {
        setDialogOpen(open)
    }, [open])
    const handleOk = () => {
        setDialogOpen(false)
        onClose()
        store.dispatch(setSettingVisible(true))
    }
    const [dialogOpen, setDialogOpen] = useState(open)
    
    return (
        <CommonDialog
        open={open}
        onClose={onClose}
        title={i18next.t("Unable to Translate")}
        content={renderTransContent()}
        maxWidth={false}
        footer={
          <div className={classes.btnBox}>
            <Button variant="contained" color="primary" onClick={handleOk}>{
            lang === 'none' || lang== '' ? 'Go to setting' : 'Turn On'}</Button>
            <Button variant="outlined" onClick={() => {onClose?.()}}>Cancel</Button>
          </div>
        }
      ></CommonDialog>
    )
}