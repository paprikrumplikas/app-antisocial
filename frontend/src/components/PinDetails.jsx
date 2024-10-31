import React, { useState, useEffect } from 'react';
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

    // pinId is set as a dynamic param at routing and, hence, we can fetch it here
    const { pinId } = useParams();

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

                        clientRead.fetch(query)
                            .then((response) => setPins(response))
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
        <div className='flex xl:flex-row flex-col m-auto' style={{ maxWidth: '1500px', borderRaduis: '32px' }}>

            {/** pin img */}
            <div className='flex justify-center items-center md:items-start flex-initial'>
                <img
                    src={pinDetails?.image && urlFor(pinDetails.image).url()}
                    className='rounded-t-3xl rounded-b-lg'
                    alt="user-post"
                />
            </div>

            {/** everything else about the pin - title, about, author, comments */}
            <div className='w-full p-5 flex-1 xl:min-w-620px'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <a
                            href={`${pinDetails.image?.asset?.url}?dl=`}   // allows to download the img
                            download    // @learning you can specify an anchor tag as download anchor tag which will automatically trigger the download
                            onClick={(e) => e.stopPropagation()}  // @learning @crucial the image is behind this icon. If we didnt have this stoppropagation, then if we clicked on this download icon, we would be redirected to the pin details page
                            className='bg-blue-100 w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                        >
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    {/**  */}
                    <a
                        href={pinDetails.destination}
                        target="blank"
                        rel="noreferrer"
                        className='text-blue-100'
                    >
                        {pinDetails.destination}
                    </a>
                </div>

                <div>
                    <h1 className='text-4xl text-blue-100 font-bold break-words mt-3'>
                        {pinDetails.title}
                    </h1>
                    <p className='mt-3 text-blue-100'>
                        About: {pinDetails.about}
                    </p>
                </div>
                <Link
                    to={`user-profile/${pinDetails.postedBy?._id}`}
                    className='flex gap-2 mt-5 items-center rounded-ég'
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
                <h2 className='mt-5 text-2xl text-blue-100'>
                    Comments
                </h2>

                <div className='max-h-370 overflow-y-auto'>
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
                <div className='flex felx-wrap mt-6 gap-3 items-center'>
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
                        className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300 pl-4'
                        type="text"
                        value={comment}
                        placeholder='Add a comment'
                        onChange={(e) => { setComment(e.target.value) }}
                    />
                    <button
                        type='button'
                        className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                        onClick={addComment}
                    >
                        {addingComment ? "Posting the comment" : "Post"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PinDetails;