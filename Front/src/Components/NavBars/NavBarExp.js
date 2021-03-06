import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Link, Redirect } from "react-router-dom";
import Modal from "../Modals/ModalSavedExperiment";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";

import Navbar from "react-bootstrap/Navbar";
import "../../styles/homePageStyle.css";

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      toDashboard: false,
    };
    this.submitHandler = this.submitHandler.bind(this);
  }

  submitHandler(event) {
    event.preventDefault();
    this.setState(() => ({
      toDashboard: true,
    }));
  }
  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to={"/preview"} />;
    }

    let headerClass = [
      "navbar",
      "pcoded-header",
      "navbar-expand-lg",
      this.props.headerBackColor,
    ];
    if (this.props.headerFixedLayout) {
      headerClass = [...headerClass, "headerpos-fixed"];
    }

    let navBar = (
      <Aux>
        <Navbar fixed="top" bg="info" variant="dark">
          <Link to="/home">
            <MDBIcon className="mr-5" icon="home" />
          </Link>

          <div className="collapse navbar-collapse">
            <h5 className="mr-4">ExpName: </h5>
            <Button
              className="btn-primary tn-edit btn btn-default mr-5"
              size="lg"
              variant="light"
            >
              {this.props.name}
            </Button>
            <h5 className="mr-4"> Type </h5>

            <Button
              className="btn-primary tn-edit btn btn-default mr-5 "
              size="lg"
              variant="light"
            >
              {this.props.type}
            </Button>

            <h5 className="mr-4"> Language </h5>

            <Button
              className="btn-primary tn-edit btn btn-default mr-5"
              size="lg"
              variant="light"
            >
              {this.props.lang}
            </Button>

            <div className="d-flex justify-content-lg-end">
              <Modal className="mr-4" data={this.props} />

              <Button variant="outline-*" disabled onClick={this.submitHandler}>
                <MDBIcon className="mr-5" far icon="eye" />
              </Button>
              <Button variant="outline-*" disabled>
                <MDBIcon className="mr-5" icon="paperclip" />
              </Button>
              <Button variant="outline-*" disabled>
                <MDBIcon className="mr-5" far icon="clone" />
              </Button>
              <Button variant="outline-*" disabled>
                <MDBIcon className="mr-5" far icon="trash-alt" />
              </Button>
            </div>
          </div>
        </Navbar>
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
