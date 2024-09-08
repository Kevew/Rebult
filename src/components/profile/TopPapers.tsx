import { startTransition, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Paper, User } from "@prisma/client";
import PaperElement from "./PaperElement";

interface TopPapersProps{
    profile: User
}

const TopPapers = ({profile}: TopPapersProps) => {

    // 0 is by Top votes, 1 is by newest paper
    const [mode, setMode] = useState<number>(0);

    const { toast } = useToast();
    const { loginToast } = useCustomToasts();
    const router = useRouter();

    const {data, mutate: getPapers, isLoading: isPapersLoading } = useMutation({
        mutationFn: async () => {
            if(profile.id === null){
                return;
            }

            const path = `/api/profile/papers?id=${profile.id}`;

            const { data } = await axios.get(path);
            return data;
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            };

            return toast({
                title: 'There was an problem.',
                description: 'Something went wrong. Please try again!',
                variant: 'destructive',
            });
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            });
        },
    });

    useEffect(() => {
        getPapers();
    }, []); // Call the mutation only once when the component mounts
    
    useEffect(() => {
        if(mode == 0){
            // Haven't implemented voting for papers yet
        }else{
            data.sort(function(x: Paper, y: Paper){
                let xCreatedAt: Date = x.createdAt!;
                let yCreatedAt: Date = y.createdAt!;
                if(xCreatedAt >= yCreatedAt){
                    return -1;
                }else{
                    return 1;
                }
            });
            router.refresh();
        }
    }, [mode]);

    return (
        <div className="absolute top-0 w-full h-full flex flex-col">
            <div className="relative flex inline-block align-middle flex-row bg-white border-b-2 border-gray-200 space-x-4 h-1/8 py-2 m-1">
                <p className="align-middle font-bold">Top Papers Sort By: </p>
                <Button
                    variant='subtle' 
                    className='h-8 w-12 p-0 rounded'
                    onClick={() => setMode(0)}>
                    Top
                </Button>
                <Button
                    variant='subtle' 
                    className='h-8 w-12 p-0 rounded'
                    onClick={() => setMode(1)}>
                    New
                </Button>
            </div>
            <div className="relative flex-col bg-white h-7/8">
                {
                    !Array.isArray(data) ? <></>: data.map((data, key) => {
                        return <PaperElement key={key} data={data}/>
                    })
                }
            </div>
        </div>
    )
}

export default TopPapers;