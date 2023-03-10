import React from "react";
import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { useWiki } from "./WikiLayout";

type Props = {
  onDelete: (id: string) => void;
};

function Wiki({ onDelete }: Props): JSX.Element {
  const navigate = useNavigate();
  const wiki = useWiki();

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{wiki.title}</h1>
          {wiki.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {wiki.tags.map((tag) => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${wiki.id}/edit`}>
              <Button variant="primary">Editar</Button>
            </Link>
            <Button
              variant="outline-danger"
              onClick={() => {
                onDelete(wiki.id);
                navigate("/");
              }}
            >
              Excluir
            </Button>
            <Link to="/">
              <Button variant="outline-secondary">Voltar</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{wiki.markdown}</ReactMarkdown>
    </>
  );
}

export default Wiki;
