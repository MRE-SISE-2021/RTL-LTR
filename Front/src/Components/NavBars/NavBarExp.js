import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Link, Redirect } from "react-router-dom";
import Modal from "../Modals/ModalSavedExperiment";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
//import Navbar from "react-bootstrap/Navbar";
import "../../styles/homePageStyle.css";
import API from "../../Api/Api";
import { withCookies } from "react-cookie";

import { Navbar } from "react-bootstrap";
import "../../styles/homePageStyle.css";

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      toPreview: false,
      toHome: false,
    };
    this.submitPreview = this.submitPreview.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
  }

  submitPreview(event) {
    event.preventDefault();
    this.setState(() => ({
      toPreview: true,
    }));
  }

  submitDelete(event) {
    event.preventDefault();
    const { cookies } = this.props;

    if (this.props.expId === undefined) {
      return;
    }
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      type: "warning",
      showCloseButton: true,
      showCancelButton: true,
    }).then((willDelete) => {
      if (willDelete.value) {
        const response = {
          questionnaire_id: this.props.expId, //
        };

        API.deleteRequest(
          "questionnaire-preview-data/" + this.props.expId,
          response
        ).then((data) => {
          console.log(data); // JSON data parsed by `data.json()` call
        });
        this.setState(() => ({
          toHome: true,
        }));
        return MySwal.fire("", "Your file has been deleted!", "success");
      } else {
        return MySwal.fire("", "Your file is safe!", "error");
      }
    });
  }
  render() {
    // console.log(this.props);
    if (this.state.toPreview === true) {
      return <Redirect to={"/preview/" + this.props.expId} />;
    }

    if (this.state.toHome === true) {
      return <Redirect to={"/home/"} />;
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
        <Navbar fixed="top" bg="info" variant="dark" style={{ height: "10%" }}>
          <Link to="/home">
            <ul className="mb-1 bg-info text-white">
              <li>
                <MDBIcon icon="home" size="3x" className="indigo-text pr-5" />{" "}
              </li>
            </ul>
          </Link>

          <div className="collapse navbar-collapse">
            <h5 className="mr-4">ExpName: </h5>
            <Button
              className="btn-primary tn-edit btn btn-default mr-5"
              // size="lg"
              variant="light"
            >
              {this.props.name}
            </Button>
            <h5 className="mr-4"> Type </h5>

            <Button
              className="btn-primary tn-edit btn btn-default mr-5 "
              // size="lg"
              variant="light"
            >
              {this.props.type}
            </Button>

            <h5 className="mr-4"> Language </h5>

            <Button
              className="btn-primary tn-edit btn btn-default mr-5"
              // size="lg"
              variant="light"
            >
              {this.props.lang}
            </Button>
            <h5 className="mr-4"> Direction </h5>

            <Button
              className="btn-primary tn-edit btn btn-default mr-5"
              // size="lg"
              variant="light"
            >
              {this.props.dir}
            </Button>
            {this.props.prev ? null : (
              <div className="d-flex justify-content-lg-end">
                <Modal className="mr-4" data={this.props} />

                <Button
                  variant="outline-*"
                  style={{ color: "white" }}
                  onClick={this.submitPreview}
                >
                  <MDBIcon className="mr-5" far icon="eye" size="2x" />
                </Button>
                <Button variant="outline-*" disabled>
                  <MDBIcon className="mr-5" icon="paperclip" size="2x" />
                </Button>
                <Button variant="outline-*" disabled>
                  <MDBIcon className="mr-5" far icon="clone" size="2x" />
                </Button>
                <Button
                  variant="outline-*"
                  style={{ color: "white" }}
                  onClick={this.submitDelete}
                >
                  <MDBIcon className="mr-5" far icon="trash-alt" size="2x" />
                </Button>
              </div>
            )}
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

export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(NavBar)
);
