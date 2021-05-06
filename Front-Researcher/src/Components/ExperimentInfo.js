import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import API from "../Api/Api";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import { withCookies } from "react-cookie";
import copy from "copy-text-to-clipboard";

import "../styles/homePageStyle.css";

class ExperimentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
      reload: false,
      edit: false,
      demographic: {},
    };
    this.submitHandlerPreview = this.submitHandlerPreview.bind(this);
    this.submitHandlerDelete = this.submitHandlerDelete.bind(this);
    this.submitHandlerEdit = this.submitHandlerEdit.bind(this);
    this.submitHandlerStatus = this.submitHandlerStatus.bind(this);
    this.onIsActiveChange2 = this.onIsActiveChange2.bind(this);

  }

  onIsActiveChange2(event) {
    console.log(event.target.value);
    console.log(event.target.checked);
    this.setState({
      is_active: event.target.checked,
    });   
  }

  componentWillReceiveProps(propsIncoming) {
    //Edit EXP
    console.log(propsIncoming.chosen);
    let propsIn = propsIncoming.chosen;
    if (propsIn.is_age_demo !== undefined) {
      this.setState({
        demographic: {
          is_age_demo: propsIn.is_age_demo,
          is_native_demo: propsIn.is_native_demo,
          is_other_demo: propsIn.is_other_demo,
          is_knowledge_demo: propsIn.is_knowledge_demo,
          is_daily_demo: propsIn.is_daily_demo,
          is_writing_demo: propsIn.is_writing_demo,
          is_mobile_demo: propsIn.is_mobile_demo,
          is_mouse_demo: propsIn.is_mouse_demo,
          is_design_demo: propsIn.is_design_demo,
          is_hci_demo: propsIn.is_hci_demo,
          is_develop_demo: propsIn.is_develop_demo,
        },
      });
    }
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
          window.location.reload(false);
          console.log(data); // JSON data parsed by `data.json()` call
        });
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
    window.location.reload(false);

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
      return (
        <Redirect
          to={"/preview/" + data.questionnaire_id + "/" + data.language_id}
        />
      );
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
            state: {
              tasks: data.tasks,
              demographic: this.state.demographic,
              is_active: data.is_active,
            },
          }}
        />
      );
    }

    // console.log(data);
    return (
      <Aux>
        <Row>
          <Col>
            <h5>Experiment Details: {data.questionnaire_name}</h5>
          </Col>

          <Col className="d-flex justify-content-lg-end" sm={4}>
            <Button size="sm" variant="outline-*" disabled>
              <MDBIcon icon="upload" />
            </Button>
            <Button
              size="sm"
              variant="outline-*"
              onClick={this.submitHandlerPreview}
            >
              <MDBIcon icon="eye" />
            </Button>

            <Button size="sm" variant="outline-*" disabled>
              <MDBIcon icon="clone" />
            </Button>
            <Button
              size="sm"
              variant="outline-*"
              onClick={this.submitHandlerEdit}
            >
              <MDBIcon icon="edit" />
            </Button>
            <Button
              size="sm"
              variant="outline-*"
              onClick={this.submitHandlerDelete}
              
            >
              <MDBIcon icon="trash-alt" />
            </Button>
          </Col>
        </Row>

        <div className="mt-3">
          <Card className="bg-Light ">
            <Card.Body>
              <div className="bg-Light text-dark  ">
                <ul className="p-3 mb-2">
                  <Row>
                    <Col>
                      <b>Created: </b> {data.creation_date}{" "}
                      
                      <b >by: Super USER</b>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <b>Experiment Language: </b>
                      {
                        {
                          1: "Arabic",
                          2: "English",
                          3: "Hebrew",
                          4: "Russian",
                        }[data.language_id]
                      }
                    </Col>

                    <Col>
                      <Row>
                        <b>Status:</b>
                       
                        <Form.Check
                          style={{ marginLeft: "1%" }}
                          type="switch"
                          id="custom-switch"
                          label={data.is_active ? "Active" : "Not-Active"}
                          onClick={this.submitHandlerStatus}
                          checked={data.is_active}
                          //= {}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <br />
                  <Form.Group as={Row} controlId="formPlaintextPassword">
                    <Form.Label column sm="3" >
                        <b>Hosted Link:</b>
                    </Form.Label>

                    <Col sm="6">
                    <Form.Control
                        type="text"
                        defaultValue={data.hosted_link}
                        readOnly
                        style={{ width: "100%" }}
                      />
                      </Col>

                      <Col sm="3">
                    
                      <Button
                        variant="outline-primary"
                        
                        onClick={() => copy(data.hosted_link)}
                      >
                        Copy link
                      </Button>
                      </Col>
                  </Form.Group>

                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
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
