import React, { useState, Dispatch, SetStateAction } from "react";
import "@/styles/Modal.css";

interface Props {
  categoryLabels: { label: string; background: string }[];
  setCategoryLabels: (update: { label: string; background: string }[]) => void;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

const CategoryEditor = ({
  categoryLabels,
  setCategoryLabels,
  show,
  setShow,
}: Props) => {
  const [labelInput, setLabelInput] = useState("");

  const [tempCategories, setTempCategories] =
    useState<{ label: string; background: string }[]>(categoryLabels);

  const deleteCategoryLabel = (event: React.MouseEvent) => {
    event.preventDefault();
    setTempCategories((previous) => [
      ...previous.filter((label) => label.label !== event.currentTarget.id),
    ]);
  };

  const handleAddLabel = (event: React.MouseEvent) => {
    if (categoryLabels.length < 5 && labelInput !== "") {
      setTempCategories((previous) => [
        ...previous,
        {
          label: labelInput,
          background: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      ]);
    }
    setLabelInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelInput(e.target.value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShow(false);
    setCategoryLabels(tempCategories);
    setLabelInput("");
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    setShow(false);
    setLabelInput("");
  };

  return (
    <div className={`modal ${!show ? "modal--hide" : ""}`}>
      <form className="modal__form">
        <div className="modal__content">
          <label>
            <div className="modal__header">
              <h3 className="modal__title">Edit Categories</h3>
            </div>
          </label>
          <div className="modal__body">
            <input
              className="modal__textarea"
              value={labelInput}
              type="text"
              onChange={handleChange}
            />
            <button type="button" onClick={handleAddLabel}>
              Add
            </button>
          </div>
          <ul>
            {tempCategories.map((label) => {
              return (
                <li key={label.label} style={{ display: "flex" }}>
                  {label.label}
                  <button id={label.label} onClick={deleteCategoryLabel}>
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="modal__footer">
            <button onClick={handleSubmit}>Save</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryEditor;
