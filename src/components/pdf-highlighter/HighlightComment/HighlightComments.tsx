import { useQuery } from "@tanstack/react-query";
import { IHighlight } from "../PaperDisplay";
import HighlightSingleComment from "./HighlightSingleComment";
import { Prisma } from "@prisma/client";
import axios from "axios";

interface HighlightCommentsProps{
    highlight: IHighlight
}

export type HighlightCommentWithRelations = Prisma.HighlightCommentGetPayload<{
    include: {
        author: true;
        replies: { include: { author: true } };
    };
}>;

const HighlightComments = ({highlight}: HighlightCommentsProps) => {
    
    const { data: fetchedComments, isLoading, error} = useQuery(
        ["comments", highlight.id],
        async () => {
            const { data } = await axios.get(`/api/paper/highlight/comment/getAll?highlightID=${highlight.id}`);
            return data as HighlightCommentWithRelations[] | null;
        },
    )

    if (isLoading) {
        return (<div>Loading comments...</div>);
    }

    if (error instanceof Error) {
        return (<div>Error: {error.message}</div>);
    }

    if (fetchedComments?.length == 0) {
        return (
            <div className="flex flex-col gap-y-6 mt-4">
                <div>There are no comments yet! Be the first one.</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-y-6 mt-4">
            {
                fetchedComments && fetchedComments.filter((comment) => !comment.replyToId)
                .map((topLevelComment) => {
                    return (
                        <div key={topLevelComment.id} className='flex flex-col'>
                            <div className='mb-2'>
                                <HighlightSingleComment
                                    comment={topLevelComment}
                                />
                            </div>
                            {topLevelComment.replies.map((reply) => {
                                const temp = reply as HighlightCommentWithRelations;
                                return (
                                    <div
                                        key={reply.id}
                                        className='ml-2 py-2 pl-4 border-l-2 border-zinc-200'>
                                        <HighlightSingleComment
                                            comment={temp}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default HighlightComments;