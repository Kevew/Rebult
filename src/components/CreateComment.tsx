'use client'

import { FC, useState } from 'react';
import { Label } from './ui/Label';
import { Textarea } from './ui/TextArea';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';

interface CreateCommentProps {}

const CreateComment: FC<CreateCommentProps> = ({}) => {

    const [input, setInput] = useState<string>('');

    const {} = useMutation({
        
    })

    return <div className='grid w-full gap-1.5'>
        <Label htmlFor = 'comment'> Your comment</Label>
        <div className = 'mt-2'>
            <Textarea
                id='comment'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder='What are your thoughts?'
            />

            <div className='mt-2 flex justify-end'>
                <Button
                    isLoading={/*@ts-ignore*/
                        isLoading}
                    disabled={input.length === 0}
                    onClick={/*@ts-ignore*/
                    () => comment({ postId, text: input, replyToId })}>
                    Post
                </Button>
            </div>
        </div>
    </div>
}

export default CreateComment;