import { IHighlight } from "../PaperDisplay"
import CreateHighlightComment from "./CreateHighlightComment"
import HighlightComments from "./HighlightComments"


interface HighlightCommentSectionProps {
    closeComment: Function,
    highlight: IHighlight
}


export function HighlightCommentSection(state: HighlightCommentSectionProps) {
    return (
        <div className='z-10 absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gray-200 bg-opacity-50'>
            <span onClick={() => state.closeComment(null)}
                className='z-15 absolute top-0 right-2 text-6xl font-extrabold cursor-pointer color-white'>&times;</span>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 transform -translate-y-1/2 w-3/4 h-5/6'>
                {/* @ts-ignore-error */}
                <div className="absolute flex flex-col h-full w-full bg-white rounded-xl p-3 overflow-x-auto">
                    <p className="text-xl border-b-2 border-gray-200 h-10">{state.highlight.comment.text} - {state.highlight.author.name}</p>
                    {state.highlight.content.text ? (
                        <blockquote style={{ marginTop: "0.5rem" }}>
                        {`${state.highlight.content.text.slice(0, 90).trim()}…`}
                        </blockquote>
                    ) : null}
                    {state.highlight.content.image ? (
                        <div
                        className="highlight__image"
                        style={{ marginTop: "0.5rem" }}>
                        <img src={state.highlight.content.image} alt={"Screenshot"} />
                        </div>
                    ) : null}
                    <div className="border-b-2 border-gray-200 h-1"></div>
                    <CreateHighlightComment highlightId={state.highlight.id}
                    replyToId={undefined}/>
                    <div className="border-b-2 border-gray-200 h-1"></div>
                    <HighlightComments highlight={state.highlight} />
                </div>
            </div>
        </div>
    )
}