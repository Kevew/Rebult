"use client"

import {
    PdfLoader,
    PdfHighlighter,
    Popup,
   NewHighlight,
   ScaledPosition,
   Content,
   Comment
  } from "@argument-studio/react-pdf-highlighter-with-categories";

import { Tip } from "./Tip";

import optionIcon from '../../../public/Option.svg';

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
import { HighlightCommentSection } from "./HighlightComment/HighlightCommentSection";

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

interface HighlightPopupProps{
  comment: {
    text: string,
    category: string
  }
}

const HighlightPopup = ({ comment }: HighlightPopupProps) => 
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
    selectedId?: { id: string; mode: "click" | "hover" };
}

export const PaperDisplay : FC<PaperProps> = ({name, user, pdf, initialHighlights, subreddit}) => {
  const [state, setState] = React.useState<State>({
    data: null,
    // @ts-ignore
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
  });

  const ref = React.useRef<HTMLDivElement>();

  const commentRefs = React.useRef(state.highlights.map(() => React.createRef<HTMLLIElement>()))

  let scrollViewerTo = (highlight: any) => { };

  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightIndex(parseIdFromHash());

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

    const handleOutsideClick = (event: MouseEvent) => {
      const menuButton = document.getElementById("menu-button");
      const dropdownMenu = document.getElementById("dropdown-menu");

      if (
        dropdownMenu && menuButton &&
        !dropdownMenu.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [])

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

    // @ts-ignore
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
    return state.highlights.findIndex((highlight) => highlight.id === highlightId);
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

  const [isDropdownOpen, setDropdownOpen] = React.useState(false);
  const [flag, setFlag] = React.useState(false);

  const [isOpenComment, setIsOpenComment] = React.useState<IHighlight | null>(null);

  return (
    <div className="App" style={{display:"flex", flexDirection:"column"}}>
      {isOpenComment != null && 
      <HighlightCommentSection closeComment={setIsOpenComment}
        highlight={isOpenComment}/>}
      {/*@ts-ignore*/}
      <div className="flex w-full h-full" ref={ref}>
        <Sidebar
          highlightRefs={commentRefs}
          highlights={highlights as IHighlight[]}
          selectedId={state.selectedId?.id}
          categoryLabels={state.labelMap}
          user={user}
          commentOpen={setIsOpenComment}
        />
        <div className="relative w-full">
          <div className="left-2 flex gap-2 my-2" >
            <div className="relative inline-block text-left">
              <Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" 
                disabled={user === undefined}
                onClick={() => 
                  setDropdownOpen((prev) => !prev)
                }
                id="menu-button" aria-expanded="true" aria-haspopup="true">
                  <div className="text-sm font-semibold text-gray-900">
                    {flag || user === undefined ? "View" : "Suggestion "}
                  </div> 
                  <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                  </svg>
              </Button>
              {isDropdownOpen &&
              <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none" 
              role="menu" aria-orientation="vertical" aria-labelledby="menu-button" id="dropdown-menu">
                <div className="py-1" role="none">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" 
                  onClick={() => {setFlag(true)
                  setDropdownOpen(false)}}
                  role="menuitem" id="menu-item-0">View</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700" 
                  onClick={() => {setFlag(false)
                  setDropdownOpen(false)}}
                  role="menuitem" id="menu-item-1">Suggestion</a>
                </div>
              </div> }
            </div> 
            <Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" 
              onClick={() => setState(prev => ({ ...prev, selectedId:undefined }))}
              disabled={state.selectedId?.mode !== "click"}>
              Unselect Comment
            </Button>
            <Button
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  destinationPage: prev.currentPage > 1 ? prev.currentPage - 1 : 1,
                }))
              }
              content="Decrease">Decrease</Button>
            <Button
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled>
              {"Page: " + state.currentPage}
            </Button>
            <Button
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              disabled>
              {"Total Pages: " + state.pageCount}
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
                      pointerEvents={flag}
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
                    >
                      {component}
                    </Popup>
                  );
                }}
                highlights={highlights}
                selectionMode={!flag && user !== undefined}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    </div>
  );  
}

