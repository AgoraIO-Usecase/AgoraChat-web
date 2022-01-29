import React, { useState,useEffect, useCallback } from 'react'
import './login.css'
import i18next from "i18next";
import { getToken, loginWithToken } from '../api/loginChat'
// import { createHashHistory } from 'history';
// import { useHistory } from 'react-router-dom'

import store from '../redux/store'
import { setMyUserInfo, setFetchingStatus } from '../redux/actions'

export default function Login() {
    // const history = useHistory()
    const [notice, setNotice] = useState({
        show: false,
        text: ''
    })

    const [values, setValues] = useState({
        agoraId: '',
        nickName: '',
    });

    const login = useCallback(() => {
        if (!values.agoraId) {
            return setNotice({ show: true, text: 'agoraId is required' })
        } else if (!values.nickName) {
            return setNotice({ show: true, text: 'nickName is required' })
        } else if (values.nickName.length > 32 || values.agoraId.length > 32) {
            return setNotice({ show: true, text: 'nickName or agoraId is too long' })
        } else {
            setNotice({
                show: false
            })
        }
        store.dispatch(setFetchingStatus(true))
        getToken(values.agoraId, values.nickName).then((res) => {
            const { accessToken } = res
            console.log(accessToken)
            loginWithToken(values.agoraId, accessToken)
            store.dispatch(setMyUserInfo({ agoraId: values.agoraId, nickName: values.nickName }))
            sessionStorage.setItem('webim_auth', JSON.stringify({ ...values, accessToken }))
        })
    }, [values])

    useEffect(() => {
        const listener = function (event) {
            let curKey = event.which
            if (curKey === 13) {
                console.log('AAA>>>');
                login()
            }
        }
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener)
        }
    }, [login])

    const handleChange = (prop) => (event) => {
        let value = event.target.value
        if (prop === 'agoraId') {
            value = event.target.value.replace(/[^\w\.\/]/ig, '')
        }
        console.log('value', value)
        setValues({ ...values, [prop]: value });
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <div className='login-form-icon'></div>
                <div className='login-form-AC'></div>
                {notice.show ? <div className='login-form-notice'>
                    {notice.text}
                </div> : null}
                <input className='login-form-input' 
                placeholder={i18next.t('login-UserID')} 
                onChange={handleChange('agoraId')} value={values.agoraId}></input>
                <input className='login-form-input' placeholder={i18next.t('login-NickName')} value={values.nickName} onChange={handleChange('nickName')}></input>
                <input type='button' className='login-form-input button' value={i18next.t('login-Login')} onClick={login} />
            </div>
            <div className='login-copyright'>
                © 2022 Agora
            </div>
        </div>
    )
}


