import React, { Component } from "react";
import { connect } from "react-redux";
import ExperimentsTable from "../Components/Tabels/ExperimentsTable";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";

import QuestionnaireInfo from "../Components/ExperimentInfo";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: {},
    };
  }

  UNSAFE_componentWillMount() {
    if (
      this.props.windowWidth > 992 &&
      this.props.windowWidth <= 1024 &&
      this.props.layout !== "horizontal"
    ) {
      this.props.onComponentWillMount();
    }
  }

  mobileOutClickHandler() {
    if (this.props.windowWidth < 992 && this.props.collapseMenu) {
      this.props.onComponentWillMount();
    }
  }

  render() {
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }
    return (
      <Aux>
        <div
          style={{ margin: "0", marginTop: "0px" }}
          className={mainClass.join(" ")}
        >
          <ExperimentsTable />
        </div>
      </Aux>
    );
  }
}
/*
  <div style={{marginRight : "150px" , marginTop: "2.5%"}} className={mainClass.join(" ")}>
          <QuestionnaireInfo chosen={this.state.chosen}  />
        </div>


*/
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
