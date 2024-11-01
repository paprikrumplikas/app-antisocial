import React, { useState, useEffect, useRef } from 'react';
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { PinDetails, Sidebar, UserProfile } from '../components';
import Pins from './Pins';
import { userQuery } from '../utils/dataQueries';
import { clientRead, clientWrite } from '../client';
import logo from "../assets/logo.png";

import { fetchUser } from '../utils/fetchUser';


export const Home = () => {

    const [toggleSideBar, setToggleSidebar] = useState(false);
    const [user, setUser] = useState(null);
    // @learning The scrollRef allows you to manipulate the scroll position of this main content area programmatically. 
    // For example, you could use it to scroll to specific elements,
    const scrollRef = useRef(null);

    // @learning getting userInfo from local storage. If user is undefined we clear it as that means sth went wrong, maybe user token expired
    // made this a util func, using that instead
    // const userInfo = localStorage.getItem('user') !== "undefined" ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
    const userInfo = fetchUser();

    console.log("userInfo ", userInfo);
    console.log("SUB ", userInfo?.sub);  // in instructors version, .googleId

    // getting user from sanity instead of relying on local storage. Benefits:
    // This ensures that the app is working with the most up-to-date user data from the backend.
    // Data consistency: Ensures the app is using the latest data from Sanity, not potentially outdated local storage data.
    // Security: Prevents relying solely on potentially manipulated local storage data.
    useEffect(() => {
        // defined in data.js
        if (userInfo?.sub) {

            const query = userQuery(userInfo?.sub);

            clientRead.fetch(query)
                .then((data) => {
                    console.log("query data ", data);
                    setUser(data[0])
                });
        }
    }, []);


    useEffect(() => {
        // at the start, set up the scroll to be at the top of the page
        scrollRef.current.scroll(0, 0);
    })


    return (
        <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>

            {/** sidebar for desktop navigation 
             * @note flex initial allows flex item grow but not shrink
            */}
            <div className='hidden md:flex h-screen flex flex-initial'>
                <Sidebar user={user && user} />
            </div>


            {/** header and sidebar for mobile */}
            <div className='md:hidden flex flex-row bg-gray-950'>
                <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
                    <HiMenu
                        fontSize={40}
                        className='cursor-pointer text-blue-100'
                        onClick={() => setToggleSidebar(true)}
                    />
                    <Link to="/">
                        <img
                            src={logo}
                            alt="logo"
                            className='w-32'
                        />
                    </Link>
                    <Link to={`/user-profile/${user?._id}`}>
                        <img
                            src={user?.image}
                            alt="pfp"
                            className='w-16 rounded-2xl'
                        />
                    </Link>
                </div>

                {toggleSideBar && (
                    <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
                        {/* close icon*/}
                        <div className='absolute w-full flex justify-end items-center p-2 text-blue-200 pt-4 pr-4'>
                            <AiFillCloseCircle
                                fontSize={30}
                                className='cursor-pointer'
                                onClick={() => setToggleSidebar(false)}
                            />
                        </div>
                        {/** @syntax @learning user={user && user} syntax:
                    common JavaScript pattern used for conditional rendering. It's a shorthand way of saying "if user exists and is truthy, pass user as the prop value; otherwise, pass false"*/}
                        {/** @note @learning we pass the setToggleSidebar as a prop (even though the parent container has some control over whether it will appear) becauese
                     * we also want to be able to close the sidebar when user clicks one of the elements
                     */}
                        <Sidebar user={user && user} closeToggle={setToggleSidebar} />
                    </div>
                )}
            </div>


            {/** main content area that is scrollable and takes up the remaining part of the space  */}
            <div className="pb-2 flex-1 h-screen overflow-y-scroll bg-gray-800" ref={scrollRef}>
                <Routes>
                    <Route path="/user-profile/:userId/" element={<UserProfile />} />
                    <Route path='/*' element={<Pins user={user && user} />} />
                </Routes>
            </div>

        </div>
    )
}
