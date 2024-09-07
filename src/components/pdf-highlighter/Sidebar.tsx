import React, { useState } from "react";
import type { IHighlight } from "@argument-studio/react-pdf-highlighter-with-categories";
// import CategoryEditor from "./CategoryEditor";

interface Props {
  categoryLabels: { label: string; background: string }[];
  setCategoryLabels: (update: { label: string; background: string }[]) => void;
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  setPdfUrl: (update: string) => void;
  setPdfData: (update: Uint8Array) => void;
  highlightRefs: React.MutableRefObject<React.RefObject<HTMLLIElement>[]>;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  categoryLabels,
  setCategoryLabels,
  highlights,
  toggleDocument,
  resetHighlights,
  setPdfUrl,
  setPdfData,
  highlightRefs
}: Props) {
  const [show, setShow] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleSetUrl = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPdfUrl(urlInput);
    setUrlInput("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      console.warn("No file chosen");
      return;
    }

    //Step 2: Read the file using file reader
    let fileReader = new FileReader();
    fileReader.onerror = () => {
      alert(`Error occurred while reading ${file?.name}`);
    };
    fileReader.onabort = () => {
      console.log(`Reading ${file?.name} was aborted.`);
    };
    fileReader.onload = function () {
      //Step 3:turn array buffer into typed array
      if (this.result instanceof ArrayBuffer) {
        setPdfData(new Uint8Array(this.result));
      }
    };
    //Step 4:Read the file as ArrayBuffer
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="sidebar" style={{ width: "25vw" }}>
      <div style={{ padding: "1rem" }}>
        <div className="description">
          <h2 style={{ marginBottom: "1rem" }}>react-pdf-highlighter</h2>
          <p>
            <small>
              To create area highlight hold ⌥ Option key (Alt), then click and
              drag.
            </small>
          </p>
        </div>

      </div>

      {/* sidebar comments */}
      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            ref={highlightRefs.current[index]}
            className="sidebar__highlight"
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
      <div style={{ padding: "1rem" }}>
        <button onClick={toggleDocument}>Toggle PDF document</button>
      </div>
      {highlights.length > 0 ? (
        <div style={{ padding: "1rem" }}>
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null}
    </div>
  );
}
