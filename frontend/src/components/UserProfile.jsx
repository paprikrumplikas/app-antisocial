import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/dataQueries";
import { clientRead } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { IoMdLogOut } from 'react-icons/io';
import Sparkle from 'react-sparkle';

import busted from '../assets/busted2.png';




const UserProfile = ({ }) => {
    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState("created"); // either created or pinned
    const [activeBtn, setActiveBtn] = useState("created");

    const navigate = useNavigate();
    // @note userId from the URL is Google's sub
    // the id of the user whose profile we are visiting
    const { userId } = useParams();

    const randomImage = "https://picsum.photos/1600/900?grayscale";

    const activeBtnStyles = "bg-red-500 text-white font-bold p-2 w-40 outline-none";
    const notActiveBtnStyles = "bg-red-300 text-gray-800 font-bold p-2 w-40 outline-none";


    useEffect(() => {
        const query = userQuery(userId);
        clientRead.fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }, [userId]);

    useEffect(() => {
        if (text === "created") {
            const createdPinsQuery = userCreatedPinsQuery(userId);

            clientRead.fetch(createdPinsQuery)
                .then((data) => (
                    setPins(data)
                ))
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId);  // more like pinnedPinsQuery

            clientRead.fetch(savedPinsQuery)
                .then((data) => (
                    setPins(data)
                ))
        }
    }, [text, userId])



    const handleLogout = () => {
        googleLogout();
        localStorage.clear();
        navigate('/login');
    };

    if (!user) {
        return <Spinner message="Loading profile..." />
    }


    return (
        <div className='relative pb-2 h-full justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    <div className='flex flex-col justify-center items-center px-8 pt-8 relative'>
                        <img
                            src={randomImage}
                            alt="banner"
                            className='w-full h-370 2xl:h-730 shadow-lg object-cover rounded-xl border-4 border-blue-100 '
                        />
                        <img
                            src={user.image}
                            alt="profilepic"
                            className='rounded-full w-30 h-30 -mt-16 border-[15px] border-gray-800'
                        />
                        {pins?.length > 0 &&
                            <p className='text-gray-800 font-bold xl:text-[128px] lg:text-[90px] md:text-[75px] sm:text-[50px] text-[25px] mb-16 absolute'>BAD FOLK</p>
                        }
                        <h1 className='font-bold text-2xl text-blue-100'>
                            {user.userName}
                        </h1>
                        <div className='absolute top-0 z-1 right-0 p-3'>
                            {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).sub === userId && (
                                <button
                                    onClick={() => { handleLogout() }}
                                    type='button'
                                    className='relative flex flex-row items-center text-white font-bold tracking-wide bg-red-500 rounded-full py-3 px-4 outline-none overflow-hidden group'
                                >
                                    <span className='relative z-10'>Touch some grass</span>
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent shine-animation'></div>
                                </button>
                            )}
                        </div>
                    </div>

                    {/** switch button */}
                    <div className='text-center my-7'>
                        <button
                            type="button"
                            onClick={() => {
                                setText("created");
                                setActiveBtn("created");
                            }}
                            className={`rounded-l-full ${activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Created
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setText("pinned");
                                setActiveBtn("pinned");
                            }}
                            className={`rounded-r-full ${activeBtn === "pinned" ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Pinned
                        </button>
                    </div>

                    {/** showing pins */}
                    {pins?.length ? (
                        <div className='px-7'>
                            {activeBtn === "created" ? (
                                localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).sub === userId && (
                                    <div className='text-center text-blue-100 pb-4 mx-7 font-bold'>
                                        You have been a BAD FOLK. You were creating posts, slouching in front of the computer instead of touching some grass.
                                    </div>
                                )
                            ) : (
                                localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).sub === userId && (
                                    <div className='text-center text-blue-100 pb-4 mx-7 font-bold'>
                                        You have been a BAD FOLK. You were pinning aorund, doom-scrolling the whole day instead of touching some grass.
                                    </div>
                                )
                            )}
                            <MasonryLayout pins={pins} />
                        </div>
                    ) : (
                        <div className='text-center text-blue-100 pb-4 mx-7 font-bold relative'>
                            No pins found. Good job, keep it that way. Keep enjoying life, go touch some grass.
                            <Sparkle
                                color="white"
                                count={7}
                                minSize={7}
                                maxSize={18}
                                fadeOutSpeed={7}
                                flicker={false}
                                overlayColor="transparent"
                                style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%' }}
                            />
                        </div>
                    )
                    }
                </div>

            </div>
        </div >
    )
}

export default UserProfile