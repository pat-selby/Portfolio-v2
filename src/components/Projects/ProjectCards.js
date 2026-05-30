import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function ProjectCards(props) {
  const navigate = useNavigate();

  // Determine if demoLink is internal (starts with /)
  const isInternalDemo = props.demoLink && props.demoLink.startsWith("/");

  return (
    <Card className="project-card-view">
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      <Card.Body>
        <Card.Title className="hover-glow">{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }} className="hover-reveal">
          {props.description}
        </Card.Text>
        <Button variant="primary" href={props.ghLink} target="_blank" rel="noopener noreferrer">
          <BsGithub /> &nbsp;
          {props.isBlog ? "Blog" : "GitHub"}
        </Button>

        {!props.isBlog && props.demoLink && (
          isInternalDemo ? (
            <Button
              variant="primary"
              style={{ marginLeft: "10px" }}
              onClick={() => navigate(props.demoLink)}
            >
              <CgWebsite /> &nbsp;Demo
            </Button>
          ) : (
            <Button
              variant="primary"
              href={props.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "10px" }}
            >
              <CgWebsite /> &nbsp;Demo
            </Button>
          )
        )}
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
