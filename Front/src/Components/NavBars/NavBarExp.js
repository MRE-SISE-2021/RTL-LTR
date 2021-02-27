import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Link, Redirect } from "react-router-dom";
import Modal from "../Modals/ModalSavedExperiment";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";

import Navbar from 'react-bootstrap/Navbar' 
import '../styles/homePageStyle.css'; 


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

    let mainHeaderClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainHeaderClass = [...mainHeaderClass, "container-fluid"];
    } else {
      mainHeaderClass = [...mainHeaderClass, "container"];
    }

    let navBar = (
      <Aux>
       <Navbar fixed="bottom" fixed="top" expand="lg" bg="info" variant="dark">
          

       

       
        <div className={mainHeaderClass.join(" ")}>
          {/* <div className="m-header"> */}
          {/* <a className="b-brand"> */}
          {/* <img id="main-logo" src={mainLogo} alt="" className="logo" /> */}
          <Link to="/home">
            <MDBIcon className="mr-5" icon="angle-double-left" />
          </Link>
          {/* </a> */}
          {/* </div> */}

          <div className="collapse navbar-collapse">
            <h5 className="mr-5">Experiment Name </h5>
            <Button className="btn-primary tn-edit btn btn-default mr-5" size="lg" variant="light">
              {this.props.name}
            </Button>
            <h5 className="mr-5"> Type </h5>

            <Button className="btn-primary tn-edit btn btn-default mr-5 " size="lg" variant="light">
              {this.props.type}
            </Button>

            <h5 className="mr-5"> Language </h5>

            <Button className="btn-primary tn-edit btn btn-default mr-5" size="lg" variant="light" >
              {this.props.lang}
            </Button>

            <div className="d-flex justify-content-lg-end">
              {/* props = name | lang | type */}
              <Modal className="mr-5" data={this.props} />

              <Button variant="outline-*" onClick={this.submitHandler}>
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
