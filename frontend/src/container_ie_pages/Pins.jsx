import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import { Navbar, Feed, PinDetails, CreatePin, Search, Busted } from '../components';

const Pins = ({ user }) => {

    // @note we create this state here and not in Search as we need to share it across diff components
    const [searchTerm, setSearchTerm] = useState("");
    const [showBusted, setShowBusted] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setShowBusted(true);
        }, 50000); // 

        return () => clearTimeout(timer);
    }, []); // Run once when component mounts



    return (
        <div className=' bg-gray-800'>
            {showBusted && <Busted onClose={() => setShowBusted(false)} />} {/* Changed to conditional rendering */}
            <div className='bg-blue-200'>
                <Navbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    user={user}
                />
            </div>
            <div className='h-full px-2 md:px-5'>
                <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/category/:categoryId" element={<Feed />} />
                    <Route path="/pin-details/:pinId" element={<PinDetails user={user} />} />
                    <Route path="/create-pin" element={<CreatePin user={user} />} />
                    <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
                </Routes>
            </div>
        </div>
    )
}

export default Pins