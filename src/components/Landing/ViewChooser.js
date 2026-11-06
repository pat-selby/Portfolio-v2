import React from "react";
import { views } from "../../data/content";
import Avatar from "./Avatar";
import useView, { VIEW_KEYS } from "./useView";

/** First screen: the visitor picks which side of Patrick they want to meet. */
function ViewChooser() {
  const { setView } = useView();

  const choose = (k) => {
    setView(k);
    window.scrollTo(0, 0);
  };

  return (
    <section className="chooser">
      <div className="shell chooser__inner">
        <Avatar variant="wave" alt="Avatar of Patrick waving hello" className="chooser__avatar" />
        <p className="section-label mono">## hi, I'm Patrick</p>
        <h1 className="chooser__title">Who do you want to know me as?</h1>

        <div className="chooser__options">
          {VIEW_KEYS.map((k) => (
            <button key={k} type="button" className="chooser__card" onClick={() => choose(k)}>
              <span className="chooser__name">{views[k].label}</span>
              <span className="chooser__blurb">{views[k].blurb}</span>
              <span className="chooser__go mono" aria-hidden="true">
                &#8594;
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ViewChooser;
