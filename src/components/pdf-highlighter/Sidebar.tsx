import React from "react";
import { IHighlight } from "./PaperDisplay";
import HighlightVoteClient from "./highlight-vote/HighlightVoteClient";
import { getAuthSession } from "@/lib/auth";
import { User } from "@prisma/client";

interface Props {
  highlights: Array<IHighlight>;
  highlightRefs: React.MutableRefObject<React.RefObject<HTMLLIElement>[]>;
  selectedId?: string,
  categoryLabels: Map<string, string>,
  user?: User
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  highlightRefs,
  selectedId,
  categoryLabels,
  user
}: Props) {

  return (
    // TODO:: fix view height hack so that formatting is resilient to rescaling
    <div className="sidebar" style={{width:"20vw", height: "80vh", marginRight:"1rem", overflowY:"scroll"}}>
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
      <ul style={{display: "flex", flexDirection: "column",gap:"0.5rem"}}>
        {highlights.map((highlight, index) => (
          <li
            key={index}
            ref={highlightRefs.current[index]}
            className={`hover:bg-gray-300 rounded`}
            style={highlight.id == selectedId ? {backgroundColor: categoryLabels.get(highlight.author.id)} : undefined}
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
            <HighlightVoteClient 
              highlightID={highlight?.id}
              initialVoteAmt={highlight.votes.reduce((acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
              }, 0)}
              initialVote={highlight.votes.find(
                (highlight) => highlight.userId === user?.id
              )?.type}/>
            <hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );
}
