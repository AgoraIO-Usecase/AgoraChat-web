import React, { useState,useEffect, useCallback } from 'react'
import './login.css'
import i18next from "i18next";
import { getToken, loginWithToken } from '../api/loginChat'
import { createHashHistory } from 'history';
// import { useHistory } from 'react-router-dom'

import store from '../redux/store'
import { setMyUserInfo } from '../redux/actions'
import loading from '../assets/loading.png'
import closeIcon from '../assets/Xmark@2x.png'
import eyeOpen from '../assets/eye@2x.png'
import eyeClose from '../assets/eye_slash@2x.png'

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
                loginWithToken(values.agoraId.toLowerCase(), accessToken).then(value => {

                }).catch(err => {
                    console.log(err)
                    setNotice({ show: true, text: 'Wrong Username or Password' })
                }).finally(_ => {
                    setTimeout(() => {
                        setLoginBtn(i18next.t('login-Login'))
                    }, 1500)
                })
                
                store.dispatch(setMyUserInfo({ agoraId: values.agoraId, password: values.password }))
                sessionStorage.setItem('webim_auth', JSON.stringify({ ...values, accessToken, agoraUid }))
            }).catch(() => {
                // store.dispatch(setFetchingStatus(false))
                setNotice({ show: true, text: 'login fail' })
                setdisabled(true)
                setLoginBtn(i18next.t('login-Login'))
                // message.error('login fail.')
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
        if (webim_auth && webim_auth.password) {
            setValues({
                agoraId: webim_auth.agoraId || '',
                nickName: webim_auth.nickName || '',
                password: webim_auth.password || '',
            })
        } else {
            sessionStorage.removeItem('webim_auth')
        }
    }, [])
    const handleClickClearagoraId = () => {
        setValues({
            ...values,
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
    // const { agoraId , password } = values
    useEffect(() => {
        if (values.agoraId && values.password) {
            setdisabled(false)
        } else {
            setdisabled(true)
        }
    }, [values.agoraId , values.password])
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
                        <img
                            src={closeIcon}
                            alt="close"
                            onClick={handleClickClearagoraId}
                            onMouseDown={handleMouseDownPassword}
                            className='close-btn' />
                    }
                </div>
                <div className='input-box'>
                    <input type={activeType} className='login-form-input' placeholder={i18next.t('login-Password')} value={values.password} onChange={handleChange('password')}></input>
                    {
                        values.showPassword?
                        <img
                        src={eyeClose}
                        alt="close"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        className='close-btn' />
                        :
                        <img
                            src={eyeOpen}
                            alt="close"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            className='close-btn' />
                    }
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
                © 2024 Agora
            </div>
        </div>
    )
}


