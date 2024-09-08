'use client'

import { User } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';
import AboutMe from './AboutMe';
import EditAboutMe from './EditAboutMe';
import TopPapers from './TopPapers';

interface UserProfileViewProps {
    profile: User
}

const UserProfileView: FC<UserProfileViewProps> = ({profile}: UserProfileViewProps) => {

    const [showAboutMeEdit, setShowAboutMeEdit] = useState(false);

    // Disable Scrolling and Sent to top of page
    useEffect(() => {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.body.style.overflow = (showAboutMeEdit ? "hidden" : "unset")
    }, [showAboutMeEdit]);

    return(
        <div className='container flex flex-col h-full bg-slate-50'>
            {showAboutMeEdit ? 
            <div className='z-10 absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gray-200 bg-opacity-50'>
                <span onClick={() => setShowAboutMeEdit(false)}
                      className='z-15 absolute top-0 right-2 text-6xl font-extrabold cursor-pointer color-white'>&times;</span>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 transform -translate-y-1/2 w-1/2 h-3/5'>
                    {/* @ts-ignore-error */}
                    <EditAboutMe description={profile.aboutMeDescription}
                                 closeWindow={() => setShowAboutMeEdit(false)}/>
                </div>
            </div>:<></>}
            <div className='relative flex flex-row w-full'>
                <div className='relative flex flex-col w-1/2 m-1'>
                    <div className='relative bg-gray-100 flex flex-col h-1/2 w-full border-2 border-gray-200'>
                        <div className='relative bg-gray-200 bg-opacity-20 w-full h-2/3'>
                            <div className='absolute bottom-5 left-8'>
                                <UserAvatar user={{
                                    name: profile.name || null,
                                    image: profile.image || null,
                                }}/>
                            </div>
                        </div>
                        <div className='relative px-2 w-full h-1/3'>
                            <p>{profile.name}</p>
                            <p className='text-xs'>profile/{profile.username}</p>
                        </div>
                    </div>
                    <div className='bg-white h-1/2 w-full border-2 border-gray-200'>
                        <AboutMe 
                            profile={profile} 
                            editable={true}
                            callParent={() => setShowAboutMeEdit(true)}
                        />
                    </div>
                </div>
                <div className='relative flex border-2 border-gray-200 bg-white py-40 w-1/2 m-1 flex flex-col h-full'>
                    <TopPapers profile={profile}/>
                </div>
            </div>
            <div className='relative bg-red-700 border border-gray-200 w-full py-3 items-center'>
                <div className='relative bg-red-100 border border-gray-200 py-5 w-full'>
                    Search Area
                </div>
                <div className='relative bg-red-300 border border-gray-200 py-10 w-full'>
                    Critique/Comment 1
                </div>
                <div className='relative bg-red-300 border border-gray-200 py-10 w-full'>
                    Critique/Comment 2
                </div>
                <div className='relative bg-red-300 border border-gray-200 py-10 w-full'>
                    Critique/Comment 2
                </div>
                <div className='relative bg-red-300 border border-gray-200 py-10 w-full'>
                    Critique/Comment 2
                </div>
                <div className='relative bg-red-300 border border-gray-200 py-10 w-full'>
                    Critique/Comment 2
                </div>
            </div>
        </div>
    )
}

export default UserProfileView;