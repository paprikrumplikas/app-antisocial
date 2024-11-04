import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward, IoMdAdd } from "react-icons/io";

import logo from "../assets/logo.png";
import { categories } from '../utils/categories';
import login from "../assets/login.png";

const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-blue-100 transition-all duration-200 ease-in-out capitalize";
const isActiveStyle = "flex items-center text-blue-100 px-5 gap-3 font-extrabold transition-all duration-200 ease-in-out capitalize";



const Sidebar = ({ user, closeToggle }) => {
    const navigate = useNavigate();

    /** @learning we want to be able to toggle the sidebar only for mobile for desktop, 
     * we do not pass the closeToggle so this useEffect would not trigger an untoggle 
     * 
     * @note this actually does not make much sense as the desktop sidebar is independent of the setToggle state anyways.
     * Hence we could simplify this, omit this handle functon and have closeToggle directly at onClick.
     * The only sideeffect would appear in an edge case
     * 1- User is on desktop with a small window (mobile view).
       2. They toggle the sidebar open.
       3. They enlarge the window to desktop size.
       4. They click on a sidebar item.
       5.They reduce the window size back to mobile view.
    In this case, the sidebar would indeed be closed when returning to the mobile view, which might not be the expected behavior
    */
    const handleCloseSidebar = () => {
        if (closeToggle) closeToggle(false);
    }

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

    return (
        <div className='flex flex-col justify-between bg-gradient-to-r from-gray-950 to-gray-800 h-full overflow-y-scroll min-w-210 hide-scrollbar'>
            <div className='flex flex-col pt-2 items-center'>
                {/** logo */}
                <Link
                    to="/"
                    className='flex px-5 gap-2 my-6 pt-1 w-190 items-center text-white'
                    onClick={handleCloseSidebar}    // bit of an overcomplication for the sake of an edgecase
                >
                    <img
                        src={logo}
                        alt="logo"
                        className='w-full'
                    />
                </Link>

                <div className='flex flex-col gap-5 pt-10 items-center'>
                    <NavLink
                        to="/"
                        // @crucial @learning NavLink automatically provides the isActive bool
                        className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill />
                        Home
                    </NavLink>

                    <NavLink
                        to="/create-pin"
                        className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCreatePinClick}
                    >
                        <IoMdAdd />
                        Create Pin
                        <IoMdAdd />
                    </NavLink>


                    <h3 className='mt-4 px-5 pt-4 text-base text-blue-100 2xl:text-xl'>
                        Discover categories
                    </h3>

                    {/** @note length-1 as the final one will be "other" and we dont wanna list that as a cat */}
                    {categories.slice(0, categories.length - 1).map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                            onClick={handleCloseSidebar}
                            key={category.name}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className='w-6 h-6 rounded-full'
                            />
                            {category.name}
                        </NavLink>
                    ))}


                </div>
            </div>

            {/** check if we have a user. If so, display image and name, otherwise */}
            {user ? (
                <Link
                    to={`/user-profile/${user?._id}`}
                    className='flex my-5 mb-3 gap-2 p-2 bg-gray-950 rounded-lg shadow-lg mx-3 px-3 items-center'
                    onClick={handleCloseSidebar}
                >
                    <img
                        src={user.image}
                        alt="user-profile"
                        className='w-10 h-10 rounded-full'
                    />
                    <p className='text-blue-100'>{user.userName}</p>
                </Link>
            ) : (
                <Link
                    to={"/login"}
                    className='flex my-5 mb-3 gap-2 p-2 bg-gray-950 rounded-lg shadow-lg mx-3 px-3 items-center justify-center'
                    onClick={handleCloseSidebar}
                >
                    <div>
                        <img
                            src={login}
                            alt="login"
                            className='w-10 h-10 rounded-lg'
                        />
                    </div>
                    <p className='text-blue-100'> Log in to post / pin</p>
                </Link>
            )

            }
        </div>
    )
}

export default Sidebar;