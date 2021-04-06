import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { MDBChip, MDBContainer } from "mdbreact";

import { Link, Redirect } from "react-router-dom";
import Modal from "../Modals/ModalSavedExperiment";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
//import Navbar from "react-bootstrap/Navbar";
// import "../../styles/homePageStyle.css";
import API from "../../Api/Api";
import { withCookies } from "react-cookie";

import { Navbar } from "react-bootstrap";
import "../../styles/homePageStyle.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toPreview: false,
      toHome: false,
      is_active: props.is_active,
    };
    this.submitPreview = this.submitPreview.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
    this.getLangName = this.getLangName.bind(this);
    this.onIsActiveChange = this.onIsActiveChange.bind(this);
  }
  async componentWillReceiveProps(propsIncoming) {
    console.log(propsIncoming);
    await this.setState({
      is_active: propsIncoming.is_active,
    });
  }
  onIsActiveChange(event) {
    console.log(event.target.value);
    if (event.target.value === "false") {
      this.setState({
        is_active: false,
      });
    } else {
      this.setState({
        is_active: true,
      });
    }
  }
  getLangName() {
    switch (this.props.lang) {
      case "1":
        return "Arabic";
      case "2":
        return "English";
      case "3":
        return "Hebrew";
      case "4":
        return "Russian";
      default:
        return "2";
    }
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
    console.log(this.state);
    if (this.state.toPreview === true) {
      return (
        <Redirect to={"/preview/" + this.props.expId + "/" + this.props.lang} />
      );
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
        <Navbar fixed="top" bg="Light" variant="dark" style={{ height: "10%" }}>
          <Link to="/home">
            <MDBIcon icon="home" size="2x" className="text-primary mr-5" />
          </Link>

          <div className="collapse navbar-collapse">
            <h5 className="mr-2" style={{ color: "cornflowerblue" }}>
              ExpName:{" "}
            </h5>

            <h5 className="mr-5">{this.props.name}</h5>

            <h5 className="mr-2" style={{ color: "cornflowerblue" }}>
              Type:{" "}
            </h5>
            <h5 className="mr-5">{this.props.type}</h5>

            <h5 className="mr-2" style={{ color: "cornflowerblue" }}>
              Language:{" "}
            </h5>
            <h5 className=" mr-5">{this.getLangName()}</h5>

            <h5 className="mr-2" style={{ color: "cornflowerblue" }}>
              Direction:{" "}
            </h5>
            <Form.Group
              style={{
                flexFlow: "inherit",
                marginTop: "1%",
                marginRight: "2%",
              }}
            >
              <Form.Control as="select">
                <option>{this.props.dir}</option>
              </Form.Control>
            </Form.Group>

            <h5 className="mr-2" style={{ color: "cornflowerblue" }}>
              Status:{" "}
            </h5>
            <Form.Group
              style={{
                flexFlow: "inherit",
                marginTop: "1%",
                marginRight: "2%",
              }}
            >
              <Form.Control as="select" onChange={this.onIsActiveChange}>
                <option value={this.state.is_active}>
                  {this.state.is_active ? "Active" : "Not-Active"}
                </option>
                <option value={!this.state.is_active}>
                  {!this.state.is_active ? "Active" : "Not-Active"}
                </option>
              </Form.Control>
            </Form.Group>
            {/* <h5 className="mr-5">Active</h5> */}
            {this.props.prev ? null : (
              <div className="d-flex justify-content-lg-end">
                <Modal
                  className="mr-4"
                  data={this.props}
                  is_active={this.state.is_active}
                />

                <Button
                  variant="outline-*"
                  //style={{ color: "white" }}
                  onClick={this.submitPreview}
                >
                  <MDBIcon className="mr-3" far icon="eye" size="2x" />
                </Button>
                <Button variant="outline-*" disabled>
                  <MDBIcon className="mr-3" icon="paperclip" size="2x" />
                </Button>
                <Button variant="outline-*" disabled>
                  <MDBIcon className="mr-3" far icon="clone" size="2x" />
                </Button>
                <Button
                  variant="outline-*"
                  //style={{ color: "white" }}
                  onClick={this.submitDelete}
                >
                  <MDBIcon className="mr-3" far icon="trash-alt" size="2x" />
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
