import { Paper } from '@prisma/client';

interface PaperElementProps{
    data: Paper
}

const PaperElement = ({data}: PaperElementProps) => {
    return (
        <div className='relative w-full h-20 p-2 bg-white hover:bg-gray-200'
        onClick={() => window.open("http://localhost:3000/p/" + data.name)}>
            <div className='text-xl font-medium antialiased'>
                {data.name}
            </div>
            <div className='text-sm font-small text-gray-500'>
                {/* @ts-ignore-error */}
                {new Date(data.createdAt?.toString())
                .toISOString().replace('-', '/').split('T')[0].replace('-', '/')}
            </div>
        </div>
    )
}

export default PaperElement;