import React, { useState, useEffect, useRef } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AiTwotoneDelete } from "react-icons/ai";
import { toast } from 'react-toastify';


import { clientRead, clientWrite, urlFor } from "../client";
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery, userSavedPinsQuery } from "../utils/dataQueries";
import Spinner from './Spinner';
import { BsChevronDoubleLeft } from 'react-icons/bs';

const PinDetails = ({ user }) => {
    const navigate = useNavigate();
    const [pins, setPins] = useState(null); // will be used for recommendation for related pins
    const [pinDetails, setPinDetails] = useState(null); // details of an idividual pin
    const [comment, setComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);
    const [imageContainerHeight, setImageContainerHeight] = useState(0);
    const imageContainerRef = useRef(null);

    // pinId is set as a dynamic param at routing and, hence, we can fetch it here
    const { pinId } = useParams();

    // @note to measure container height
    useEffect(() => {
        if (imageContainerRef.current) {
            setTimeout(() => {
                const height = imageContainerRef.current.offsetHeight;
                setImageContainerHeight(height);
            }, 100);
        }
    }, [pinDetails]); // Update when pinDetails changes as this might affect image container height

    const addComment = () => {
        if (comment) {
            setAddingComment(true);

            clientWrite
                .patch(pinId)
                .setIfMissing({ comments: [] })     // if there are no comments yet, init the array
                .insert("after", "comments[-1]", [{
                    comment,
                    key: uuidv4(),  // gives each comment a nique id
                    postedBy: {
                        _type: "postedBy",
                        _ref: user._id
                    }
                }])
                .commit()   // need to commit the insert
                .then(() => {   // commit returns a promise
                    fetchPinDetails();
                    setComment("");
                    setAddingComment(false);
                    window.location.reload(); // reload the page
                })
        }
    }

    const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId);

        if (query) {
            clientRead.fetch(query)
                .then((data) => {
                    setPinDetails(data[0])  // data by default is an array of posts

                    if (data[0]) {
                        // reassign query to fetch pins related to our individual pin
                        // will be used for recommendation for related pins
                        // now calling it with the actual post received
                        query = pinDetailMorePinQuery(data[0]);

                        // @note arbitrary slicing here as we dont filter for categories and dont want tons of related posts to display
                        clientRead.fetch(query)
                            .then((response) => setPins(response.slice(0, 8)))
                    }
                })
        }
    }


    const savePin = (id) => {
        console.log("PINNED OR NOT", alreadySaved)
        if (!user) {
            toast.error('Please login to pin posts to your profile.\n\n(See the buttons in the top right or bottom left corners.)', {
                style: { whiteSpace: 'pre-line' }
            });
            return; // Add early return if no user
        }

        if (!alreadySaved) {
            // update doc on sanity db
            clientWrite
                .patch(id)  // patch the post with an id
                .setIfMissing({ save: [] }) // init save to be an empty array
                .insert('after', 'save[-1]', [{ // insert a doc
                    _key: uuidv4(),
                    userId: user._id,   // in instructors version, .googleId
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user._id // in instructors version, .googleId
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
                navigate("/");
            })
            .catch((error) => {
                console.error('Error deleting pin:', error);
            });
    }


    useEffect(() => {
        fetchPinDetails();
    }, [pinId])


    // @crucial this is not the same user object as the one Pin.jsx has. That is from localStorage, this is from Sanity.
    // they have different fields. See NOTES point 12.
    //if (!user) return <Spinner message="Loading user data..." />;
    // @crucial if PinDetails have not been fetched yet, display a spinner
    if (!pinDetails) return <Spinner message="Loading pin..." />


    // @crucial this is not the same user object as the one Pin.jsx has. That is from localStorage, this is from Sanity.
    // they have different fields. See NOTES point 12. @bug lazy fix
    const alreadySaved = !!(pinDetails?.save?.filter((item) => item?.postedBy?._id === user?._id))?.length;

    return (
        <>
            <div className='flex xl:flex-row flex-col pb-6'>
                <div ref={imageContainerRef} className='flex flex-col h-fit border-4 border-blue-100 mx-5 rounded-2xl xl:max-w-[400px]'>

                    {/** pin img */}
                    <div className='flex justify-center items-center'>
                        <img
                            src={pinDetails?.image && urlFor(pinDetails.image).url()}
                            className='rounded-t-xl w-full'
                            alt="user-post"
                        />
                    </div>

                    {/** everything else about the pin - title, about, author, comments */}
                    <div className='w-full p-5 xl:min-w-620px'>

                        <div className='flex items-center justify-between'>
                            <h1 className='text-3xl text-blue-100 font-bold break-words'>
                                {pinDetails.title}
                            </h1>

                            {/** buttons */}
                            <div className='flex'>
                                {/** pin button or the number of pins */}
                                <div className='flex items-center pl-4'>
                                    {!alreadySaved ? (

                                        <button
                                            type="button"
                                            onClick={() => { savePin(pinId) }}
                                            className='w-10 h-10 text-xl rounded-full bg-gray-950 cursor-pointer opacity-70 hover:opacity-100'
                                        >
                                            📌
                                        </button>
                                    ) : (
                                        <div className='relative'>
                                            <p className='flex w-10 h-10 text-xl items-center justify-center text-blue-100 rounded-full bg-gray-900'
                                            >
                                                {pinDetails?.save?.length}
                                            </p>
                                            <p className='absolute top-[-9px] right-[-9px]'>📌</p>
                                        </div>
                                    )}
                                </div>
                                {/** download button */}
                                <div className='flex gap-2 items-center pl-2'>
                                    <a
                                        href={`${pinDetails.image?.asset?.url}?dl=`}   // allows to download the img
                                        download    // @learning you can specify an anchor tag as download anchor tag which will automatically trigger the download
                                        onClick={(e) => e.stopPropagation()}  // @learning @crucial the image is behind this icon. If we didnt have this stoppropagation, then if we clicked on this download icon, we would be redirected to the pin details page
                                        className='flex bg-blue-100 w-9 h-9 rounded-full items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none mt'
                                    >
                                        <div className='flex text-4xl items-center justify-center'>
                                            <MdDownloadForOffline />
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/** pin destination link */}
                        <div className='mt-2'>
                            <a
                                href={pinDetails.destination}
                                target="blank"
                                rel="noreferrer"
                                className='text-blue-100'
                            >
                                {pinDetails.destination}
                            </a>
                        </div>

                        {/** user pfp, name, delete button */}
                        <div className='flex flex-row justify-between items-center gap-2 flex-wrap mt-3'>
                            <Link
                                to={`/user-profile/${pinDetails.postedBy?._id}`}
                                className='flex gap-2 mt-2 items-center rounded-ég'
                            >
                                <img
                                    className='w-9 h-9 rounded-full object-cover'
                                    src={pinDetails.postedBy?.image}
                                    alt="user-profile"
                                />
                                <p className=' text-blue-100 text-md capitalize'>
                                    {pinDetails.postedBy?.userName}
                                </p>
                            </Link>

                            {user && pinDetails.postedBy?._id === user?._id && (

                                <button
                                    type='button'
                                    className='bg-blue-100 pb-1 px-1 opacity-70 hover:opacity-100 font-bold rounded-full hover:shadow-medium outline-none'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(pinId);
                                    }}
                                >
                                    <div className='flex text-3xl font-bold items-center justify-center'>
                                        <AiTwotoneDelete />
                                    </div>
                                </button>
                            )}

                        </div>

                        {/** about */}
                        <div className='text-blue-100 mt-3 whitespace-normal'>
                            <span className='font-bold'>Description: </span>
                            {pinDetails.about}
                        </div>


                    </div>
                </div>


                {/** comments section */}
                <div
                    className='flex flex-col flex-1 mt-5 xl:mt-0 rounded-2xl mx-5 xl:mx-0 xl:mr-2 px-5 pb-7 xl:bg-gradient-to-l bg-gradient-to-r from-gray-900 to-gray-800'
                    style={{ maxHeight: `${imageContainerHeight}px` }}
                >
                    <h2 className='mt-5 text-2xl font-bold text-blue-100 mb-4'>
                        Comments
                    </h2>

                    {/** @learning comments scrollable with custom scrollbar */}
                    <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-gray-800 hover:scrollbar-thumb-blue-200'>
                        {pinDetails?.comments?.map((comment, i) => (
                            <div className='flex gap-2 mt-5 items-center rounded-lg text-blue-100' key={i}>
                                <img
                                    src={comment.postedBy.image}
                                    alt="user-profile"
                                    className='w-7 h-7 rounded-full cursor-pointer'
                                />
                                <div className='flex flex-col'>
                                    <p className='font-bold'>
                                        {comment.postedBy.userName}
                                    </p>
                                    <p>{comment.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/** container for create comment */}
                    <div className='flex flex-wrap mt-10 gap-3 items-center'>
                        <Link
                            to={`/user-profile/${pinDetails.postedBy?._id}`}
                        >
                            <img
                                className='w-8 h-8 rounded-full cursor-pointer'
                                src={pinDetails.postedBy?.image}
                                alt="user-profile"
                            />
                        </Link>
                        <input
                            className='flex-1 bg-blue-100 border-gray-100 outline-none border-2 p-2 rounded-xl focus:border-gray-300 pl-4'
                            type="text"
                            value={comment}
                            placeholder='Add a comment'
                            onChange={(e) => { setComment(e.target.value) }}
                        />
                        <button
                            type='button'
                            className='bg-red-500 text-blue-100 rounded-full px-6 py-2 font-semibold text-base outline-none'
                            onClick={addComment}
                        >
                            {addingComment ? "Posting the comment" : "Post"}
                        </button>
                    </div>
                </div>

            </div>


            {/** related pins */}
            {pins?.length > 0 ? (
                <>
                    <h2 className='text-center font-bold text-2xl text-blue-100 mt-8 mb-4'>
                        More pins like this
                    </h2>
                    <MasonryLayout pins={pins} />
                </>
            ) : (
                <Spinner message="Loading more pins..." />
            )}
        </>
    )
}

export default PinDetails;