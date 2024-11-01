import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from "../utils/dataQueries";
import { clientRead } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { IoMdLogOut } from 'react-icons/io';


const UserProfile = ({ }) => {
    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState("created"); // either created or saved
    const [activeBtn, setActiveBtn] = useState("created");

    const navigate = useNavigate();
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

            console.log("xxxxxx ", pins?.length);

        } else {
            const savedPinsQuery = userSavedPinsQuery(userId);

            clientRead.fetch(savedPinsQuery)
                .then((data) => (
                    setPins(data)
                ))

            console.log("yyyyy ", pins?.length);

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
                    <div className='flex flex-col justify-center items-center px-8 pt-8'>
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
                        <h1 className='font-bold text-2xl text-blue-100'>
                            {user.userName}
                        </h1>
                        <div className='absolute top-0 z-1 right-0 p-3'>
                            {userId === user._id && (
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
                            tpye="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn("created");
                            }}
                            className={`rounded-l-full ${activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Created
                        </button>
                        <button
                            tpye="button"
                            onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn("saved");
                            }}
                            className={`rounded-r-full ${activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Saved
                        </button>
                    </div>

                    {/** showing pins */}
                    {pins?.length ? (
                        <div className='px-7'>
                            {activeBtn === "created" ? (
                                <div className='text-center text-blue-100 pb-4 mx-7 font-bold'>
                                    Here are the pins you created. Apparently, you have been slouching in front of the computer instead of touching some grass.
                                </div>
                            ) : (
                                <div className='text-center text-blue-100 pb-4 mx-7 font-bold'>
                                    Here are the pins you created. Apparently, you have been doom-scrolling the whole day instead of touching some grass.
                                </div>
                            )}
                            <MasonryLayout pins={pins} />
                        </div>
                    ) : (
                        <div className='text-center text-blue-100 pb-4 mx-7 font-bold'>
                            No pins found. Good job, keep it that way. Go enjoy life, go touch some grass.
                        </div>
                    )
                    }
                </div>

            </div>
        </div >
    )
}

export default UserProfile