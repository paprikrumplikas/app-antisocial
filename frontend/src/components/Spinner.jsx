import React from 'react';
// @note this is the loader
import { Circles } from "react-loader-spinner";


export const Spinner = ({ message }) => {
    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <Circles
                color="#00BFFF"
                height={50}
                width={50}
                className="m-5"
            />
            <p className='text-lg text-center px-2 mt-4'>
                {message}
            </p>
        </div>
    )
}

export default Spinner
