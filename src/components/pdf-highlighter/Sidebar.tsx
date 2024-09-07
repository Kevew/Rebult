import React from "react";
import type { IHighlight } from "@argument-studio/react-pdf-highlighter-with-categories";
// import CategoryEditor from "./CategoryEditor";

interface Props {
  highlights: Array<IHighlight>;
  highlightRefs: React.MutableRefObject<React.RefObject<HTMLLIElement>[]>;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  highlightRefs
}: Props) {
  return (
    <div className="sidebar" style={{width:"20vw", marginRight:"1rem"}}>
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
    </div>
  );
}
