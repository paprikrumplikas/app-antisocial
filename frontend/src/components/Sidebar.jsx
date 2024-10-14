import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import { RiHomeFill } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";

import logo from "../assets/logo.png";

const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle = "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";

// mock array for categories
const categories = [
    { name: "Animals" },
    { name: "Wallpapers" },
    { name: "Photography" },
    { name: "Gaming" },
    { name: "Coding" },
    { name: "Other" },
]

const Sidebar = ({ user, closeToggle }) => {

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

    return (
        <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
            <div className='flex flex-col'>
                <Link
                    to="/"
                    className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
                    onClick={handleCloseSidebar}    // bit of an overcomplication for the sake of an edgecase
                >
                    <img
                        src={logo}
                        alt="logo"
                        className='w-full'
                    />
                </Link>

                <div className='flex flex-col gap-5'>
                    <NavLink
                        to="/"
                        // @crucial @learning NavLink automatically provides the isActive bool
                        className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <h3 className='mt-2 px-5 text-base 2xl:text-xl'>
                        Discover catergories
                    </h3>

                    {/** @note length-1 as the final one will be "other" and we dont wanna list that as a cat */}
                    {categories.slice(0, categories.length - 1).map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                            onClick={handleCloseSidebar}
                            key={category.name}
                        >
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/** check if we have a user. If so, display image and name */}
            {user && (
                <Link
                    to={`user-profile/${user}._id`}
                    className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
                    onClick={handleCloseSidebar}
                >
                    <img
                        src={user.image}
                        alt="user-profile"
                        className='w-10 h-10 rounded-full'
                    />
                    <p>{user.userName}</p>
                </Link>
            )}
        </div>
    )
}

export default Sidebar;