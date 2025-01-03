import Link from "next/link";

const NoPostHomePage = ({}) => {
    return (
        <div className='flex flex-col col-span-2 space-y-6'>
            <div>Welcome to Rebutl! It seems that you haven&quot;t joined any discussions yet!</div>
            <div>
                To check out new papers, click&nbsp;
                <Link href="/discover" className="underline text-blue-400">Here</Link>
            </div>
        </div>
    )
}

export default NoPostHomePage;