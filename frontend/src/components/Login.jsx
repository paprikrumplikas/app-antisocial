import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
// @custom for google auth services. We use this hook instead of the GoogleLogin component to be able to style the button
import { useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';



import logo from '../assets/logo.png';
import shareVideo from '../assets/share.mp4';

import { createOrGetUser } from '../utils/createOrGetUser';

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // on mount, check if user is stored in localstorage. If so, set state to that value.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        console.log("Will now log out.")
        googleLogout();
        localStorage.clear();
        window.location.reload();   // reload
    };

    // @crucial @learning
    const login = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                /** @note response looks like this
                 * Object { access_token: "ya29.a0AcM612w8hJQuyFAlSvxCZfChaZ_j_0xoP95kdN4RV1HkPHfHr8k3MK5-SroGF3MEAZv9cHyIMphQgmoe9kM4weC-9mmIva91BnbIGn1L7XlYkmXO-Yrxp5bYOTL3nBOCkQbsTOSZmwRYbDPUou5Nvh1VUzfr4CWXDqwaCgYKAeMSARESFQHGX2MiLQPHnV8R5Jv2bx0kzeS9_w0170", token_type: "Bearer", expires_in: 3599, scope: "email profile https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/userinfo.email", authuser: "0", prompt: "none" }
                 */

                /** @note createOrGetUserdoes the following things 
                 * 1. uses the access token from response to fetch pfp and other user info from google's userinfo API
                 * 2. creates a user-schema doc for the user in sanity if it does not exist yet.
                 * 3. navigates to home page after verifying / creatin user
                 * 4. Sets userinfo from Google's API to local storage, returns that data
                */
                const result = await createOrGetUser(response, navigate); // @note sets user to localstrg
            } catch (error) {
                console.error('Error in createOrGetUser:', error);
            }
        },
        onError: (error) => {
            console.log('Login Failed:', error);
            localStorage.clear();
            setUser(null);
        },
        // Add these options to handle CORS properly
        flow: 'implicit',
        scope: 'email profile',
    });

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
                        {/** if user exists, state that it is already logged in and display logout button */}
                        {user ? (
                            <div className='flex flex-col items-center'>
                                <div className='text-blue-100 text-bold'>You already logged in.</div>
                                <button
                                    onClick={() => { handleLogout() }}
                                    type='button'
                                    className='flex flex-row items-center text-gray-800 font-bold tracking-wide bg-blue-100 rounded-full py-3 px-4 mt-2 outline-none overflow-hidden group'
                                >
                                    <span className=''>Touch some grass</span>
                                </button>
                                )
                            </div>
                        ) : (
                            <button
                                onClick={() => login()}
                                type='button'
                                className='flex flex-row items-center font-["Freckle_Face"] text-[#4B0E0E] tracking-wide bg-blue-100 rounded-full p-3 outline-none'
                            >
                                DO nOT SigN iN
                                <FcGoogle className='ml-2 h-5 w-5' />
                            </button>

                            /** @note @learning @crucial this is the original, the most simple solution
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