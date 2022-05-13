import React, { useState } from 'react'
import i18next from "i18next";
import { Box, InputBase } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {addGroup} from '../../../../api/groupChat/addGroup'
import search_icon from '../../../../assets/search.png'

const useStyles = makeStyles((theme) => {
    return ({
        searchBox: {
            height: '36px',
            width: '100%',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '23px',
            background: '#F4F5F7'
        },
        inputSearch: {
            borderBottom: 'none',
            width: '100%',
            padding: '6px 5px 7px',
        },
        searchImg: {
            width: '18px',
            height: '18px',
            paddingLeft: '8px'
        },
        joinBox: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '54px',
            borderRadius: '23px',
            background: '#F4F5F7',
            padding: '0 8px'
        },
        joinBoxText: {
            typeface: 'Ping Fang SC',
            fontWeight: 'Semibold(600)',
            fontSize: '16px',
            character: '0',
            height:'22px',
            color:'#005FFF',
            cursor:'pointer',
        }
    })
});



const JoinGroup = () => {
    const classes = useStyles();
    const [inputValue, setInputValue] = useState('')

    const hangleInputValue = (event) => {
        setInputValue(event.target.value)
    }

    return (
        <Box>
            <Box className={classes.searchBox}>
                <img src={search_icon} alt="" className={classes.searchImg} />
                <InputBase type="number" placeholder={i18next.t('Search')} className={classes.inputSearch} onChange={hangleInputValue} />
            </Box>
            {inputValue.length > 0 && <Box className={classes.joinBox}>
                <Typography>{`GroupID: ${inputValue}`}</Typography>
                <Typography className={classes.joinBoxText} onClick={() => addGroup(inputValue)}>Apply</Typography>
            </Box>}
        </Box>
    )
}

export default JoinGroup;