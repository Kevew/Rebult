'use client'

import { User } from '@prisma/client';
import { FC, useState } from 'react';
import UserAvatar from '../UserAvatar';
import AboutMe from './AboutMe';
import PrivateAccountDisplay from './PrivateAccountDisplay';

interface OutsiderProfileViewProps {
    profile: User
}

const OutsiderProfileView: FC<OutsiderProfileViewProps> = ({profile}: OutsiderProfileViewProps) => {

    const privateAccount = (profile.privateAccount);

    return(
        <div className='container flex flex-col h-full bg-slate-50'>
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
                    <div className='relative bg-white h-1/2 w-full border-2 border-gray-200'>
                        {privateAccount ? 
                        <PrivateAccountDisplay/>:
                        <AboutMe 
                            profile={profile} 
                            editable={false}
                            callParent={undefined}
                        />}
                        
                    </div>
                </div>
                <div className='relative bg-red-500 border-2 border-gray-200 py-40 w-1/2 m-1'>
                    {privateAccount ? 
                        <PrivateAccountDisplay/>:
                        <>Top papers</>
                    }
                </div>
            </div>
            <div className='relative bg-red-700 border-2 border-gray-200 w-full py-3 items-center'>
                {privateAccount ? 
                <PrivateAccountDisplay/>:<>
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
                </>}
            </div>
        </div>
    )
}

export default OutsiderProfileView;