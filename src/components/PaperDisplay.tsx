"use client"

import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Highlight,
    Popup,
    AreaHighlight,
  } from "@argument-studio/react-pdf-highlighter-with-categories";

  import { FC } from "react"

  interface PaperProps {
    name : string
    pdf : string
  }

  export const PaperDisplay : FC<PaperProps> = ({name, pdf}) => {
    return (
    <PdfLoader url={pdf} beforeLoad={<h1>aslda</h1>}>
      {(pdfDocument) => 
      <PdfHighlighter 
          categoryLabels={[]}
          selectionMode={false}
          pdfDocument={pdfDocument}
          scrollRef={(scrollTo) => {}}
          enableAreaSelection={(event) => event.altKey}
          highlightTransform={(Highlight) => <></>}
          highlights={[]}
          getPageCount={(pageCount) => {
          }}
          onScrollChange={() => {}}
          getCurrentPage={(currentPage) => {
          }}
          onSelectionFinished={(position, content, a, b, c) => null}
      />}
      {/* {paper.subreddits.map(subreddit => {
          <h4>{subreddit.name}</h4>
      })} */}
    </PdfLoader>
    )
  }

