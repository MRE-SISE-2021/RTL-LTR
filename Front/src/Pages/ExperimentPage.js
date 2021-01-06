import React, { Component, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import windowSize from "react-window-size";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import Card from "../App/components/MainCard";
import { MDBIcon } from "mdbreact";
import NavBar from "../Components/NavBarExp";
import ComponentsTable from "../Components/Tabels/ComponentsTable";
import QuestionsInput from "../Components/QuestionsInput";
// import NavBar from "./NavBar";
// import Configuration from "./Configuration";
// import Loader from "../Loader";
// import routes from "../../../routes";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";

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
    // const menu = routes.map((route, index) => {
    //   return route.component ? (
    //     <Route
    //       key={index}
    //       path={route.path}
    //       exact={route.exact}
    //       name={route.name}
    //       render={(props) => <route.component {...props} />}
    //     />
    //   ) : null;
    // });

    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }
    console.log(this.props.match);
    return (
      <Aux>
        <NavBar
          name={this.props.match.params.name}
          type={this.props.match.params.type}
          lang={this.props.match.params.language}
        />
        <ComponentsTable />
        {/* <QuestionsInput /> */}
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
