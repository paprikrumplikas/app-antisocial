import React from 'react';
import busted from '../assets/busted.png'; // adjust path as needed

const Busted = ({ onClose }) => {
    return (
        <div className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50'>
            <div className='bg-blue-100 rounded-lg p-8 max-w-md relative'>
                <button
                    onClick={onClose}
                    className='absolute top-2 right-2 text-gray-800 hover:text-gray-950'
                >
                    ✕
                </button>
                <img
                    src={busted}
                    alt="Busted!"
                    className='w-full h-auto mb-4'
                />
                <p className='text-center text-gray-800 text-lg mt-2'>
                    You've been caught procrastinating!
                </p>
                <p className='text-xl font-bold text-center text-red-500'>
                    Time to touch some grass...
                </p>
            </div>
        </div>
    );
};

export default Busted;