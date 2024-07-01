'use client'

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/hooks/use-toast';
import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { CreateSubredditPayload } from '@/lib/validators/subreddit';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [input, setInput] = useState<string>('');
  const { loginToast } = useCustomToasts();

  const [associatePaper, setAssociatePaper] = useState<boolean>(false);
  const [paperName, setPaperName] = useState<string>('');

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = associatePaper ? { name: input, paperName } : { name: input } 

      const { data } = await axios.post('/api/subreddit', payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Category already exists.',
            description: 'Please choose a different name.',
            variant: 'destructive',
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: 'Invalid category name.',
            description: 'Please choose a name between 3 and 21 letters.',
            variant: 'destructive',
          });
        }

        if (err.response?.status === 420) {
          return toast({
            title: 'Unable to associate paper',
            description: `Could not find paper with name "${paperName}".`,
            variant: 'destructive',
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: 'There was an error.',
        description: 'Could not create category.',
        variant: 'destructive',
      });
    },

    onSuccess: (data) => {
      router.push(`/r/${data}`)
    },
  })

  return (
    <div className='container flex items-center h-full max-w-3xl mx-auto'>
      <div className='relative bg-white w-full h-fit p-4 rounded-lg space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>Create a Category</h1>
        </div>

        <hr className='bg-red-500 h-px' />

        <div>
          <p className='text-lg font-medium'>Name</p>
          <p className='text-xs pb-2'>
            Category names including capitalization cannot be changed.
          </p>
          <div className='relative'>
            <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='pl-6'
            />
          </div>
        </div>
        <div>
          <p className='text-lg font-medium'>Associate a paper</p>
          <p className='text-xs pb-2'>
            The paper associated to a subreddit cannot be changed. Subreddits can be created without associating a paper.
          </p>
          <Input type="checkbox" onClick={() => setAssociatePaper(prev => !prev)} className='pl-6' />
          {associatePaper && 
            <Input value={paperName} onChange={(e) => setPaperName(e.target.value)} className='pl-6' />}

        </div>
        <div className='flex justify-end gap-4'>
          <Button
            disabled={isLoading}
            variant='subtle'
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0 || associatePaper && paperName.length === 0}
            onClick={() => createCommunity()}>
            Create Community
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page