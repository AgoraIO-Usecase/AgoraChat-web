import React, { useState,useEffect, useCallback } from 'react'
import './login.css'
import i18next from "i18next";
import { getToken, loginWithToken, loginWithPassword } from '../api/loginChat'
import { createHashHistory } from 'history';
// import { useHistory } from 'react-router-dom'

import store from '../redux/store'
import { setMyUserInfo, setFetchingStatus } from '../redux/actions'
import { message } from '../components/common/alert'
import WebIM from '../utils/WebIM'
import { IconButton } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import loading from '../assets/loading.png'

export default function Login() {
    const history = createHashHistory()
    const [notice, setNotice] = useState({
        show: false,
        text: ''
    })

    const [values, setValues] = useState({
        agoraId: '',
        nickName: '',
        password: '',
        showPassword: false
    });
    const [activeType, setActiveType] = useState('password')
    const [disabled, setdisabled] = useState(true)
    const [loginBtn, setLoginBtn] = useState(i18next.t('login-Login'))

    const login = useCallback(() => {
        console.log('value>>>',values);
        setLoginBtn('')
        if (!values.agoraId) {
            return setNotice({ show: true, text: 'agoraId is required' })
        } else if (!(values.nickName || values.password)) {
            return setNotice({ show: true, text: 'password is required' })
        } else if (values.nickName.length > 32 || values.agoraId.length > 32) {
            return setNotice({ show: true, text: 'agoraId is too long' })
        } else {
            setNotice({
                show: false
            })
        }
        // store.dispatch(setFetchingStatus(true))
        if (values.password) {
            getToken(values.agoraId, values.password).then((res) => {
                const { accessToken, agoraUid } = res
                WebIM.conn.agoraUid = agoraUid
                loginWithToken(values.agoraId, accessToken).then(value => {
                    console.log(value, 'loginWithToken')
                }).catch(err => {
                    setNotice({ show: true, text: 'Wrong Username or Password' })
                }).finally(_ => {
                    setLoginBtn(i18next.t('login-Login'))
                })
                
                store.dispatch(setMyUserInfo({ agoraId: values.agoraId, nickName: values.nickName, password: values.password }))
                sessionStorage.setItem('webim_auth', JSON.stringify({ ...values, accessToken, agoraUid }))
            }).catch(() => {
                // store.dispatch(setFetchingStatus(false))
                setNotice({ show: true, text: 'login fail' })
                setdisabled(true)
                setLoginBtn(i18next.t('login-Login'))
                // message.error('login fail.')
            })
        }
        else if (values.password) {
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
    const jumpToSignUp = () => {
        history.push('/signup')
    }
    useEffect(() => {
        const webim_auth = JSON.parse(sessionStorage.getItem('webim_auth'))
        console.log(webim_auth)
        if (webim_auth) {
            setValues({
                agoraId: webim_auth.agoraId || '',
                nickName: webim_auth.nickName || '',
                password: webim_auth.password || '',
            })
        }
    }, [])
    const handleClickClearagoraId = () => {
        setValues({
            agoraId: ''
        })
    }
    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        })
        if (activeType === 'password') {
            setActiveType('text')
        } else {
            setActiveType('password')
        }
    }
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }
    const { agoraId , password } = values
    useEffect(() => {
        if (agoraId && password) {
            setdisabled(false)
        } else {
            setdisabled(true)
        }
    }, [agoraId , password])
    return (
        <div className='login-container'>
            <div className='login-form'>
                <div className='login-form-icon'></div>
                <div className='login-form-AC'></div>
                {notice.show ? <div className='login-form-notice'>
                    {notice.text}
                </div> : null}
                <div className='input-box'>
                    <input className='login-form-input' 
                        placeholder={i18next.t('login-UserID')} 
                        onChange={handleChange('agoraId')}
                        value={values.agoraId}></input>
                    {
                        values.agoraId &&
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickClearagoraId}
                            onMouseDown={handleMouseDownPassword}
                            className='close-btn'>
                            <HighlightOffIcon />
                        </IconButton>
                    }
                </div>
                <div className='input-box'>
                    <input type={activeType} className='login-form-input' placeholder={i18next.t('login-Password')} value={values.password} onChange={handleChange('password')}></input>
                    <IconButton
                        aria-label="toggle password visibility"
                        className='close-btn'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}>
                        {values.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                </div>
                <div className='loading-box'>
                    <input disabled={disabled} type='button' className='login-form-input button' value={loginBtn} onClick={login} ></input>
                    {
                        !loginBtn && <img className='loading-img' src={loading} alt="" />
                    }
                </div>
                <div className='sign-up-box'>
                    {i18next.t('NoAccount')}
                    <span onClick={jumpToSignUp} className='sign-up'>{i18next.t('Register')}</span>
                </div>
            </div>
            <div className='login-copyright'>
                © 2022 Agora
            </div>
        </div>
    )
}


