"use client"

import {
    PdfLoader,
    PdfHighlighter,
    Popup,
   NewHighlight,
   ScaledPosition,
   Content,
   Comment
  } from "../../../react-pdf-highlighter-with-categories";

import { Tip } from "./Tip"

import { HighlightVote, Subreddit, User } from "@prisma/client";
import { useMutation } from '@tanstack/react-query';


import { Highlight } from "./Highlight";
import { AreaHighlight } from "./AreaHighlight"

import { Sidebar } from "./Sidebar";

import { ExtendedHighlight } from "@/types/db";

import { FC } from "react"
import * as React from "react"
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/Button";

const getNextId = () => String(Math.random()).slice(2);
const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);
const resetHash = () => {
  document.location.hash = "";
};

// compute categorylabels from a labelMap
const getCategoryLabels : (x : Map<string, string>) => {label : string, background : string}[] = 
(x) => (
  Array.from(x).map(
    ([key, value]) => ({label : key, background : value})
  )
)

const getRandomColor : () => string = () => "#" + Math.floor(Math.random()*16777215).toString(16);

export interface IHighlight {
  position: ScaledPosition,
  content: Content,
  comment: Comment
  subreddit: Subreddit,
  author: User,
  id : string,
  votes: HighlightVote[]
}


const HighlightPopup = ({
  comment,
}: {
  comment: { text: string; category: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.category} {comment.text}
    </div>
  ) : null;

  interface PaperProps {
    name : string,
    pdf : string,
    initialHighlights: ExtendedHighlight[],
    subreddit : Subreddit,
    createHighlight: (highlight : Highlight) => string, // creates a higlight and returns the highlight id
    user?: User
}

  interface State {
    data: Uint8Array | null;
    highlights: Array<IHighlight>;
    labelMap: Map<string, string>;
    destinationPage: number;
    pageCount: number;
    currentPage: number;
    flag: boolean;
    selectedId?: { id: string; mode: "click" | "hover" };
  }

export const PaperDisplay : FC<PaperProps> = ({name, user, pdf, initialHighlights, subreddit}) => {
  const [state, setState] = React.useState<State>({
    data: null,
    highlights: initialHighlights as IHighlight[],
    labelMap: (() => {
      let lol = new Map();
      initialHighlights.map((x) => {
        if (!lol.has(x))
          lol.set(x.author.id, getRandomColor())
      })
      if (!lol.has(user?.id))
        lol.set(user?.id, getRandomColor())
      return lol
    })(),
    destinationPage: 1,
    pageCount: 0,
    currentPage: 1,
    flag: false,
  });

  const ref = React.useRef<HTMLDivElement>();

  const commentRefs = React.useRef(state.highlights.map(() => React.createRef<HTMLLIElement>()))

  let scrollViewerTo = (highlight: any) => { };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight) {
      scrollViewerTo(highlight);
    }
  };

  React.useEffect(() => {
    window.addEventListener(
      "hashchange",
      scrollToHighlightFromHash,
      false
    );
  }, [])

  function getHighlightById(id: string) {
    const { highlights } = state;

    return highlights.find((highlight) => highlight.id === id);
  }

  const { mutate: createHighlight, isLoading } = useMutation({
    mutationFn : async ({ highlight, id } : {highlight : NewHighlight; id : string}) => {
      console.log(subreddit)
      const payload = {
        highlight : highlight,
        subredditId : subreddit.id
      }
      try {
        const { data } = await axios.post('/api/paper/highlight/create', payload)
      } catch (e) {
        throw id;
      }
    },
    onError: (id : string) => {
      setState(prev => {
        const index = getHighlightIndex(id)
        // TODO:: in the future have some sort flag (maybe highlight in the sidebar) instead of outright deleting the highlight
        return {
          ...prev,
          highlights: state.highlights.slice(0, index).concat(state.highlights.slice(index + 1)),
        }
      })
      return toast({
          title: "Something went wrong!",
          description: "You're highlight was not published, please try again later. Your highlight will now be deleted from the viewer",
          variant: "destructive"
      })
    },
    onSuccess: () => {
    }
  })

  function addHighlight(highlight: NewHighlight) {

    console.log("Saving highlight", highlight);
    console.log(state.labelMap)

    const id = getNextId()

    createHighlight({ highlight, id})

    setState((prev) => {
      const { highlights } = prev;
      console.log("Saving highlight", highlight);
      commentRefs.current.push(React.createRef<HTMLLIElement>())
      console.log(user)
      return {
        ...prev,
        highlights: [{ ...highlight, id, author: user!, subreddit: subreddit }, ...highlights],
      }
    });
  }

  function getHighlightIndex(highlightId: string): number {
    for (let index = 0; index < highlights.length; index++) {
      if (highlights[index].id === highlightId)
        return index
    }
    return 0
  }
  function updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    setState((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
            id,
            position: { ...originalPosition, ...position },
            content: { ...originalContent, ...content },
            ...rest,
          }
          : h;
      }),
    }));
  }

  const { highlights, data } = state;

  return (
    <div className="App" style={{display:"flex", flexDirection:"column"}}>
      <div style={{display:"flex", justifyContent:"flex-end", gap:"0.5rem"}}>
        <Button className="bg-gray-400 text-zinc-700 hover:bg-gray-300 self-end" onClick={() => setState(prev => ({ ...prev, flag: !prev.flag }))} disabled={user === undefined}>toggle mode {state.flag || user === undefined ? "view only" : "suggest only"}</Button>
        <Button className="bg-gray-400 text-zinc-700 hover:bg-gray-300 self-end mt-1" onClick={() => setState(prev => ({ ...prev, selectedId:undefined }))} disabled={state.selectedId?.mode !== "click"}>Clear selected comment</Button>
        <button onClick={() => {ref.current?.scrollIntoView()}}>fullscreen</button>
      </div>
      <div className="flex w-full h-full" ref={ref}>
        <Sidebar
          highlightRefs={commentRefs}
          highlights={highlights as IHighlight[]}
          selectedId={state.selectedId?.id}
          categoryLabels={state.labelMap}
          user={user}
        />
        <div className="relative w-full">
          <div className="left-2 flex gap-2" >
            <Button
              className="bg-gray-400 text-zinc-700 h-0.5 hover:bg-gray-300"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  destinationPage: prev.currentPage > 1 ? prev.currentPage - 1 : 1,
                }))
              }
            >
              Decrease
            </Button>
            <Button
              className="bg-gray-400 text-zinc-700 h-0.5 hover:bg-gray-300"
              disabled
            >
              {"Current page: " + state.currentPage}
            </Button>
            <Button
              className="bg-gray-400 text-zinc-700 h-0.5 hover:bg-gray-300"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  destinationPage:
                    prev.currentPage < prev.pageCount
                      ? prev.currentPage + 1
                      : prev.currentPage,
                }))
              }
            >
              Increase
            </Button>
            <Button
              className="bg-gray-400 text-zinc-700 h-0.5 hover:bg-gray-300"
              disabled
            >
              {"Pages: " + state.pageCount}
            </Button>
            <Button
              className="bg-gray-400 text-zinc-700 h-0.5 hover:bg-gray-300"
              onClick={() => setState((prev) => ({ ...prev, destinationPage: 1 }))}
            >
              Back to Page 1
            </Button>
          </div>
          <PdfLoader url={pdf} beforeLoad={<></>/*<Spinner />*/} data={data}>
            {(pdfDocument) => (
              <PdfHighlighter
                categoryLabels={getCategoryLabels(state.labelMap)}
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                onScrollChange={resetHash}
                // pdfScaleValue="page-width"
                scrollRef={(scrollTo) => {
                  scrollViewerTo = scrollTo;

                  scrollToHighlightFromHash();
                }}
                destinationPage={state.destinationPage}
                getPageCount={(pageCount) => {
                  setState((prev) => ({ ...prev, pageCount }));
                }}
                getCurrentPage={(currentPage) => {
                  setState((prev) => ({ ...prev, currentPage }));
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection,
                  categoryLabels
                ) => (
                  <Tip
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                    categoryLabels={categoryLabels}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  console.log(state.highlights)
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                      categoryLabels={getCategoryLabels(state.labelMap)}
                      pointerEvents={state.flag}
                      authorId={highlight.author ? highlight.author.id : user!.id}
                      onClick={() => { 
                        commentRefs.current[getHighlightIndex(highlight.id)].current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'nearest',
                        }) 
                        setState(prev => ({...prev, selectedId: { id: highlight.id, mode: "click" }}))
                      }}
                      onMouseOver={() => { 
                        if (state.selectedId?.mode == "click")
                          return
                        commentRefs.current[getHighlightIndex(highlight.id)].current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'nearest',
                        }) 
                        setState(prev => ({...prev, selectedId: { id: highlight.id, mode: "hover" }}))
                      }}
                      onMouseOut={() => {
                        setState(prev => (prev.selectedId?.mode == "hover" ? {...prev, selectedId: undefined} : prev))
                      }}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      authorId={highlight.author ? highlight.author.id : user!.id}
                      onChange={(boundingRect) => {
                        updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                      comment={highlight.comment}
                      categoryLabels={getCategoryLabels(state.labelMap)}
                      onClick={() => {
                        commentRefs.current[getHighlightIndex(highlight.id)].current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'nearest',
                        }) 
                        setState(prev => ({...prev, selectedId: { id: highlight.id, mode: "click" }}))
                      }}
                    />
                  );

                  return (
                    // the actual popup portion doesnt work (only component shows rn)
                    // this is because `pointer-events:none` in highlight.tsx
                    // TODO :: fix this
                    <Popup
                      popupContent={<HighlightPopup {...highlight} />}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
                selectionMode={!state.flag && user !== undefined}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    </div>
  );  
}

