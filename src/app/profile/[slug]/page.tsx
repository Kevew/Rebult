import OutsiderProfileView from "@/components/profile/OutsiderProfileView";
import UserProfileView from "@/components/profile/UserProfileView";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
    params: {
        slug: string,
    }
};

const page = async ({params}: pageProps) => {

    const {slug} = params;

    const session = await getAuthSession();

    // Check if the profile user is the same as the session user
    // If it's not, check if the account is open to see for all
    const viewable = (session && session.user.username == slug ? true : false);
    const profileInformation = await db.user.findFirst({
        where: {username: slug},
    });

    if(!profileInformation){
        return notFound();
    }

    return(
        <>{viewable ? 
            <UserProfileView profile={profileInformation}/> : 
            <OutsiderProfileView profile={profileInformation}/>
        }
        </>
    )
}

export default page;