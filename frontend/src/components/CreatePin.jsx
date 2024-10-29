import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { clientRead, clientWrite } from '../client';
import Spinner from './Spinner';
// categories [{name: 'sports', image: ''}]
import { categories } from '../utils/categories';

const CreatePin = ({ user }) => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [about, setAbout] = useState("");
    const [destination, setDestination] = useState("");
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState(false);
    const [category, setCategory] = useState(null);
    const [imageAsset, setImageAsset] = useState(null);
    const [wrongImageType, setWrongImageType] = useState(false);

    const uploadImage = (e) => {
        const selectedFile = e.target.files[0];
        // destructuring the selectedFile to get the type
        const { type, name } = e.target.files[0];

        // what is the type of the file
        if (type === 'image/png' || type === "image/svg" || type === "image/jpeg" || type === "image/gif" || type === "image/tiff") {
            setWrongImageType(false);
            setLoading(true);

            clientWrite.assets
                .upload("image", selectedFile, { contentType: type, filename: name })
                .then((document) => {   // we get back a doc
                    setImageAsset(document);
                    setLoading(false);
                })
                .catch((error) => { // to catch any errors
                    console.log("image upload error ", error);
                })
        } else {
            setWrongImageType(true);
        }
    }


    const savePin = () => {
        if (title && about && destination && imageAsset?._id && category) {
            const document = {
                _type: "pin",
                title: title,
                about: about,
                destination: destination,
                image: {
                    _type: "image",
                    asset: {
                        _type: "reference",
                        _ref: imageAsset?._id
                    }
                },
                userId: user._id,
                postedBy: {
                    _type: "postedBy",
                    _ref: user._id
                },
                category: category
            }

            clientWrite.create(document)
                .then(() => navigate("/"))
        } else {
            setFields(true);
            setTimeout(() => { setFields(false) }, 2000)
        }
    }


    return (
        <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
            {/** error message if not all fields are filled */}
            {fields && (
                <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
                    Please fill in all the fields!
                </p>
            )}

            <div className='flex lg:flex-row flex-col justify-center items-center bg-gray-950 lg:p-5 p-3 lg:w-4/5 w-full rounded-2xl'>

                {/** create pin div */}
                <div className='bg-blue-100 p-3 flex flex-0.7 w-full rounded-2xl'>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-900 p-3 w-full h-420 rounded-2xl'>
                        {loading && (<Spinner />)}
                        {wrongImageType && <p>Wrong image type!</p>}
                        {/** if no imageAsset, we show a field to actually upload the img */}
                        {!imageAsset ? (
                            <label>
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <div className='flex flex-col justify-center items-center'>
                                        <p className='font-bold text-md'>
                                            <AiOutlineCloudUpload />
                                        </p>
                                        <p className='text-lg'>Click to upload.</p>
                                    </div>
                                    <p className='mt-32 text-gray-700'>
                                        Use high-quality JPG, SVG, PNG, GIF, or TIFF less than 20 MB.
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    name='upload-image'
                                    onChange={uploadImage}
                                    className='w-0 h-0'
                                >
                                </input>
                            </label>
                        ) : ( // but if there is an imageasset, we want to show the uploaded image

                            <div className='relative h-full'>
                                <img
                                    src={imageAsset?.url}
                                    alt='upload-pic'
                                    className='h-full w-full'
                                />
                                <button
                                    type='button'
                                    className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                                    onClick={() => { setImageAsset(null) }}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/** form */}
                <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Add your title'
                        className='outline-none text-xl sm:text-xl font-bold border-b-2 border-gray-200 p-2 rounded-md pl-3 bg-blue-100'
                    />
                    {/** if we have access to the user, display its image */}
                    {user && (
                        // this is a full row containing the image and user name
                        <div className='flex gap-2 my-2 items-center bg-blue-100 rounded-lg pl-1'>
                            <img
                                src={user.image}
                                alt='user-profile'
                                className='w-10 h-10 rounded-full'
                            />
                            <p className='font-bold'>{user.userName}</p>
                        </div>
                    )}
                    {/** input field for about */}
                    <input
                        type="text"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder='What is your pin about?'
                        className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2  bg-blue-100 rounded-lg pl-3'
                    />
                    {/** input field for destination */}
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder='Add a destination name'
                        className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2  bg-blue-100 rounded-lg pl-3'
                    />
                    {/** category selector */}
                    <div className='flex flex-column'>
                        <div className='w-4/5'>
                            <p className='mb-2 font-semibold text-md sm:text-lg text-blue-100'>Choose pin category</p>
                            <select
                                onChange={(e) => setCategory(e.target.value)}
                                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2  bg-blue-100 rounded-lg pl-3 cursor-pointer'
                            >
                                {/** default option */}
                                <option
                                    value="other"
                                    className='bg-blue-100'
                                >
                                    Select Category
                                </option>

                                {categories.map((category) => (
                                    <option
                                        className='text-base border-0 outline-none capitalize bg-blue-100 text-black'
                                        key={category.name}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/** save pin button */}
                        <div className='flex justify-end items-end mt-5'>
                            <button
                                type='button'
                                onClick={savePin}
                                className='bg-red-500 text-white font-bold p-2 px-4 rounded-full w-26 outline-none'
                            >
                                Save pin
                            </button>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default CreatePin