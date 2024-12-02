'use client'

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/hooks/use-toast';
import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { UploadDropzone, uploadFiles } from "@/lib/uploadthing";

const Page = () => {
    const router = useRouter();
    const [input, setInput] = useState<string>('');
    const { loginToast } = useCustomToasts();

    const [paper, setPaper] = useState<File | null>(null);
    // 0 - Haven't uploaded anything
    // 1 - Added to client side
    const [uploadStatus, setUploadStatus] = useState<number>(0);
 

    const { mutate: createPaper, isLoading } = useMutation({
      mutationFn: async () => {
        let pdf = null
        if (paper)
          [pdf] = await uploadFiles("pdfUploader", { files: [paper] })

        console.log(pdf)
        
        const payload = pdf ? { name : input, pdf: pdf.url} : { name: input }

        const { data } = await axios.post('/api/paper', payload);
        return data as string;
      },
          onError: (err) => {
            if (err instanceof AxiosError) {
              if (err.response?.status === 409) {
                return toast({
                  title: 'Paper already exists.',
                  description: 'Please choose a different name.',
                  variant: 'destructive',
                });
              }

              if (err.response?.status === 422) {
                return toast({
                  title: 'Invalid paper name.',
                  description: 'Please choose a name between 3 and 21 letters.',
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
            router.push(`/p/${data}`)
        },
    })

  useEffect(() => {
    if(paper !== null){
      setUploadStatus(1);
    }
  }, [paper]);

  return (
    <div className='container flex items-center h-full max-w-3xl mx-auto mt-12'>
      <div className='relative bg-white w-full h-fit p-4 rounded-lg space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>Register a Paper</h1>
        </div>

        <hr className='bg-red-500 h-px' />

        <div>
          <p className='text-lg font-medium'>Name</p>
          <p className='text-xs pb-2'>
            Paper name including capitalization cannot be changed.
          </p>
          <div className='relative'>
            <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
              p/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='pl-6'
            />
          </div>
        </div>
        <div>
          <p className='text-lg font-medium'>Paper pdf</p>
          <p className='text-xs pb-2'>
            Paper pdf cannot be changed.
          </p>
          <UploadDropzone
            endpoint="pdfUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            onUploadBegin={(name) => {
              // Do something once upload begins
              console.log("Uploading: ", name);
            }}
            onDrop={(acceptedFiles) => {
              // Do something with the accepted files
              console.log("Accepted files: ", acceptedFiles);
              if (acceptedFiles.length > 0)
                setPaper(acceptedFiles[0]);
            }}
          />
        </div>
        <div className={'flex justify-center text-sm '
        + (uploadStatus == 0? "text-gray-800":"text-green-700")                
        }>
          {uploadStatus == 0? "Upload a File":
          "Selected file: " + paper?.name}
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
            disabled={input.length === 0}
            onClick={() => createPaper()}>
            Register Paper
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page