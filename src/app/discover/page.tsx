import DiscoverList from "@/components/DiscoverList";
import { db } from "@/lib/db";

interface pageProps {

};

const page = async ({}: pageProps) => {

    const paperInformation = await db.paper.findMany({
        take: 10,
        include: {
            creator: true
        }
    });

    return (
        <div className="w-full h-full mt-12">
            <div>
                <div className="text-[21px] font-medium pb-[7px] pl-[2px]">
                    Recent
                </div>
            </div>
            <DiscoverList papers={paperInformation}/>
        </div>
    )
}

export default page;