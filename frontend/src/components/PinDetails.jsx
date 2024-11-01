import React, { useState, useEffect, useRef } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { clientRead, clientWrite, urlFor } from "../client";
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/dataQueries";
import Spinner from './Spinner';

const PinDetails = ({ user }) => {
    const [pins, setPins] = useState(null); // will be used for recommendation for related pins
    const [pinDetails, setPinDetails] = useState(null); // details of an idividual pin
    const [comment, setComment] = useState("");
    const [addingComment, setAddingComment] = useState(false);
    const [imageContainerHeight, setImageContainerHeight] = useState(0);
    const imageContainerRef = useRef(null);

    // pinId is set as a dynamic param at routing and, hence, we can fetch it here
    const { pinId } = useParams();

    useEffect(() => {
        if (imageContainerRef.current) {
            setImageContainerHeight(imageContainerRef.current.offsetHeight);
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


    useEffect(() => {
        fetchPinDetails();
    }, [pinId])


    // @crucial if PinDetails have not been fetched yet, display a spinner
    if (!pinDetails) return <Spinner message="Loading pin..." />

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
                            <div className='flex gap-2 items-center pl-4 '>
                                <a
                                    href={`${pinDetails.image?.asset?.url}?dl=`}   // allows to download the img
                                    download    // @learning you can specify an anchor tag as download anchor tag which will automatically trigger the download
                                    onClick={(e) => e.stopPropagation()}  // @learning @crucial the image is behind this icon. If we didnt have this stoppropagation, then if we clicked on this download icon, we would be redirected to the pin details page
                                    className='bg-blue-100 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none mt'
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                        </div>

                        <div className='flex flex-row justify-between items-center gap-2 flex-wrap'>
                            <a
                                href={pinDetails.destination}
                                target="blank"
                                rel="noreferrer"
                                className='text-blue-100 mt-2'
                            >
                                {pinDetails.destination}
                            </a>
                            <Link
                                to={`user-profile/${pinDetails.postedBy?._id}`}
                                className='flex gap-2 mt-2 items-center rounded-ég'
                            >
                                <img
                                    className='w-7 h-7 rounded-full object-cover'
                                    src={pinDetails.postedBy?.image}
                                    alt="user-profile"
                                />
                                <p className=' text-blue-100 text-md capitalize'>
                                    {pinDetails.postedBy?.userName}
                                </p>
                            </Link>
                        </div>

                        <div className='text-blue-100 flex flex-row mt-6'>
                            <p className='font-bold'>Description:</p>&nbsp;{pinDetails.about}
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
                    <div className='flex flex-wrap mt-6 gap-3 items-center'>
                        <Link
                            to={`user-profile/${pinDetails.postedBy?._id}`}
                        >
                            <img
                                className='w-8 h-8 rounded-full cursor-pointer'
                                src={pinDetails.postedBy?.image}
                                alt="user-profile"
                            />
                        </Link>
                        <input
                            className='flex-1 bg-blue-100 border-gray-100 outline-none border-2 p-2 rounded-xl focus:border-gray-300 pl-4 mt-4'
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