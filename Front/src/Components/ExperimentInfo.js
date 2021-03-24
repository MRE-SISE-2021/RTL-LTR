import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import API from "../Api/Api";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import { withCookies } from "react-cookie";

import "../styles/homePageStyle.css";

class ExperimentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
      reload: false,
      edit: false,
    };
    this.submitHandlerPreview = this.submitHandlerPreview.bind(this);
    this.submitHandlerDelete = this.submitHandlerDelete.bind(this);
    this.submitHandlerEdit = this.submitHandlerEdit.bind(this);
  }

  submitHandlerPreview(event) {
    event.preventDefault();
    if (this.props.chosen.questionnaire_id === undefined) {
      return;
    }
    this.setState(() => ({
      toDashboard: true,
    }));
  }

  submitHandlerEdit(event) {
    event.preventDefault();
    if (this.props.chosen.questionnaire_id === undefined) {
      return;
    }
    this.setState(() => ({
      edit: true,
    }));
  }
  submitHandlerDelete(event) {
    //DELETE request -- delete task
    const { cookies } = this.props;

    if (this.props.chosen.questionnaire_id === undefined) {
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
          questionnaire_id: this.props.chosen.questionnaire_id, //
        };

        API.deleteRequest(
          "questionnaire-preview-data/" + this.props.chosen.questionnaire_id,
          response
        ).then((data) => {
          console.log(data); // JSON data parsed by `data.json()` call
        });
        return MySwal.fire("", "Your file has been deleted!", "success");
      } else {
        return MySwal.fire("", "Your file is safe!", "error");
      }
    });
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
    const data = this.props.chosen;
    console.log(data);
    if (this.state.toDashboard === true) {
      return <Redirect to={"/preview/" + data.questionnaire_id} />;
    }

    if (this.state.edit === true) {
      return (
        <Redirect
          to={{
            pathname:
              "/create/" +
              data.questionnaire_name +
              "/exp/" +
              data.language_id +
              "/" +
              data.direction +
              "/" +
              data.questionnaire_id,
            state: { tasks: data.tasks },
          }}
        />
      );
    }

    // console.log(data);
    return (
      <Aux>
        <nav
          className="bg-info text-white"
          style={{ height: "30%", marginTop: "13%", marginLeft: "25%" }}
        >
          <Aux>
            <Card>
              <Card.Header>
                <Card.Title>
                  <b className="text-info">{data.questionnaire_name}</b>
                  <div className="d-flex justify-content-lg-end">
                    <Button variant="outline-*" disabled>
                      <MDBIcon className="mr-5" icon="upload" />
                    </Button>
                    <Button
                      variant="outline-*"
                      onClick={this.submitHandlerPreview}
                    >
                      <MDBIcon className="mr-5" icon="eye" />
                    </Button>

                    <Button variant="outline-*" disabled>
                      <MDBIcon className="mr-5" icon="clone" />
                    </Button>
                    <Button
                      variant="outline-*"
                      onClick={this.submitHandlerEdit}
                    >
                      <MDBIcon className="mr-5" icon="edit" />
                    </Button>
                    <Button
                      variant="outline-*"
                      onClick={this.submitHandlerDelete}
                    >
                      <MDBIcon className="mr-5" icon="trash-alt" />
                    </Button>
                  </div>
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div style={{ height: "450px" }} className="bg-info text-white">
                  <ul className="p-3 mb-2 text-white">
                    <Row>
                      <Col>
                        <b>Created: </b> {data.creation_date}
                      </Col>
                      <Col>
                        <b>Language: </b>
                        {
                          {
                            1: "Arabic",
                            2: "English",
                            3: "Hebrew",
                            4: "Russian",
                          }[data.language_id]
                        }
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <b>Hosted Link: </b>
                        {data.hosted_link}
                      </Col>
                      <Col>
                        <b>Status: </b>
                        {data.is_active !== undefined
                          ? [data.is_active ? "True" : "False"]
                          : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <b>Mesaures: </b>
                      </Col>
                    </Row>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Aux>
        </nav>
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

export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(ExperimentInfo)
);
