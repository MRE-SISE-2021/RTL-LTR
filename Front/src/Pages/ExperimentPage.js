import React, { Component } from "react";
import { connect } from "react-redux";
import ComponentsTable from "../Components/Tabels/ComponentsTable";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import 'bootstrap/dist/css/bootstrap.min.css';
class ExperimentPage extends Component {
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
    console.log(this.props.match);
    return (
      <Aux>
        {/* <NavBar /> */}

        <ComponentsTable
          name={this.props.match.params.name}
          type={this.props.match.params.type}
          lang={this.props.match.params.language}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentPage);
