import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import { toast } from 'react-toastify';


import login from "../assets/login.png";



const Navbar = ({ searchTerm, setSearchTerm, user }) => {

    const navigate = useNavigate();


    const handleCreatePinClick = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to create pins.\n\n(See the buttons in the top right or bottom left corners.)', {
                style: { whiteSpace: 'pre-line' }
            });
            return;
        }
        navigate('/create-pin');
        if (closeToggle) closeToggle(false);
    }


    // else return the navbar
    return (
        <div className='flex gap-2 w-full p-7 bg-gray-800'>
            <div className='flex justify-start items-center w-full px-2 rounded-lg bg-blue-100 border-none outline-none focus-within:shadow-sm'>
                <IoMdSearch
                    fontSize={21}
                    className='ml-1'
                />
                <input
                    type="text"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    value={searchTerm}
                    onFocus={() => navigate("/search")}
                    className="p-2 w-full outline-none bg-blue-100"
                />
            </div>

            {/** on bigger than medium, displays pfp and create */}
            <div className='flex gap-3'>
                {user ? (
                    <Link
                        to={`/user-profile/${user?._id}`}
                        className='hidden md:block'
                    >
                        <img
                            src={user.image}
                            alt="user"
                            className='w-14 h-12 rounded-lg'
                        />
                    </Link>
                ) : (
                    <Link
                        to={`/login`}
                        className='hidden md:block'
                    >
                        <img
                            src={login}
                            alt="user"
                            className='w-14 h-12 rounded-lg'
                        />
                    </Link>
                )

                }
                <Link
                    to="create-pin"
                    className='sparkle-button bg-blue-200 text-black rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center relative'
                    onClick={handleCreatePinClick}
                >
                    <IoMdAdd />
                    <span className="sparkle-container">
                        <span className="spark spark1"></span>
                        <span className="spark spark2"></span>
                        <span className="spark spark3"></span>
                        <span className="spark spark4"></span>
                    </span>
                </Link>

            </div>
        </div>
    )
}

export default Navbar