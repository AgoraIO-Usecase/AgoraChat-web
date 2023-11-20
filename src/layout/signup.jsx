import React, { useState,useEffect, useCallback } from 'react'
import './login.css'
import i18next from "i18next";
import { getToken, loginWithToken, loginWithPassword, signUp } from '../api/loginChat'
import { createHashHistory } from 'history';
// import { useHistory } from 'react-router-dom'

import store from '../redux/store'
import { setMyUserInfo, setFetchingStatus } from '../redux/actions'
import { message } from '../components/common/alert'
import loading from '../assets/loading.png'
import AlertDialogSlide from '../components/common/dialog'
import closeIcon from '../assets/Xmark@2x.png'
import eyeOpen from '../assets/eye@2x.png'
import eyeClose from '../assets/eye_slash@2x.png'
export default function SignUp() {
    const history = createHashHistory()
    const [notice, setNotice] = useState({
        show: false,
        text: ''
    })

    const [values, setValues] = useState({
        agoraId: '',
        nickName: '',
        password: '',
        passwordTwo: '',
        showPassword: false,
        showPassword1: false
    });
    const [activeType, setActiveType] = useState('password')
    const [activeType1, setActiveType1] = useState('password')
    const [disabled, setdisabled] = useState(true)
    const [loginBtn, setLoginBtn] = useState(i18next.t('Sign Up'))
    const [useDialogOpen, setDialogOpen] = useState(false)

    const login = useCallback(() => {
        setLoginBtn('')
        if (!values.agoraId) {
            setLoginBtn(i18next.t('SignUp'))
            return setNotice({ show: true, text: 'agoraId is required' })
        } else if (!(values.password)) {
            return setNotice({ show: true, text: 'password is required' })
        }  else if (!(values.passwordTwo)) {
            setLoginBtn(i18next.t('SignUp'))
            return setNotice({ show: true, text: 'confirm password is required' })
        } else if (values.agoraId.length > 32) {
            setLoginBtn(i18next.t('SignUp'))
            setdisabled(true)
            return setNotice({ show: true, text: 'Username is too long' })
        } else {
            setNotice({
                show: false
            })
        }
        // store.dispatch(setFetchingStatus(true))
        if (values.password) {
            signUp(values.agoraId, values.password).then(res => {
                if(res?.code == "RES_OK"){
                    setDialogOpen(true)
                    store.dispatch(setMyUserInfo({ agoraId, password }))
                    sessionStorage.setItem('webim_auth', JSON.stringify({ agoraId, password }))
                }else{
                    setNotice({ show: true, text: 'Sign Up Fail.' })
                    setdisabled(true)
                }
            }).catch(err => {
                // message.error('Sign Up Fail.')
                console.log('err', err)
                setNotice({ show: true, text: 'Sign Up Fail.' })
                setdisabled(true)
            }).finally(_ => {
                setLoginBtn(i18next.t('SignUp'))
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
            value = event.target.value.replace(/[^\w\.\-\/]/ig, '')   
        }
        setValues({ ...values, [prop]: value })
    };
    const { agoraId , password , passwordTwo } = values
    useEffect(() => {
        if (agoraId && password && passwordTwo) {
            if (password === passwordTwo) {
                setdisabled(false)
                setNotice({ show: false})
            } else {
                setdisabled(true)
                setNotice({ show: true, text: 'Passwords do not match' })
            }
        } else {
            setdisabled(true)
        }
    }, [agoraId , password , passwordTwo])
    const jumpToLogin = () => {
        history.push('/login')
    }
    const handleClickClearagoraId = () => {
        setValues({
            ...values,
            agoraId: ''
        })
    }
    const handleClickShowPassword = (num) => {
        if (num) {
            setValues({
                ...values,
                showPassword1: !values.showPassword1
            })
            if (activeType1 === 'password') {
                setActiveType1('text')
            } else {
                setActiveType1('password')
            }
        } else {
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
    }
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }
    const footerCom = () => {
        return (
          <div className='footer-btn'>
              <span onClick={() => setDialogOpen(false)}>Cancel</span>
              <span onClick={jumpToLogin}>Login</span>
          </div>
        )
    }
    return (
        <div className='login-container'>
            <div className='login-form sign-up-form'>
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
                        onClick={() => handleClickShowPassword(0)}
                        onMouseDown={handleMouseDownPassword}
                        className='close-btn' />
                        :
                        <img
                            src={eyeOpen}
                            alt="close"
                            onClick={() => handleClickShowPassword(0)}
                            onMouseDown={handleMouseDownPassword}
                            className='close-btn' />
                    }
                </div>
                <div className='input-box'>
                    <input type={activeType1} className='login-form-input' placeholder={i18next.t('ComnfirmPassword')} value={values.passwordTwo} onChange={handleChange('passwordTwo')}></input>
                    {
                        values.showPassword1?
                        <img
                        src={eyeClose}
                        alt="close"
                        onClick={() => handleClickShowPassword(1)}
                        onMouseDown={handleMouseDownPassword}
                        className='close-btn' />
                        :
                        <img
                            src={eyeOpen}
                            alt="close"
                            onClick={() => handleClickShowPassword(1)}
                            onMouseDown={handleMouseDownPassword}
                            className='close-btn' />
                    }
                </div>
                <div className='loading-box'>
                    <input disabled={disabled} type='button' className='login-form-input button' value={loginBtn} onClick={login} />
                    {
                        !loginBtn && <img className='loading-img' src={loading} alt="" />
                    }
                </div>
                <div className='sign-up-box'>
                    <span onClick={jumpToLogin} className='sign-up'>{i18next.t('BacktoLogin')}</span>
                </div>
            </div>
            <div className='login-copyright'>
                © 2022 Agora
            </div>
            <AlertDialogSlide
                open={Boolean(useDialogOpen)}
                onClose={() => setDialogOpen(false)}
                title={i18next.t('Registration Success')}
                footer={footerCom()}
                content={''}
                className='mysignupdialog'
            />
        </div>
    )
}


