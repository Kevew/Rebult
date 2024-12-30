"use client"

import { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Paper } from "@prisma/client";
import { Input } from "./ui/Input";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface SearchBarProps{}

const SearchBar =({}: SearchBarProps) => {

    const router = useRouter();

    const [input, setInput] = useState<string>('');

    const commandRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(commandRef, () => {
        setInput('');
    });


    const request = debounce(async () => {
        refetch()
    }, 300);

    const debounceRequest = useCallback(() => {
        request();
    }, []);

    const {data: queryResults, refetch, isFetched, isFetching} = useQuery({
        queryFn: async () => {
            if(!input) return [];
            const { data } = await axios.get(`/api/search?q=${input}`);
            return data as Paper[];
        },
        queryKey: ['search-query'],
        enabled: false,
    });


    return (
        <div ref={commandRef}
        className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
            <Input 
                className='outline-none border-none focus:border-none focus:outline-none ring-0'
                placeholder="Search Papers..."
                value={input}
                onChange={(text) => {
                    setInput(text.target.value);
                    debounceRequest();
                }}>
            </Input>

            {input.length > 0 && (
            <ul className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
                {isFetched && queryResults?.length == 0 && <div>No results found.</div>}
                {(queryResults?.length ?? 0) > 0 ? (
                    <>
                        {queryResults?.map((paper) => (
                            <li 
                                onSelect={(e) => {
                                    router.push(`/p/${e}`)
                                    router.refresh()
                                }}
                                key={paper.id}
                                value={paper.name}
                                className="rounded-b-md inset-x-0">
                                <a href={`/p/${paper.name}`}>p/{paper.name}</a>
                            </li>
                        ))}
                    </>
                ): null}
            </ul>)
            }
        </div>
    )
}

export default SearchBar;