import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";

function Github() {
  return (
    <Row
      style={{
        justifyContent: "center",
        paddingBottom: "10px",
        color: "white",
      }}
    >
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        My GitHub <strong className="purple">Contribution</strong> Calendar
      </h1>
      <GitHubCalendar
        username="pat-selby"
        blockSize={15}
        blockMargin={5}
        color="#10b981"
        fontSize={16}
      />
      <h1 className="project-heading" style={{ paddingBottom: "20px", paddingTop: "50px" }}>
        GitHub <strong className="purple">Stats</strong> & Languages
      </h1>
      <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
        <img
          src="https://github-readme-stats.vercel.app/api?username=pat-selby&show_icons=true&theme=bg_dot&font_color=ffffff&title_color=10b981&icon_color=10b981&bg_color=0f172a&hide_border=true"
          alt="pat-selby github stats"
          style={{ width: "100%", maxWidth: "500px", padding: "10px" }}
        />
        <img
          src="https://github-readme-stats.vercel.app/api/top-langs/?username=pat-selby&layout=compact&theme=bg_dot&font_color=ffffff&title_color=10b981&icon_color=10b981&bg_color=0f172a&hide_border=true"
          alt="pat-selby top languages"
          style={{ width: "100%", maxWidth: "400px", padding: "10px" }}
        />
      </Row>
    </Row>
  );
}

export default Github;
