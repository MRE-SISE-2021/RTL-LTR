import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Col } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Link } from "react-router-dom";
import Modal from "./Modals/ModalSavedExperiment";
import Aux from "../hoc/_Aux";
import DEMO from "../store/constant";
import * as actionTypes from "../store/actions";

class NavBar extends Component {
  render() {
    let headerClass = [
      "navbar",
      "pcoded-header",
      "navbar-expand-lg",
      this.props.headerBackColor,
    ];
    if (this.props.headerFixedLayout) {
      headerClass = [...headerClass, "headerpos-fixed"];
    }

    let mainHeaderClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainHeaderClass = [...mainHeaderClass, "container-fluid"];
    } else {
      mainHeaderClass = [...mainHeaderClass, "container"];
    }

    let navBar = (
      <Aux>
        <div className={mainHeaderClass.join(" ")}>
          <div className="m-header">
            <a className="b-brand">
              {/* <img id="main-logo" src={mainLogo} alt="" className="logo" /> */}
              <Link to="/home">
                <MDBIcon icon="angle-double-left" />
              </Link>
            </a>
          </div>
          <a className="mobile-menu" id="mobile-header" href={DEMO.BLANK_LINK}>
            <i className="feather icon-more-horizontal" />
          </a>
          <div className="collapse navbar-collapse">
            <Col lg={2}>
              <h5>Experiment Name </h5>
            </Col>
            <Col lg={2}>
              <Button className="btn-square" variant="light">
                {this.props.name}
              </Button>
            </Col>
            <Col lg={1}>
              <h5> Type </h5>
            </Col>
            <Col lg={2}>
              <Button className="btn-square" variant="light">
                {this.props.type}
              </Button>
            </Col>
            <Col lg={1}>
              <h5> Language </h5>
            </Col>
            <Col>
              <Button className="btn-square" variant="light">
                {this.props.lang}
              </Button>
            </Col>
            <Col>
              <Modal data={this.props} />
            </Col>
            <Col>
              <MDBIcon far icon="eye" />
            </Col>
            <Col>
              <MDBIcon icon="paperclip" />
            </Col>

            <Col>
              <MDBIcon far icon="clone" />
            </Col>
            <Col>
              <MDBIcon far icon="trash-alt" />
            </Col>
          </div>
        </div>
      </Aux>
    );

    return (
      <Aux>
        <header className={headerClass.join(" ")}>{navBar}</header>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rtlLayout: state.rtlLayout,
    headerBackColor: state.headerBackColor,
    headerFixedLayout: state.headerFixedLayout,
    collapseMenu: state.collapseMenu,
    layout: state.layout,
    fullWidthLayout: state.fullWidthLayout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
