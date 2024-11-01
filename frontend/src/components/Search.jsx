import React, { useState, useEffect } from 'react';

import { clientRead } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { searchQuery } from '../utils/dataQueries';
import { comment } from 'postcss';

import grassImage from '../assets/grass.jpg';


const Search = ({ searchTerm }) => {

    const [pins, setPins] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        const query = searchQuery(searchTerm);

        clientRead.fetch(query)
            .then((data) => {
                setPins(data);
                setIsLoading(false);
            })
            .catch((error) => {  // 4. Add error handling
                console.error('Error fetching pins:', error);
                setIsLoading(false);
            })
    }, [searchTerm])



    return (
        <div className='flex px-5 w-full'>
            {isLoading ? (
                <Spinner />
            ) : pins?.length ? (
                <MasonryLayout pins={pins} />
            ) : (
                <div className='flex flex-col text-white items-center justify-center w-full pt-8'>
                    <p className='pb-3 text-lg'>Nothing to see here.</p>
                    <p className='font-bold text-2xl pb-10'>Wanna touch some grass instead?</p>
                    <img
                        src={grassImage}
                        alt="grass"
                        className='xl:w-3/6 w-full rounded-3xl'
                    />
                </div>
            )}
        </div>
    );
}

export default Search