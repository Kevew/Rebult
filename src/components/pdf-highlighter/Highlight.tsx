import React, { Component } from "react";

import "@argument-studio/react-pdf-highlighter-with-categories/dist/esm/style/Highlight.css";

import type { LTWHP } from "@argument-studio/react-pdf-highlighter-with-categories";

interface Props {
  categoryLabels: Array<{ label: string; background: string }>;
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  comment: {
    text: string;
  };
  authorId : string
  isScrolledTo: boolean;
  pointerEvents: boolean
}

export class Highlight extends Component<Props> {
  render() {
    const {
      categoryLabels,
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      comment,
      authorId,
      isScrolledTo,
      pointerEvents
    } = this.props;

    const { rects } = position;

    const handleStyle = (
      rect: {},
      labels: { label: string; background: string }[]
    ) => {
      let color = "#ddcc77";

      if (isScrolledTo) {
        return { ...rect, background: "" };
      }

      if (comment) {
        for (let item of labels) {
          if (authorId === item.label) {
            color = item.background;
          }
        }
      }
      return { ...rect, background: color, "pointer-events": pointerEvents ? "auto" : "none", opacity: .5 };
    };

    /* : comment && comment.category
            ? `Highlight--${comment.category}` */
    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        <div className="Highlight__parts">
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={handleStyle(rect, categoryLabels)}
              //style={rect}
              className={`Highlight__part`}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
