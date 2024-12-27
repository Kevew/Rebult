import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/TextArea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateHighlightCommentProps {
    highlightId: string
    replyToId?: string
}

const CreateHighlightComment = ({highlightId, replyToId}: CreateHighlightCommentProps) => {

    const [input, setInput] = useState<string>('');
    const router = useRouter();

    const { mutate: comment, isLoading} = useMutation({
        mutationFn: async ({highlightId, text, replyToId}: any) =>{ 
            const payload = {highlightId, text, replyToId};
            const { data } = await axios.post('/api/paper/highlight/comment/create',
                payload);
            return data;
        },
        onSuccess: () => {
            router.refresh();
            setInput('');
        }
    })

    return (
        <div className='grid w-full gap-1.5'>
            <label htmlFor='comment'>
                Your Comment
            </label>
            <div className='mt-2'>
                <Textarea
                    id='comment'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder='What are your thoughts?'
                />
                <div className='mt-2 flex justify-end'>
                    <Button
                        isLoading={isLoading}
                        disabled={input.length === 0}
                        onClick={() => comment({ highlightId, text: input, replyToId })}>
                        Post
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateHighlightComment;