import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Stack,
  Button,
  Form,
  Card,
  Badge,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";

import { Wiki, Tag } from "../App";

import styles from "./WikiList.module.css";

type SimplifiedWiki = {
  tags: Tag[];
  title: string;
  id: string;
};

type Props = {
  availableTags: Tag[];
  wikis: SimplifiedWiki[];
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

type EditTagsModalProps = {
  show: boolean;
  availableTags: Tag[];
  handleClose: () => void;
  onUpdateTag: (id: string, label: string) => void;
  onDeleteTag: (id: string) => void;
};

function WikiList({
  availableTags,
  wikis,
  onUpdateTag,
  onDeleteTag,
}: Props): JSX.Element {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState<string>("");
  const [editModal, setEditModal] = useState<boolean>(false);

  const filteredWikis = useMemo(() => {
    return wikis.filter((wiki) => {
      return (
        (title === "" ||
          wiki.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            wiki.tags.some((wikiTag) => wikiTag.id === tag.id)
          ))
      );
    });
  }, [title, selectedTags, wikis]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Wikis</h1>
          <Col xs="auto">
            <Stack gap={2} direction="horizontal">
              <Link to="/new">
                <Button variant="primary">Criar</Button>
              </Link>
              <Button
                variant="outline-secondary"
                onClick={() => setEditModal(true)}
              >
                Editar tags
              </Button>
            </Stack>
          </Col>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                isMulti
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredWikis.map((wiki) => (
          <Col key={wiki.id}>
            <WikiCard
              id={wiki.id}
              title={wiki.title}
              tags={wiki.tags}
            ></WikiCard>
          </Col>
        ))}
      </Row>
      <EditTagsModal
        show={editModal}
        handleClose={() => setEditModal(false)}
        availableTags={availableTags}
        onUpdateTag={onUpdateTag}
        onDeleteTag={onDeleteTag}
      ></EditTagsModal>
    </>
  );
}

const WikiCard = ({ id, title, tags }: SimplifiedWiki) => {
  return (
    <Card
      as={Link}
      to={`/${id}`}
      className={`h-100 text-reset text-decoration-none ${styles.card}`}
    >
      <Card.Body>
        <Stack
          gap={2}
          className="align-items-center justify-content-center h-100"
        >
          <span className="fs-5">{title}</span>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map((tag) => (
                <Badge key={tag.id} className="text-truncate">
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

const EditTagsModal = ({
  availableTags,
  handleClose,
  show,
  onUpdateTag,
  onDeleteTag,
}: EditTagsModalProps) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => onUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => onDeleteTag(tag.id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default WikiList;
