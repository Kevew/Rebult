import { User } from '@prisma/client';
import { FC, useEffect, useRef, useState } from 'react';
import EditIcon from '../../../public/Edit.svg';
import Image from 'next/image';

interface AboutMeProps {
    profile: User,
    editable: Boolean,
    callParent: Function | undefined
};

const AboutMe: FC<AboutMeProps> = ({profile, editable, callParent}: AboutMeProps) => {


    const aboutMeRef = useRef<HTMLParagraphElement>(null);


    const [clientHeight, setClientHeight] = useState(0);

    useEffect(() => {
        // Function to update the clientHeight
        const updateClientHeight = () => {
            if (aboutMeRef.current) {
                setClientHeight(aboutMeRef.current.clientHeight);
            }
        };

        // Initial update when the component mounts
        updateClientHeight();

        // Update when profile.aboutMeDescription changes
        const observer = new MutationObserver(updateClientHeight);
        if (aboutMeRef.current) {
            observer.observe(aboutMeRef.current, { childList: true, subtree: true });
        }

        // Clean up observer on unmount
        return () => observer.disconnect();
    }, [profile.aboutMeDescription]);

    return(
        <div className='relative m-3'>
            {editable?
            <Image 
                className='absolute right-0 w-4 h-4 hover:cursor-pointer' 
                src={EditIcon} 
                alt="Edit Icon"
                // @ts-expect-error
                onClick={() => callParent()}
            />
            :<></>}
            <p className='font-bold'>About Me</p>
            <p className='text-xs max-h-32 overflow-y-hidden overflow-x-hidden break-words'
                ref={aboutMeRef}>
                {profile.aboutMeDescription}
                {/* @ts-ignore-error */}
                {clientHeight >= 128 ? (
                    // blur bottom if content is too long
                    <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent'></div>
                ) : null}
            </p>
        </div>
    )
}

export default AboutMe;