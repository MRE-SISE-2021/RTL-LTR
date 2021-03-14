import React from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import AllCkEditor from "../../App/components/AllCkEditor";
import Card from "../../App/components/MainCard";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.expId,
      keyOrder: props.keyOrder,
      label: props.label,
      taskId: props.taskId,
      compTypeId: props.compTypeId,
    };
    console.log(this.state);
  }

  render() {
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }

    const html = `<h3>New Page! </h3>
        <figure class="image image-style-side">
           
            <figcaption>Medieval Old Town square, destroyed in 1944 & rebuilt after WWII.</figcaption>
        </figure>
        <p>If you enjoyed my previous articles in which we discussed wandering around <a href={DEMO.BLANK_LINK} target="_blank" rel="noopener">Copenhagen</a> and <a href={DEMO.BLANK_LINK} target="_blank" rel="noopener">Vilnius</a>, you’ll definitely love exploring <a href="https://en.wikipedia.org/wiki/Warsaw" target="_blank" rel="noopener">Warsaw</a>.</p>
        <h3>Time to put comfy sandals on!</h3>
        <p>Best time to visit the city is July and August, when it’s cool enough to not break a sweat and hot enough to enjoy summer. The city which has quite a combination of both old and modern textures is located by the river of Vistula.</p>`;

    return (
      <Aux>
  

      
      
                      <Card title="Edit Page" isOption>
                        {this.state.label === undefined ? (
                          <AllCkEditor
                            html={html}
                            editor="classic"
                            expId={this.state.id}
                            keyOrder={this.state.keyOrder}
                            compTypeId={this.state.compTypeId}
                          />
                        ) : (
                          <AllCkEditor
                            html={this.state.label}
                            editor="classic"
                            expId={this.state.id}
                            keyOrder={this.state.keyOrder}
                            compTypeId={this.state.compTypeId}
                            taskId={this.state.taskId}
                          />
                        )}
                      </Card>
                   

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
