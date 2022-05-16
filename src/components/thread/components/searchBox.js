import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import searchgray from '../images/searchgray.png'
import searchCancel from '../images/cancel.png'

const useStyles = makeStyles((theme) => {
    return {
        container: {
            height: "36px",
            width: '326px',
            display: "flex",
            justifyContent: 'space-between',
        },
        searchCon: {
            display: "flex",
            width: '253px',
            height: '36px',
            lineHeight: '36px',
            background: '#F2F2F2',
            borderRadius: '18px'
        },
        searchIcon: {
            height: '36px',
            width: '36px',
            cursor: 'pointer',
            background: `url(${searchgray}) center center no-repeat`,
        },
        searchInput: {
            height: '36px',
            lineHeight: '36px',
            width: '180px',
            border: 'none',
            background: 'none',
            outline: 'none',
            padding: '0',
            fontSize: '16px',
            color: '#000',
        },
        cancelIcon: {
            height: '36px',
            width: '36px',
            background: `url(${searchCancel}) center center no-repeat`,
            cursor: 'pointer',
        },
        cancel: {
            width: '95px',
            textAlign: 'center',
            height: '36px',
            lineHeight: '36px',
            fontWeight: '600',
            fontSize: '16px',
            color: '#005FFF',
            cursor: 'pointer',
        }

    };
});

const SearchBox = (props) => {
    const classes = useStyles();
    const [searchValue, setSearchValue] = useState('');
    const changeSearchValue = (e) => {
        setSearchValue(e.target.value);
    }
    const closeSearchBar = (state) => {
        props.changeSearchBarState(state)
    }
    const search = () => {
        props.searchValue(searchValue)
    }
    const clearInput = (e) => {
        setSearchValue('');
    }

    return (
        <div className={classes.container}>
            <div className={classes.searchCon}>
                <div className={classes.searchIcon} onClick={search}></div>
                <input className={classes.searchInput} value={searchValue} onChange={(e) => changeSearchValue(e)}></input>
                <div className={classes.cancelIcon} onClick={clearInput}></div>
            </div>
            <div className={classes.cancel} onClick={(e) => closeSearchBar(false)}>Cancel</div>
        </div>
    );
}
export default SearchBox