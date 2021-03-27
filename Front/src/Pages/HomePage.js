import React, { Component } from "react";
import { connect } from "react-redux";
import ExperimentsTable from "../Components/Tabels/ExperimentsTable";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";

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
          style={{ margin: "0", marginTop: "0" }}
          className={mainClass.join(" ")}
        >
          <ExperimentsTable />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
