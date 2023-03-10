import React, { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";

import NewWiki from "./components/NewWiki";
import useLocalStorage from "./hooks/useLocalStorage";
import WikiList from "./components/WikiList";
import { WikiLayout } from "./components/WikiLayout";
import Wiki from "./components/Wiki";
import EditWiki from "./components/EditWiki";

export type Wiki = {
  id: string;
} & WikiData;

export type RawWiki = {
  id: string;
} & RawWikiData;

export type RawWikiData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type WikiData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [wikis, setWikis] = useLocalStorage<RawWiki[]>("WIKIS", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const wikisWithTags = useMemo(() => {
    return wikis.map((wiki) => {
      return {
        ...wiki,
        tags: tags.filter((tag) => wiki.tagIds.includes(tag.id)),
      };
    });
  }, [wikis, tags]);

  const onCreateNote = ({ tags, ...data }: WikiData) => {
    setWikis((prevWikis) => {
      return [
        ...prevWikis,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  };

  const onUpdateWiki = (id: string, { tags, ...data }: WikiData) => {
    setWikis((prevWikis) => {
      return prevWikis.map((wiki) => {
        if (wiki.id === id) {
          return { ...wiki, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return wiki;
        }
      });
    });
  };

  const onDeleteWiki = (id: string) => {
    setWikis((prevWikis) => {
      return prevWikis.filter((wiki) => wiki.id !== id);
    });
  };

  const addTag = (tag: Tag) => {
    setTags((prevTags) => [...prevTags, tag]);
  };

  const updateTag = (id: string, label: string) => {
    setTags((prevTags) => {
      return prevTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  };

  const deleteTag = (id: string) => {
    setTags((prevTags) => {
      return prevTags.filter((tag) => tag.id !== id);
    });
  };

  return (
    <BrowserRouter>
      <Container className="my-4">
        <Routes>
          <Route
            path="/"
            element={
              <WikiList
                availableTags={tags}
                wikis={wikisWithTags}
                onUpdateTag={updateTag}
                onDeleteTag={deleteTag}
              />
            }
          />
          <Route
            path="/new"
            element={
              <NewWiki
                onSubmit={onCreateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
          <Route path="/:id" element={<WikiLayout wikis={wikisWithTags} />}>
            <Route index element={<Wiki onDelete={onDeleteWiki} />} />
            <Route
              path="edit"
              element={
                <EditWiki
                  onSubmit={onUpdateWiki}
                  onAddTag={addTag}
                  availableTags={tags}
                />
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
