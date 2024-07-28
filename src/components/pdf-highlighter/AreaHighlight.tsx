import React, { Component } from "react";

import { Rnd } from "react-rnd";
import { getPageFromElement } from "../lib/pdfjs-dom";

import "../style/AreaHighlight.css";

import type { LTWHP, ViewportHighlight } from "../types.js";

interface Props {
  categoryLabels: Array<{ label: string; background: string }>;
  highlight: ViewportHighlight;
  onChange: (rect: LTWHP) => void;
  comment: {
    text: string;
  };
  authorId: string;
  isScrolledTo: boolean;
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
      ...otherProps
    } = this.props;

    const handleStyle = (labels: { label: string; background: string }[]) => {
      let color = "#ddcc77";

      if (isScrolledTo) {
        return { background: "" };
      }

      if (comment) {
        for (let item of labels) {
          if (authorId === item.label) {
            color = item.background;
          }
        }
      }

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
          onResizeStop={(_mouseEvent, _direction, ref, _delta, position) => {
            const boundingRect: LTWHP = {
              top: position.y,
              left: position.x,
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              pageNumber: getPageFromElement(ref)?.number || -1,
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
          }}
          {...otherProps}
          style={handleStyle(categoryLabels)}
        />
      </div>
    );
  }
}

export default AreaHighlight;
