import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import { clientWrite, clientRead } from '../client.js';
import { searchQuery, feedQuery } from '../utils/dataQueries.js';
import MasonryLayout from "./MasonryLayout.jsx";
import Spinner from "./Spinner.jsx";

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

    return (
        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    )
}

export default Feed