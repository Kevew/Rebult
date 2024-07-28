"use client"

import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Popup,
    AreaHighlight,
   NewHighlight,
   ScaledPosition,
   Content,
   Comment
  } from "@argument-studio/react-pdf-highlighter-with-categories";

import { Subreddit, User } from "@prisma/client";

import { Highlight } from "./Highlight";

import { Sidebar } from "./Sidebar";

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

interface IHighlight {
  position: ScaledPosition,
  content: Content,
  comment: Comment
  subreddit: Subreddit,
  author: User,
  id : string
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

  import { ExtendedHighlight } from "@/types/db";

  import { FC } from "react"
  import * as React from "react"

  interface PaperProps {
    name : string,
    pdf : string,
    initialHighlights: ExtendedHighlight[],
    subreddit : Subreddit,
    user: User
  }

  interface State {
    data: Uint8Array | null;
    highlights: Array<IHighlight>;
    labelMap: Map<string, string>;
    destinationPage: number;
    pageCount: number;
    currentPage: number;
    flag: boolean;
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
        if (!lol.has(user.id))
          lol.set(user.id, getRandomColor())
        return lol
      })(),
      destinationPage: 1,
      pageCount: 0,
      currentPage: 1,
      flag: false
    });
  
    const commentRefs = React.useRef(state.highlights.map(() => React.createRef<HTMLLIElement>()))
  
  
    const resetHighlights = () => {
      setState((prev) => ({
        ...prev, highlights: [],
      }));
    };
  
    const setCategoryLabels = (update: { label: string; background: string }[]) => {
      setState((prev) => {
        const newMap = new Map(prev.labelMap);
        if (newMap.has(user.id))
          newMap.set(user.id, getRandomColor());
        return { ...prev, labelMap : newMap};

      });
    };
  
  
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
  
    function addHighlight(highlight: NewHighlight) {
  
      console.log("Saving highlight", highlight);
      console.log(state.labelMap)
  
      setState((prev) => {
        const { highlights } = prev;
        console.log("Saving highlight", highlight);
        commentRefs.current.push(React.createRef<HTMLLIElement>())
        console.log(user)
        return {
          ...prev,
          highlights: [{ ...highlight, id: user.id, author: user, subreddit: subreddit }, ...highlights],
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
      <div className="App" style={{ display: "flex", height: "100vh" }}>
        <button onClick={() => setState(prev => ({ ...prev, flag: !prev.flag }))}>toggle mode {state.flag ? "view only" : "suggest only"}</button>
        <div
          style={{
            position: "absolute",
            left: "10px",
            display: "flex",
            gap: "10px",
            zIndex: 100,
          }}
        >
          <button
            style={{
              width: "70px",
              height: "20px",
              backgroundColor: "grey",
              borderRadius: "5px",
            }}
            onClick={() =>
              setState((prev) => ({
                ...prev,
                destinationPage: prev.currentPage > 1 ? prev.currentPage - 1 : 1,
              }))
            }
          >
            Decrease
          </button>
          <div
            style={{
              height: "20px",
              backgroundColor: "grey",
              borderRadius: "5px",
              textAlign: "center",
              padding: "0 5px",
            }}
          >
            {"Current page: " + state.currentPage}
          </div>
          <button
            style={{
              width: "70px",
              height: "20px",
              backgroundColor: "grey",
              borderRadius: "5px",
            }}
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
          </button>
          <div
            style={{
              height: "20px",
              backgroundColor: "grey",
              borderRadius: "5px",
              textAlign: "center",
              padding: "0 5px",
            }}
          >
            {"Pages: " + state.pageCount}
          </div>
          <button
            style={{
              width: "auto",
              height: "20px",
              backgroundColor: "grey",
              borderRadius: "5px",
            }}
            onClick={() => setState((prev) => ({ ...prev, destinationPage: 1 }))}
          >
            Back to Page 1
          </button>
        </div>
        <Sidebar
          highlightRefs={commentRefs}
          highlights={highlights as IHighlight[]}
          resetHighlights={resetHighlights}
          toggleDocument={() => {}}
          categoryLabels={getCategoryLabels(state.labelMap)}
          setCategoryLabels={setCategoryLabels}
          setPdfUrl={(url) => {
            setState((prev) => ({ ...prev, url, data: null, highlights: [] }));
          }}
          setPdfData={(data) => {
            setState((prev) => ({ ...prev, data, url: "", highlights: [] }));
          }}
        />
        <div
          style={{
            height: "100vh",
            width: "75vw",
            position: "relative",
          }}
        >
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
                      console.log("wtf")
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
                      authorId={highlight.author ? highlight.author.id : user.id}
                      onClick={() => { console.log(getHighlightIndex(highlight.id)); console.log(commentRefs); commentRefs.current[getHighlightIndex(highlight.id)].current?.scrollIntoView() }}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                      comment={highlight.comment}
                      categoryLabels={getCategoryLabels(state.labelMap)}
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
                selectionMode={!state.flag}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );  
}

