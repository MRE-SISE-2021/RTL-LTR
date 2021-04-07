import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionTypes from "../store/actions";

class NotActivePage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <h3>Experiment Not Active! Thanks for your interest :)</h3>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(NotActivePage);
