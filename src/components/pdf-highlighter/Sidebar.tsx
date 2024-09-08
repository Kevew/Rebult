import React from "react";
import type { ExtendedHighlight } from "@/types/db";
import { IHighlight } from "./PaperDisplay";

interface Props {
  highlights: Array<IHighlight>;
  highlightRefs: React.MutableRefObject<React.RefObject<HTMLLIElement>[]>;
  selectedId?: string
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  highlightRefs,
  selectedId
}: Props) {
  return (
    <div className="sidebar" style={{width:"20vw", marginRight:"1rem", overflowY:"scroll"}}>
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
      <ul>
        {highlights.map((highlight, index) => (
          <li
            key={index}
            ref={highlightRefs.current[index]}
            className={`hover:bg-gray-300 rounded mb-2 ${highlight.id === selectedId ? "bg-green-100" : ""}`}
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight.comment.text} - {highlight.author.name}</strong>
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
            <hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );
}
