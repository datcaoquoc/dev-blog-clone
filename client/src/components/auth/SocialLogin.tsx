import React from 'react'
import { useDispatch } from 'react-redux'

import { GoogleLogin, GoogleLoginResponse } from 'react-google-login-lite';
import { FacebookLogin, FacebookLoginAuthResponse } from 'react-facebook-login-lite';
import { gapi } from 'gapi-script';
import { googleLogin, facebookLogin } from '../../redux/actions/authAction'

const SocialLogin = () => {
  const dispatch = useDispatch()
  const clientId = "117980782616-76j2jl68cjfrn9npdjrt0o2hh36eh277.apps.googleusercontent.com"
  React.useEffect(()=> {
    gapi.load("client:auth2", ()=>{
      gapi.auth2.init({clientId:clientId})
    })
  },[])

  const onSuccess = (googleUser: GoogleLoginResponse) => {
    const id_token = googleUser.getAuthResponse().id_token
    dispatch(googleLogin(id_token))
  }
  
  const onFBSuccess = (response: FacebookLoginAuthResponse) => {
    const { accessToken, userID } = response.authResponse
    dispatch(facebookLogin(accessToken, userID))
  }
  

  return (
    <>
      <div className="my-2">
        <GoogleLogin 
        client_id={clientId}
        cookiepolicy='single_host_origin'
        onSuccess={onSuccess}
        />
      </div>

      <div className="my-2">
        <FacebookLogin 
        appId="2504959926303783"
        onSuccess={onFBSuccess}
        />
      </div>
    </>
  )
}

export default SocialLogin
