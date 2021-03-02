import React from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import AllCkEditor from "../App/components/AllCkEditor";
import Card from "../App/components/MainCard";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      id: props.expId,
      keyOrder: props.keyOrder,
    };
    console.log(this.state);
  }

  render() {
    let src = "";
    if (this.state.name === "Welcome") {
      src =
        "https://previews.123rf.com/images/foxysgraphic/foxysgraphic1802/foxysgraphic180200015/95357657-welcome-banner-speech-bubble-poster-and-sticker-concept-memphis-geometric-style-with-text-welcome-ic.jpg";
    } else if (this.state.name === "Explanation") {
      src =
        "data:image/png;base64,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";
    } else {
      src =
        "https://st2.depositphotos.com/1498528/5901/v/600/depositphotos_59016355-stock-illustration-explosion-bubble-thank-you.jpg";
    }
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }

    const html = `<h3>${this.state.name}! </h3>
        <figure class="image image-style-side">
            <img alt="Picture of the Warsaw Old Town." src=${src} />
            <figcaption>Medieval Old Town square, destroyed in 1944 & rebuilt after WWII.</figcaption>
        </figure>
        <p>If you enjoyed my previous articles in which we discussed wandering around <a href={DEMO.BLANK_LINK} target="_blank" rel="noopener">Copenhagen</a> and <a href={DEMO.BLANK_LINK} target="_blank" rel="noopener">Vilnius</a>, you’ll definitely love exploring <a href="https://en.wikipedia.org/wiki/Warsaw" target="_blank" rel="noopener">Warsaw</a>.</p>
        <h3>Time to put comfy sandals on!</h3>
        <p>Best time to visit the city is July and August, when it’s cool enough to not break a sweat and hot enough to enjoy summer. The city which has quite a combination of both old and modern textures is located by the river of Vistula.</p>`;

    return (
      <Aux>
        <div className={mainClass.join(" ")}>
          <div className="pcoded-main-container full-screenable-node">
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Card title="Edit Page" isOption>
                        <AllCkEditor
                          html={html}
                          editor="classic"
                          expId={this.state.id}
                          keyOrder={this.state.keyOrder}
                          name={this.state.name}
                        />
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    defaultPath: state.defaultPath,
    collapseMenu: state.collapseMenu,
    layout: state.layout,
    fullWidthLayout: state.fullWidthLayout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Input);
