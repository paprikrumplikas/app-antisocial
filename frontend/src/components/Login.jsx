import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

import logo from '../assets/logo.png';
import shareVideo from '../assets/share.mp4';

// @note to use google auth services
import { GoogleLogin, googleLogout } from '@react-oauth/google';


const Login = () => {
    const navigate = useNavigate();

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

                        <button
                            type='button'
                            className='flex flex-row items-center font-["Freckle_Face"] text-[#4B0E0E] tracking-wide bg-[#A2C4C9] rounded-lg p-3 outline-none'
                            onClick=""
                            disabled=""
                        >
                            DO nOT SigN iN
                            <FcGoogle className='ml-2 h-5 w-5' />
                        </button>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login