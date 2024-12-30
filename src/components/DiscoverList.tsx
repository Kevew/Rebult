import { Prisma } from "@prisma/client";
import Link from "next/link";

interface DiscoverListProps {
    papers: PaperWithAuthor[]
};

type PaperWithAuthor = Prisma.PaperGetPayload<{
    include: {
        creator: true;
    };
}>;

const DiscoverList = ({papers}: DiscoverListProps) => {
    return (
        <ul>
            {papers && papers.map((paper) => {
                return (
                    <li className="border-2 border-gray-200 my-2">
                        <Link href={`/p/` + paper.name}>
                            <div className="p-4 md:py-5 md:px-6 lg:py-6 lg:px-8">
                                <div className="text-[18px] leading-[20px] h-[38px] pt-[3px] w-[138px] overflow-hidden text-ellipsis break-words">
                                    {paper.name}
                                </div>
                                <div className="font-medium text-gray-400">
                                    by: {paper.creator.name}
                                </div>
                            </div>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default DiscoverList;