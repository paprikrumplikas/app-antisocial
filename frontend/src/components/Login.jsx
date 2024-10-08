import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';


import logo from '../assets/logo.png';
import shareVideo from '../assets/share.mp4';

// @note to use google auth services
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { createOrGetUser } from '../../utils';

// @crucial to connect frontend with Sanity backend
import { clientWrite, clientRead } from '../container_ie_pages/client.js';


const Login = () => {
    const navigate = useNavigate();
    const user = false;
    const googleLoginButtonRef = useRef(null);

    // @crucial @learning
    const login = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                localStorage.setItem("user", JSON.stringify(response));
                await createOrGetUser(response, navigate);    // @note defined in index.js
                navigate('/');
            } catch (error) {
                console.error('Error in createOrGetUser:', error);
            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    const responseGoogle = (response) => { };

    return (
        <div className="flex flex-col h-screen">
            <div className="relative w-full h-full">
                <video
                    src={shareVideo}
                    type="video/mp4"
                    loop
                    controls={false}
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />

                {/** * @note with absolute, it is positioned on top of the vid*/}
                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                    <div className='p-8'>
                        <img
                            src={logo}
                            alt="logo"
                            width="300px"
                        />
                    </div>
                    <div className='shadow-2xl'>
                        {user ? (
                            <div>Logged in</div>
                        ) : (
                            <button
                                onClick={() => login()}
                                type='button'
                                className='flex flex-row items-center font-["Freckle_Face"] text-[#4B0E0E] tracking-wide bg-[#A2C4C9] rounded-lg p-3 outline-none'
                            >
                                DO nOT SigN iN
                                <FcGoogle className='ml-2 h-5 w-5' />
                            </button>

                            /** @note @learning this is the original, the most simple solution
                             * but this does not accept classNames so we could not style the button
                             * So instead, we use the useGoogleLogin hook
                             * 
                                         <GoogleLogin
                                            onSuccess={(repsonse) => { console.log(repsonse) }}
                                            onError={(error) => (console.log(error))}
                                         />
                            */
                        )}

                    </div>
                </div>

            </div>
        </div >
    )
}

export default Login