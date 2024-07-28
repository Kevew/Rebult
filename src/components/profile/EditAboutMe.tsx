import { startTransition, useState } from "react";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { updateAboutMeRequest } from "@/lib/validators/aboutMe";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useRouter } from "next/navigation";

interface EditAboutMeProps {
    description: string,
    closeWindow: Function
}

const EditAboutMe = ({description, closeWindow}: EditAboutMeProps) => {

    const [textInput, setTextInput] = useState(description);
    const { toast } = useToast();
    const { loginToast } = useCustomToasts();
    const router = useRouter();

    const { mutate: updateDescription, isLoading: isAboutLoading } = useMutation({
        mutationFn: async () => {
            const payload: updateAboutMeRequest = {
                description: textInput
            }

            const { data } = await axios.post('/api/profile', payload)
            return data as string;
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
            
            toast({
                title: 'Updated!',
                description: `You're About Me description has been updated!`,
            });
            closeWindow();
        },
    })

    return(
        <div className="absolute flex flex-col h-full w-full bg-white rounded-xl p-3">
            <p className="text-xl border-b-2 border-gray-200 h-10">About Me</p>
            <p className="text-xs text-gray-400 text-opacity-85 my-5">
                Write about your speciality, skills or background! Feel free to write
                anything you want!
            </p>
            <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                name="Text1" 
                /* @ts-ignore-error */
                cols="40" 
                /* @ts-ignore-error */
                rows="5"
                className='flex p-3 w-full h-3/5 rounded-md border border-input focus-visible:outline'
            />
            <div className="w-full mt-8 border-t-2 border-gray-200 "></div>
            <Button
                type="submit"
                className="w-1/12 mt-4 d-block mr-0 ml-auto"
                onClick={() => updateDescription()}
                isLoading={isAboutLoading}>
                Save
            </Button>
        </div>
    )
}

export default EditAboutMe;