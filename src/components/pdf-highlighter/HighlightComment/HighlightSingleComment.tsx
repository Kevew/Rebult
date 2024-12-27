import UserAvatar from "@/components/UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import { HighlightCommentWithRelations } from "./HighlightComments";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/TextArea";
import axios from "axios";
import { HighlightCreateCommentRequest } from "@/lib/validators/highlightComment";
import { useMutation } from "@tanstack/react-query";

interface HighlightSingleCommentProps{
    comment: HighlightCommentWithRelations
}

const HighlightSingleComment = ({comment}: HighlightSingleCommentProps) => {

    const [input, setInput] = useState<string>(`@${comment.author.name}`);
    const { data: session } = useSession();
    const router = useRouter();

    const [isReplying, setIsReplying] = useState<boolean>(false);

    const { mutate: postComment, isLoading } = useMutation({
        mutationFn: async ({ highlightId, text, replyToId }: HighlightCreateCommentRequest) => {
          const payload: HighlightCreateCommentRequest = { highlightId, text, replyToId };
    
          const { data } = await axios.post(
            '/api/paper/highlight/comment/create',
            payload
          );
          return data;
        },
        onSuccess: () => {
            router.refresh();
            setInput('');
        }
    });

    return (
        <div className='flex flex-col'>
            <div className='flex items-center'>
                <UserAvatar 
                    user={{
                        name: comment.author.name || null,
                        image: comment.author.image || null,
                    }}
                    className="h-6 w-6"/>
            
                <div className='ml-2 flex items-center gap-x-2'>
                    <p className='text-sm font-medium text-gray-900'>u/{comment.author.name}</p>

                    <p className='max-h-40 truncate text-xs text-zinc-500'>
                        {formatTimeToNow(new Date(comment.createdAt))}
                    </p>
                </div>
            </div>
            <p className='text-sm text-zinc-900 mt-2'>{comment.content}</p>
            <div className='flex gap-2 items-center'>
                <Button
                    onClick={() => {
                        if (!session) return router.push('/sign-in')
                        setIsReplying(true)
                    }}
                    variant='ghost'
                    size='xs'>
                    <MessageSquare className='h-4 w-4 mr-1.5' />
                    Reply
                </Button>
            </div>

            {isReplying ? (
            <div className='grid w-full gap-1.5'>
                <Label htmlFor='comment'>Your comment</Label>
                <div className='mt-2'>
                <Textarea
                    onFocus={(e) =>
                        e.currentTarget.setSelectionRange(
                        e.currentTarget.value.length,
                        e.currentTarget.value.length
                        )
                    }
                    autoFocus
                    id='comment'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder='What are your thoughts?'
                />
                <div className='mt-2 flex justify-end gap-2'>
                    <Button
                        tabIndex={-1}
                        variant='subtle'
                        onClick={() => setIsReplying(false)}>
                        Cancel
                    </Button>
                    <Button
                        isLoading={isLoading}
                        onClick={() => {
                            if (!input) return
                            postComment({
                                highlightId: comment.highlightID,
                                text: input,
                                replyToId: comment.replyToId ?? comment.id, // default to top-level comment
                            })
                        }}>
                        Post
                    </Button>
                </div>
                </div>
            </div>
            ): null}
        </div>
    )
}

export default HighlightSingleComment;