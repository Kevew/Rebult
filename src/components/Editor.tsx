"use client"

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from 'react-hook-form';
import { PostCreationRequest, PostValidator } from '@/lib/validators/post';
import {zodResolver} from '@hookform/resolvers/zod';
import { uploadFiles } from '@/lib/uploadthing';
import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';

interface EditorProps {
    subredditId: string
}

const Editor: FC<EditorProps> = ({subredditId}) => {

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subredditId,
            title: '',
            content: null,
        }
    });

    const _titleRef = useRef<HTMLTextAreaElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            setIsMounted(true);
        }
    }, [])

    useEffect(() => {
        if(Object.keys(errors).length){
            for(const [_key, value] of Object.entries(errors)){
                toast({
                    title: 'Something went wrong!',
                    description: (value as {message: string}).message,
                    variant: 'destructive',
                })
            }
        }
    }, [errors])

    useEffect(() => {

    }, [isMounted]);

    const {mutate: createPost} = useMutation({
        mutationFn: async ({title, content, subredditId}: PostCreationRequest) => {
            const payload: PostCreationRequest = {
                subredditId, title, content
            }
            const { data } = await axios.post('/api/subreddit/post/create', payload);
            return data;
        },
        onError: () => {
            return toast({
                title: "Something went wrong!",
                description: "You're post was not published, please try again later.",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            // r/community/submit into r/community
            const newPathName: string = pathname.split('/').slice(0, -1).join('/');
            router.push(newPathName);

            router.refresh();

            return toast({
                description: "You're post has been published!",
            })
        }
    });

    async function onSubmit(data: PostCreationRequest){

        const payload: PostCreationRequest = {
            title: data.title,
            subredditId
        };

        createPost(payload);
    }

    if (!isMounted){
        return null
    }

    const {ref: titleRef, ...rest} = register('title');

    return(
        <div className='w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200'>
            <form id='subreddit-post-form' className='w-fit' onSubmit={
                handleSubmit(onSubmit)}>
                <div className='prose prose-stone dark:prose-invert'>
                    <TextareaAutosize 
                        ref={(e) => {
                            titleRef(e)

                            // @ts-ignore
                            _titleRef.current = e
                        }}
                        {...rest}
                        placeholder='Title' 
                        className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'/>

                    <div id='editor' className='min-h-[500px]'/>
                </div>
            </form>
        </div>
    )
}

export default Editor;