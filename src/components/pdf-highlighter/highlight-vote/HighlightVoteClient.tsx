'use client'

import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { usePrevious } from '@mantine/hooks';
import { VoteType } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { HighlightPostVoteRequest } from '@/lib/validators/highlightVote';

interface HighlightVoteClientProps {
    highlightID: string,
    initialVoteAmt: number,
    initialVote?: VoteType
}

const HighlightVoteClient: FC<HighlightVoteClientProps> = ({
    highlightID,
    initialVoteAmt,
    initialVote,
}) => {
    const { loginToast } = useCustomToasts();
    const [votesAmt, setVotesAmt] = useState<number>(initialVoteAmt);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const prevVote = usePrevious(currentVote);

    useEffect(() => {
        setCurrentVote(initialVote);
    }, [initialVote])

    const {mutate: vote} = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: HighlightPostVoteRequest = {
                highlightID,
                voteType,
            };

            await axios.patch('/api/paper/highlight/vote/patch', payload);
        },
        onError: (err, voteType) => {
            if(voteType === "UP") setVotesAmt((prev) => prev - 1);
            else setVotesAmt((prev) => prev + 1);

            //reset the current votes
            setCurrentVote(prevVote);
            
            if(err instanceof AxiosError){
                if(err?.response?.status === 401){
                    return loginToast();
                }
            }

            return toast({
                title: 'Something went wrong!',
                description: "You're vote was not registered, please try again!",
                variant: 'destructive',
            });
        },
        onMutate: (type: VoteType) => {
            if (currentVote === type) {
                // User is voting the same way again, so remove their vote
                setCurrentVote(undefined);
                if (type === 'UP') setVotesAmt((prev) => prev - 1);
                else if (type === 'DOWN') setVotesAmt((prev) => prev + 1);
            } else {
                // User is voting in the opposite direction, so subtract 2
                setCurrentVote(type);
                if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
                else if (type === 'DOWN')
                    setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
            }
        },
    })
    
    return (
        <div className='flex flex-row gap-8 py-2 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0 float-right'>
            {/* upvote */}
            <Button
                onClick={() => vote('UP')}
                size='xxm'
                variant='ghost'
                aria-label='upvote'>
                <ArrowBigUp
                    className={cn('h-5 w-5 text-zinc-700', {
                        'text-emerald-500 fill-emerald-500': currentVote === 'UP',
                    })}
                />
            </Button>

            {/* score */}
            <p className='text-center py-2 font-medium text-sm text-zinc-900'>
                {votesAmt}
            </p>

            {/* downvote */}
            <Button
                onClick={() => vote('DOWN')}
                size='xxm'
                className={cn({
                    'text-emerald-500': currentVote === 'DOWN',
                })}
                variant='ghost'
                aria-label='downvote'>
                <ArrowBigDown
                    className={cn('h-5 w-5 text-zinc-700', {
                        'text-red-500 fill-red-500': currentVote === 'DOWN',
                    })}
                />
            </Button>
        </div>
    )
}

export default HighlightVoteClient;