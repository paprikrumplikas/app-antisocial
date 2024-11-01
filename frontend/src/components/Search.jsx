import React, { useState, useEffect } from 'react';

import { clientRead } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { searchQuery } from '../utils/dataQueries';
import { comment } from 'postcss';

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
        <div className='flex pl-5 text-blue-100'>
            {isLoading ? (
                <Spinner />
            ) : pins?.length ? (
                <MasonryLayout pins={pins} />
            ) : (
                <div>No hits. Wanna touch some grass instead?</div>
            )}
        </div>
    );
}

export default Search