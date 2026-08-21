import React, { useState } from "react";
import { profile } from "../../data/content";
import MiiAvatar from "./MiiAvatar";

const GREETINGS = ["Hi there! 👋", "Akwaaba! 🇬🇭", "Welcome in.", "Thanks for stopping by!"];

function Hero() {
  const [greetIndex, setGreetIndex] = useState(0);
  const [poked, setPoked] = useState(false);

  const poke = () => {
    setPoked(true);
    setGreetIndex((i) => (i + 1) % GREETINGS.length);
    window.setTimeout(() => setPoked(false), 900);
  };

  return (
    <section className="hero" id="top">
      <div className="shell hero__inner">
        <div className="hero__copy">
          <span className="badge">
            <span className="dot" />
            {profile.status}
          </span>

          <h1 className="hero__title">Hi, I'm {profile.first}.</h1>

          <p className="hero__lede">
            {profile.tagline.map((line) => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>

          <p className="hero__currently mono">
            <span className="hero__currently-key">currently</span>
            <span className="hero__arrow">&#8594;</span>
            {profile.currently}
          </p>

          <div className="hero__actions">
            <a href="#projects" className="btn btn-primary">
              See what I've built <span aria-hidden="true">&#8595;</span>
            </a>
            <a href="#contact" className="btn btn-ghost">
              Say hi
            </a>
          </div>
        </div>

        <div className="hero__avatar">
          <span className="hero__bubble mono" key={greetIndex}>
            {GREETINGS[greetIndex]}
          </span>

          <button
            type="button"
            className={`hero__avatar-btn ${poked ? "is-poked" : ""}`}
            onClick={poke}
            aria-label="Wave back at Patrick"
          >
            <MiiAvatar variant="wave" alt="Avatar of Patrick waving hello" />
          </button>

          <span className="hero__poke mono">psst, tap me 👋</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
