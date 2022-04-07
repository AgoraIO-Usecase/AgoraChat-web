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
}))
export function Report(props) {
    const { open, onClose, currentMsg } = props
    const [value, setValue] = React.useState('adult');
    const [textValue, setTextValue] = useState('')
    const classes = useStyles();
    const handleChange = (event) => {
        setValue(event.target.value)
    }

    const handleConfrm = () => {
        WebIM.conn.reportMessage({
            reportType: value, // 举报类型。
            reportReason: textValue, // 举报原因。
            messageId: currentMsg.id,
	    }).then(() =>{
            message.success('Report success')
            setTextValue('')
            setValue('adult')
            onClose()
        })
    }

    const handleTextChange = (e)=>{
        console.log(e.target.value)
        setTextValue(e.target.value)
    }

    function renderContent() {
        return (
            <div className={classes.root}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Category</FormLabel>
                    <RadioGroup aria-label="gender" row name="gender1" value={value} onChange={handleChange} style={{ marginLeft: '10%' }}>
                        <FormControlLabel value="adult" control={<Radio />} label="Adult" />
                        <FormControlLabel value="racy" control={<Radio />} label="Racy" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                </FormControl>
                <br />
                <TextareaAutosize
                    style={{ margin: '0 10%' }}
                    minRows={4}
                    maxRows={6}
                    onChange={handleTextChange}
                    value={textValue}
                    aria-label="maximum height"
                    placeholder="Maximum 4 rows"
                    defaultValue=""
                />
                <div style={{ margin: '45px auto' }}>
                    <Button variant="contained" color="primary" style={{marginRight: '50px'}} onClick={handleConfrm}>
                        Confrm
                    </Button>
                    <Button variant="contained" onClick={() => {onClose()}}>Cancel</Button>
                </div>
            </div>
        )
    }
    return (
        <CommonDialog
            open={open}
            onClose={onClose}
            title={i18next.t("Report")}
            content={renderContent()}
            maxWidth={700}
        ></CommonDialog>
    )
}


export const messageEvents = [{ name: i18next.t("Report"), value: 'report' }]

export function onMsgEventClick(e, value, msg) {

}
