import React, { Component } from "react";

import { Rnd } from "react-rnd";
//import { getPageFromElement } from "../../../react-pdf-highlighter-with-categories/src/lib/pdfjs-dom";

// import "../../../react-pdf-highlighter-with-categories/style/AreaHighlight.css"

import type { LTWHP, ViewportHighlight } from "@argument-studio/react-pdf-highlighter-with-categories/dist/esm/types";

interface Props {
  categoryLabels: Array<{ label: string; background: string }>;
  highlight: ViewportHighlight;
  onChange: (rect: LTWHP) => void;
  comment: {
    text: string;
  };
  authorId: string;
  isScrolledTo: boolean;
  onClick: () => void;
}

export class AreaHighlight extends Component<Props> {
  render() {
    const {
      highlight,
      onChange,
      comment,
      authorId,
      isScrolledTo,
      categoryLabels,
      onClick,
      ...otherProps
    } = this.props;

    const handleStyle = (labels: { label: string; background: string }[]) => {
      console.log
      let color = "#ddcc77";

      if (isScrolledTo) {
        return { background: "" };
      }

      console.log(labels)
      if (comment) {
        for (let item of labels) {
          console.log("item", item)
          if (authorId === item.label) {
            console.log(item.label)
            color = item.background;
          }
        }
      }

      console.log("color", color)
      return { background: color };
    };

    /*   : comment && comment.category
    ? `AreaHighlight--${comment.category}`
 */
    return (
      <div
        className={`AreaHighlight ${
          isScrolledTo ? "AreaHighlight--scrolledTo" : ""
        }`}
      >
        <Rnd
          className="AreaHighlight__part"
          onDragStop={(_, data) => {
            const boundingRect: LTWHP = {
              ...highlight.position.boundingRect,
              top: data.y,
              left: data.x,
            };

            onChange(boundingRect);
          }}
          position={{
            x: highlight.position.boundingRect.left,
            y: highlight.position.boundingRect.top,
          }}
          size={{
            width: highlight.position.boundingRect.width,
            height: highlight.position.boundingRect.height,
          }}
          onClick={(event: Event) => {
            event.stopPropagation();
            event.preventDefault();
            onClick()
          }}
          {...otherProps}
          style={handleStyle(categoryLabels)}
          disableDragging
        />
      </div>
    );
  }
}

export default AreaHighlight;
