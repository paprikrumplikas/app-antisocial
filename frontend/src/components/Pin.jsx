import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
// this is a unique resource identifier, gonna provide us unique ids for every post
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import Tilt from "react-parallax-tilt";


import { clientRead, clientWrite, urlFor } from "../client.js";
import { fetchUser } from '../utils/fetchUser.js';
//import { savePin, deletePin } from '../utils/saveOrDeletePin.js';

// @note rendered by MasonryLayout
const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);
    const navigate = useNavigate();

    const user = fetchUser();

    // e save is different than download. Save is like saving to own dashboard
    // the last ? is needed as if noone saved it yet, save will be null / undefined
    // Also add null check for user before accessing sub
    /**
      * @learning @syntax
         * e.g. 
         * user id 1, array of ppl who saved -> returns [1]. But this is not a bool as the name suggest ->
         * [1].length -> 1. But it is not really a bool yet. !1 = false -> !false = true. So !!1 = true
         * e.g. 
         * user id 4, array of ppl who saved -> returns []. Then [].length = 0. Then !!0 = false.
        */
    // @note item is a user in the array of users who pinned the post
    const alreadySaved = !!(user && save?.filter((item) => item?.postedBy?._id === user?.sub))?.length;


    // @note moved these 2 to a util file (without reload that has to be handled here)
    const savePin = async (id) => {
        if (!user) {
            toast.error('Please login to pin posts to your profile.\n\n(See the buttons in the top right or bottom left corners.)', {
                style: { whiteSpace: 'pre-line', textAlign: 'center' }
            });
            return; // Add early return if no user
        }

        if (!alreadySaved) {
            // update doc on sanity db
            await clientWrite
                .patch(id)  // patch the post with an id
                .setIfMissing({ save: [] }) // init save to be an empty array
                .insert('after', 'save[-1]', [{ // insert a doc
                    _key: uuidv4(),
                    userId: user.sub,   // in instructors version, .googleId
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.sub // in instructors version, .googleId
                    }
                }])
                .commit()   // commit, returns a promise that we can use then on with whatever
                .then(() => {
                    window.location.reload();   // reload window
                    console.log("You have successfully pinned this post.")
                })
                .catch((error) => {
                    console.error('Error saving pin:', error);
                });
        }
    }


    const deletePin = (id) => {
        clientWrite
            .delete(id)
            .then(() => {
                window.location.reload(); // Now this will execute after deletion is complete
            })
            .catch((error) => {
                console.error('Error deleting pin:', error);
            });
    }

    return (
        <div className='m-2'>
            <Tilt
                tiltMaxAngleX={Math.random() * 50}  // More extreme random tilt
                tiltMaxAngleY={Math.random() * 50}
                glareEnable={true}
                glareMaxOpacity={0.7}              // More visible glare
                glareColor={"#ffffff"}
                glareBorderRadius="12px"          // Rounded corners on the glare
                gyroscope={true}
                perspective={1000}                  // Stronger perspective effect
                transitionSpeed={2000}             // Slower transition for more dramatic effect
                tiltReverse={Math.random() > 0.8}  // Randomly reverse tilt direction
            >
                {/** @learning @crucial sets behavior on hover, remove hover, click */}
                <div
                    onMouseEnter={() => setPostHovered(true)}
                    onMouseLeave={() => setPostHovered(false)}
                    onClick={() => navigate(`/pin-details/${_id}`)}
                    className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
                >

                    <img
                        className='rounded-xl w-full'
                        alt="user-post"
                        // src: this is Sanity's way of effectively fetching images. 
                        // Imgs will be optimized for this specific width
                        src={urlFor(image).width(250).url()}
                    />

                    {/** if post is hovered, show download icon, save button, link, delete icon */}
                    {postHovered && (
                        <div
                            className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'  //abs removes it from normal doc flow
                            style={{ height: "100%" }} // setting manually, as instructor had some issues with h-full here
                        >

                            {/** download icon */}
                            <div className='flex items-center justify-between'>
                                {/** icon, but in a div */}
                                <div className='flex gap-2'>
                                    <a
                                        href={`${image?.asset?.url}?dl=`}   // allows to download the img
                                        download    // @learning you can specify an anchor tag as download anchor tag which will automatically trigger the download
                                        onClick={(e) => e.stopPropagation()}  // @learning @crucial the image is behind this icon. If we didnt have this stoppropagation, then if we clicked on this download icon, we would be redirected to the pin details page
                                        className='flex bg-white rounded-full items-center justify-center text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                                    >
                                        <div className='flex text-3xl font-bold items-center justify-center'>
                                            <MdDownloadForOffline />
                                        </div>
                                    </a>
                                </div>

                                {/** pin button. depending on whether the user has pinned a specific post or not, render different buttons */}
                                {/**     // e save is different than download. Save is like pinning to own dashboard */}
                                {alreadySaved ? (
                                    < button
                                        type='button'
                                        className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-medium outline-none'
                                        onClick={(e) => { e.stopPropagation() }}
                                    >
                                        {save?.length} pinned
                                    </button>
                                ) : (
                                    <button
                                        type='button'
                                        className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-medium outline-none'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            savePin(_id)
                                        }}
                                    >
                                        Pin
                                    </button>
                                )}
                            </div>

                            <div className='flex justify-between items-center gap-2 w-full'>

                                {/** link */}
                                {destination && (
                                    <a
                                        href={destination}
                                        target="_blank" // to open in a new page
                                        rel="noreferrer"
                                        className='bg-white flex items-center gap-2 text-black font-bold py-1 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                                    >
                                        <BsFillArrowUpRightCircleFill />
                                        {destination.length > 20 ? destination.slice(8, 20) : destination.slice(8)}
                                    </a>
                                )}

                                {/** delete button */}
                                {user && postedBy?._id === user?.sub && (
                                    <button
                                        type='button'
                                        className='bg-white p-1 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-medium outline-none'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deletePin(_id);
                                        }}
                                    >
                                        <div className='text-2xl '>
                                            <AiTwotoneDelete />
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/** link to the profile of the person who created the pin */}
                <Link
                    to={`/user-profile/${postedBy?._id}`}
                    className='flex gap-2 mt-2 items-center pb-2'
                >
                    <img
                        className='w-7 h-7 rounded-full object-cover'
                        src={postedBy?.image}
                        alt="user-profile"
                    />
                    <p className=' text-blue-100 text-md capitalize'>
                        {postedBy?.userName}
                    </p>
                </Link>
            </Tilt>
        </div >
    )
}

export default Pin