import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Col,
  Form,
  Row,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
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
// import BootstrapSwitchButton from "bootstrap-switch-button-react";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toPreview: false,
      toHome: false,
      is_active: props.is_active,
      direction: props.dir,
    };
    this.submitPreview = this.submitPreview.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
    this.getLangName = this.getLangName.bind(this);
    this.onIsActiveChange = this.onIsActiveChange.bind(this);
    this.onDirectionChange = this.onDirectionChange.bind(this);
  }
  async componentWillReceiveProps(propsIncoming) {
    console.log(propsIncoming);
    await this.setState({
      is_active: propsIncoming.is_active,
      direction: propsIncoming.dir,
    });
  }
  onIsActiveChange(event) {
    console.log(event.target.value);
    console.log(event.target.checked);

    if (event.target.value == "Active") {
      this.setState({
        is_active: true,
      });
    } else {
      this.setState({
        is_active: false,
      });
    }
  }
  onDirectionChange(event) {
    event.preventDefault();
    console.log(event.target.value);
    this.setState({
      direction: event.target.value,
    });
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
  submitHandlerStatus(event) {
    //DELETE request -- delete task
    // const { cookies } = this.props;

    if (this.props.chosen.questionnaire_id === undefined) {
      return;
    }
    console.log(event.target.checked);
    let response = {
      questionnaire_id: this.props.chosen.questionnaire_id, //
      is_active: event.target.checked,
    };
    console.log(response);
    API.putRequest(
      "questionnaire-preview-data/" + this.props.chosen.questionnaire_id,
      response
    ).then((data) => {
      console.log(data);
    });
  }

  handleSwitchChange = (nr) => () => {
    let switchNumber = `switch${nr}`;
    this.setState({
      [switchNumber]: !this.state[switchNumber],
    });
  };

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
            <ul className="text-primary">
              <li className="mr-4">
                <MDBIcon icon="home" size="2x" className="indigo-text" />
              </li>
            </ul>
          </Link>

          <div
            className="nav navbar-nav navbar-center "
            className="navbar-collapse"
          >
            <span className="mr-2" style={{ color: "cornflowerblue" }}>
              Name:{" "}
            </span>

            <span className="mr-4" style={{ color: "black" }}>
              {this.props.name}
            </span>

            <span className="mr-2" style={{ color: "cornflowerblue" }}>
              Type:{" "}
            </span>
            <span className="mr-4" style={{ color: "black" }}>
              {this.props.type}
            </span>

            <span className="mr-2" style={{ color: "cornflowerblue" }}>
              Language:{" "}
            </span>
            <span className=" mr-4" style={{ color: "black" }}>
              {this.getLangName()}
            </span>

            <span className="mr-2" style={{ color: "cornflowerblue" }}>
              Alignment:{" "}
            </span>
            <Form.Group
              className=" mr-4"
              style={{
                flexFlow: "inherit",
                marginTop: "1%",
                marginRight: "2%",
              }}
              onChange={this.onDirectionChange}
            >
              <Form.Control
                as="select"
                value={this.state.direction}
                style={{
                  marginTop: "14%",
                }}
              >
                <option value="RTL">RTL</option>
                <option value="LTR">LTR</option>
                <option value="Cntr">Cntr</option>
                <option value="RND">RND</option>
              </Form.Control>
            </Form.Group>

            <span className="mr-2" style={{ color: "cornflowerblue" }}>
              Status:{" "}
            </span>
            <Form.Group
              className=" mr-4"
              style={{
                flexFlow: "inherit",
                marginTop: "1%",
                marginRight: "2%",
              }}
              onChange={this.onIsActiveChange}
            >
              {this.state.is_active ? (
                <Form.Control
                  as="select"
                  style={{
                    marginTop: "11%",
                  }}
                  value={this.state.is_active ? "Active" : "Not-Active"}
                >
                  <option value={"Active"}>Active</option>
                  <option value={"Not-Active"}>Not-Active</option>
                </Form.Control>
              ) : (
                <Form.Control
                  as="select"
                  value={this.state.is_active ? "Active" : "Not-Active"}
                  style={{
                    marginTop: "11%",
                  }}
                >
                  <option value={"Not-Active"}>Not-Active</option>
                  <option value={"Active"}>Active</option>
                </Form.Control>
              )}
            </Form.Group>
            {/* <h5 className="mr-5">Active</h5> */}
          </div>

          <div
            className="nav navbar-nav navbar-right"
            className="navbar-collapse2"
          >
            {this.props.prev ? null : (
              <div className="d-flex justify-content-lg-end">
                <Modal
                  data={this.props}
                  is_active={this.state.is_active}
                  direction={this.state.direction}
                />

                <Button
                  variant="outline-*"
                  //style={{ color: "white" }}
                  onClick={this.submitPreview}
                >
                  <MDBIcon className="pr-4 mb-2" far icon="eye" size="2x" />
                </Button>
                <Button variant="outline-*" disabled>
                  <MDBIcon className="pr-4 mb-2" icon="paperclip" size="2x" />
                </Button>
                <Button variant="outline-*" disabled>
                  <MDBIcon className="pr-4 mb-2" far icon="clone" size="2x" />
                </Button>
                <Button
                  variant="outline-*"
                  //style={{ color: "white" }}
                  onClick={this.submitDelete}
                >
                  <MDBIcon
                    className="pr-4 mb-2"
                    far
                    icon="trash-alt"
                    size="2x"
                  />
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
