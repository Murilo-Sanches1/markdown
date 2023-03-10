import React from "react";

import { WikiData, Tag } from "../App";
import WikiForm from "./WikiForm";
import { useWiki } from "./WikiLayout";

type Props = {
  onSubmit: (id: string, data: WikiData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

function EditWiki({ onSubmit, onAddTag, availableTags }: Props): JSX.Element {
  const wiki = useWiki();

  return (
    <>
      <h1 className="mb-4">Editar</h1>
      <WikiForm
        title={wiki.title}
        markdown={wiki.markdown}
        onSubmit={(data) => onSubmit(wiki.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
      />
    </>
  );
}

export default EditWiki;
