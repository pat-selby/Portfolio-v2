import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            <span className="hover-glow">Hi everyone, I am </span><span className="purple hover-glow">Patrick Ennin Selby </span>
            <span className="hover-glow">from </span><span className="purple hover-glow"> Grambling State University</span>.
            <br />
            <span className="hover-glow">I am a Sophomore </span><span className="purple hover-glow">Cybersecurity Student</span><span className="hover-glow"> with a minor in Computer Information Systems.</span>
            <br />
            <span className="hover-glow">I am currently looking for </span><span className="purple hover-glow">Internships and Mentorship</span><span className="hover-glow"> opportunities.</span>
            <br />
            <br />
            <strong className="purple hover-glow">Education: </strong> <span className="hover-reveal"> B.S. Cybersecurity (Minor: Computer Information Systems (CIS) | GPA: 3.9/4.0) at </span><span className="purple hover-glow">Grambling State University</span>.
            <br />
            <br />
            <strong className="purple hover-glow">Relevant Coursework: </strong> <span className="hover-reveal"> Attacks, Threats, and Vulnerabilities (CompTIA Security+ SY0-701 aligned), Discrete Structures, Data Structures & Algorithms, Probability & Statistics I, Calculus I.</span>
            <br />
            <br />
            <strong className="purple hover-glow">Affiliations: </strong> <span className="hover-reveal"> ColorStack, NSBE, IEEE, Honor Society®, S.E.C.U.R.E. Cybersecurity Club (GSU), The Lantern Network (Career & Mentorship), National Society of Leadership and Success (NSLS), National Association of Black Accountants (NABA).</span>
            <br />
            <br />
            <strong className="purple hover-glow">Certifications: </strong>
            <br />
            <ul>
              <li className="hover-glow"><a href="https://www.credly.com/badges/cf7adf90-a999-404f-9006-d724ab1f9bff/public_url" target="_blank" rel="noreferrer">AWS Academy Cloud Foundations (Apr 2025)</a></li>
              <li className="hover-glow"><a href="https://www.coursera.org/account/accomplishments/verify/21LM0CGZI05F" target="_blank" rel="noreferrer">Google Cybersecurity (Foundations, Play It Safe) – 2025</a></li>
              <li className="hover-glow"><a href="https://www.credly.com/badges/c5383299-b317-47d8-83b2-f6efddbf0c77/public_url" target="_blank" rel="noreferrer">IBM (AI, Data, Cybersecurity) – 2025</a></li>
            </ul>
            <br />
            <span className="hover-reveal">Apart from my studies, I enjoy:</span>
          </p>

          <ul>
            <li className="about-activity hover-glow">
              <ImPointRight /> Playing CTFs (Capture The Flag)
            </li>
            <li className="about-activity hover-glow">
              <ImPointRight /> Exploring Cloud Architectures
            </li>
            <li className="about-activity hover-glow">
              <ImPointRight /> Learning New Technologies
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            <span className="hover-reveal">"In a world of evolving threats, I choose to be the variable that hackers never accounted for."</span>{" "}
          </p>
          <footer className="blockquote-footer hover-glow">Patrick</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
