import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

// import Card from "../App/components/MainCard";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
class ExperimentInfo extends Component {
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

    // console.log(this.props.chosen);
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }

    console.log(data);
    return (
      <Aux>
        {/* <NavBar /> */}
        <div className={mainClass.join(" ")}>
          <div className="pcoded-main-container full-screenable-node">
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Aux>
                        <Row>
                          <Col>
                            <Card isOption>
                              <Card.Header>
                                <Card.Title>
                                  {data.questionnaire_name}
                                  <div className="d-flex justify-content-lg-end">
                                    <Button variant="outline-*" disabled>
                                      <MDBIcon className="mr-5" icon="upload" />
                                    </Button>
                                    <Button
                                      variant="outline-*"
                                      onClick={this.submitHandler}
                                    >
                                      <MDBIcon className="mr-5" icon="eye" />
                                    </Button>

                                    <Button variant="outline-*" disabled>
                                      <MDBIcon className="mr-5" icon="clone" />
                                    </Button>
                                    <Button variant="outline-*" disabled>
                                      <MDBIcon className="mr-5" icon="edit" />
                                    </Button>
                                    <Button variant="outline-*" disabled>
                                      <MDBIcon
                                        className="mr-5"
                                        icon="trash-alt"
                                      />
                                    </Button>
                                  </div>
                                </Card.Title>
                              </Card.Header>
                              <Card.Body>
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
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Aux>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Configuration /> */}
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
