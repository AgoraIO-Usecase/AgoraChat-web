import React, { useState,useEffect, useCallback } from 'react'
import './login.css'
import i18next from "i18next";
import { getToken, loginWithToken, loginWithPassword } from '../api/loginChat'
// import { createHashHistory } from 'history';
// import { useHistory } from 'react-router-dom'

import store from '../redux/store'
import { setMyUserInfo, setFetchingStatus } from '../redux/actions'
import { message } from '../components/common/alert'
import WebIM from '../utils/WebIM'
export default function Login() {
    // const history = useHistory()
    const [notice, setNotice] = useState({
        show: false,
        text: ''
    })

    const [values, setValues] = useState({
        agoraId: '',
        nickName: '',
        password: '',
    });

    const login = useCallback(() => {
        console.log('value>>>',values);
        if (!values.agoraId) {
            return setNotice({ show: true, text: 'agoraId is required' })
        } else if (!(values.nickName || values.password)) {
            return setNotice({ show: true, text: 'nickName is required' })
        } else if (values.nickName.length > 32 || values.agoraId.length > 32) {
            return setNotice({ show: true, text: 'nickName or agoraId is too long' })
        } else {
            setNotice({
                show: false
            })
        }
        store.dispatch(setFetchingStatus(true))
        if (values.nickName) {
            getToken(values.agoraId, values.nickName).then((res) => {
                const { accessToken, agoraUid } = res
                WebIM.conn.agoraUid = agoraUid
                loginWithToken(values.agoraId, accessToken)
                
                store.dispatch(setMyUserInfo({ agoraId: values.agoraId, nickName: values.nickName }))
                sessionStorage.setItem('webim_auth', JSON.stringify({ ...values, accessToken, agoraUid }))
            }).catch(() => {
                store.dispatch(setFetchingStatus(false))
                message.error('login fail.')
            })
        } else if (values.password) {
            // loginWithPassword(values.agoraId, values.password)

            let options = {
                user: values.agoraId,
                pwd: values.password
            };

            WebIM.conn.open(options).then((res) => {
                const { accessToken } = res
                store.dispatch(setMyUserInfo({  agoraId: values.agoraId, password: values.password }))
                sessionStorage.setItem('webim_auth', JSON.stringify({ agoraId: values.agoraId, password: values.password, accessToken:accessToken }))
            }).catch((err) => {
                store.dispatch(setFetchingStatus(false))
                console.log('catch', err)
                // message.error('login fail.')
                if(err.type === 1){
                    let reason = err.message
                    if(err.data.message){
                        reason = err.data.message
                    }
                    return setNotice({ show: true, text: reason })
                }
            })

        }
        // getToken(values.agoraId, values.nickName).then((res) => {
        //     const { accessToken } = res
        //     loginWithToken(values.agoraId, accessToken)
        //     store.dispatch(setMyUserInfo({ agoraId: values.agoraId, nickName: values.nickName }))
        //     sessionStorage.setItem('webim_auth', JSON.stringify({ ...values, accessToken }))
        // }).catch(() => {
        //     store.dispatch(setFetchingStatus(false))
        //     message.error('login fail.')
        // })
    }, [values])

    useEffect(() => {
        const listener = function (event) {
            let curKey = event.which
            if (curKey === 13) {
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
                <input className='login-form-input' placeholder={i18next.t('login-Password')} value={values.password} onChange={handleChange('password')}></input>
                <input type='button' className='login-form-input button' value={i18next.t('login-Login')} onClick={login} ></input>
            </div>
            <div className='login-copyright'>
                © 2022 Agora
            </div>
        </div>
    )
}


