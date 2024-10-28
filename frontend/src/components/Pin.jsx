import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
// this is a unique resource identifier, gonna provide us unique ids for every post
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { clientRead, clientWrite, urlFor } from "../client.js";
import { fetchUser } from '../utils/fetchUser.js';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const navigate = useNavigate();

    const user = fetchUser();

    // e save is different than download. Save is like saving to own dashboard
    // the last ? is needed as if noone saved it yet, save will be null / undefined
    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.sub))?.length;
    /**
     * @learning @syntax
     * e.g. 
     * user id 1, array of ppl who saved -> returns [1]. But this is not a bool as the name suggest ->
     * [1].length -> 1. But it is not really a bool yet. !1 = false -> !false = true. So !!1 = true
     * e.g. 
     * user id 4, array of ppl who saved -> returns []. Then [].length = 0. Then !!0 = false.
     */

    const savePin = (id) => {
        if (!alreadySaved) {
            setSavingPost(true);
            // update doc on sanity db
            clientWrite
                .patch(id)
                .setIfMissing({ save: [] }) // init save to be an empty array
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.sub,   // in instructors version, .googleId
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.sub // in instructors version, .googleId
                    }
                }])
                .commit()   // returns a promise
                .then(() => {
                    window.location.reload();
                    setSavingPost(false);
                })
        }
    }

    return (
        <div className='m-2'>
            {/** @learning sets behavior on hover, remove hover, click */}
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >

                <img
                    className='rounded-lg w-full'
                    alt="user-post"
                    // src: this is Sanity's way of effectively fetching images. 
                    // Imgs will be optimized for this specific width
                    src={urlFor(image).width(250).url()}
                />

                {/** if post is hovered, show save icon, link, etc. */}
                {postHovered && (
                    <div
                        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'  //abs removes it from normal doc flow
                        style={{ height: "100%" }} // setting manually, as instructor had some issues with h-full here
                    >
                        <div className='flex items-center justify-between'>
                            {/** icon, but in a div */}
                            <div className='flex gap-2'>
                                <a
                                    href={`${image?.asset?.url}?dl=`}   // allows to download the img
                                    downLoad    // @learning you can specify an anchor tag as download anchor tag which will automatically trigger the download
                                    onClick={(e) => e.stopPropagation()}  // @learning @crucial the image is behind this icon. If we didnt have this stoppropagation, then if we clicked on this download icon, we would be redirected to the pin details page
                                    className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>

                            {/** depending on whether the user has saved a specific post or not, render different buttons */}
                            {/**     // e save is different than download. Save is like saving to own dashboard */}
                            {alreadySaved ? (
                                < button
                                    type='button'
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-medium outline-none'
                                >
                                    {save?.length} Saved
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-medium outline-none'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                )}

            </div>






        </div >
    )
}

export default Pin