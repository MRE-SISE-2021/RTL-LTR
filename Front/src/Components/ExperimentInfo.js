import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

// import Card from "../App/components/MainCard";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";

import "../styles/homePageStyle.css";
//import '../assets/scss/themes/bootstrap-overlay/_card.scss'

async function deleteData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

class ExperimentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDashboard: false,
      // id: props.chosen.questionnaire_id,
    };
    this.submitHandlerPreview = this.submitHandlerPreview.bind(this);
    this.submitHandlerDelete = this.submitHandlerDelete.bind(this);
  }

  submitHandlerPreview(event) {
    event.preventDefault();
    this.setState(() => ({
      toDashboard: true,
    }));
  }

  submitHandlerDelete(event) {
    //PUT request -- save task
    // console.log(this.props);

    const response = {
      //tasks
      // tasks: [
      //   {
      //     answers: [],
      //     components: [
      //       {
      //         order_key: this.props.keyOrder,
      //         component_type: this.props.name,
      //         direction: "RTL",
      //         label: this.state.label,
      //       },
      //     ],
      //     images: [],
      //     task_title: this.state.title,
      //     task_content: "", ////////?
      //     is_required: true, ///////?
      //   },
      // ],
      // questionnaire_id: this.state.id, //
    };

    deleteData(
      "http://127.0.0.1:8000/questionnaire-preview-data/" +
        this.props.chosen.questionnaire_id,
      response
    ).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      // this.setState({ expId: data.questionnaire_id });
    });
    // console.log(this.state);
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
    // const data = QuestionaireInfoResponse;
    const data = this.props.chosen;

    if (this.state.toDashboard === true) {
      return <Redirect to={"/preview/" + data.questionnaire_id} />;
    }

    console.log(data);
    return (
      <Aux>
        <nav
          className="bg-info text-white"
          style={{ marginTop: "90px", marginLeft: "200px" }}
        >
          <Aux>
            <Card>
              <Card.Header style={{ height: "90px" }}>
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
                    <Button variant="outline-*" disabled>
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
                <div style={{ height: "425px" }} className="bg-info text-white">
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentInfo);
