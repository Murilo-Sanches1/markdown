import React from "react";

import { WikiData, Tag } from "../App";
import NoteForm from "./WikiForm";

type Props = {
  onSubmit: (data: WikiData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

function NewWiki({ onSubmit, onAddTag, availableTags }: Props): JSX.Element {
  return (
    <>
      <h1 className="mb-4">Novo post</h1>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}

export default NewWiki;
