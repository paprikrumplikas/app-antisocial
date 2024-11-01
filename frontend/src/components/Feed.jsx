import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import { clientWrite, clientRead } from '../client.js';
import { searchQuery, feedQuery } from '../utils/dataQueries.js';
import MasonryLayout from "./MasonryLayout.jsx";
import Spinner from "./Spinner.jsx";

import grassImage from '../assets/grass.jpg';

const Feed = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [pins, setPins] = useState("");
    const { categoryId } = useParams();

    // at inital load and also when category changes
    useEffect(() => {
        setIsLoading(true);

        if (categoryId) {
            const query = searchQuery(categoryId);
            clientRead.fetch(query)
                .then((data) => {
                    setPins(data);
                    setIsLoading(false);
                });
        } else {
            // this looks a bit different but only because it is not a function, does not need params
            clientRead.fetch(feedQuery)
                .then((data) => {
                    setPins(data);
                    setIsLoading(false);
                });
        }

        return () => {

        }
    }, [categoryId])


    if (isLoading) return <Spinner message="We are adding new ideas to your feed!" />

    if (pins?.length === 0) {
        return (
            <div className='flex flex-col text-white items-center justify-center w-full pt-8'>
                <p className='pb-3 text-lg'>Nothing to see here.</p>
                <p className='font-bold text-2xl pb-10'>Wanna touch some grass instead?</p>
                <img
                    src={grassImage}
                    alt="grass"
                    className='xl:w-3/6 w-full rounded-3xl'
                />
            </div>
        )
    }

    return (
        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    )
}

export default Feed