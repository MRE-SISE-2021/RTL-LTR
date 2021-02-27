import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import * as actionTypes from "../store/actions";
// import Card from "../App/components/MainCard";
import Aux from "../hoc/_Aux";
import Breadcrumb from "../App/components/Breadcrumb";

class FormsElements extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "",
      label: "",
      questionnaire_id: "",
    };
  }

  sendData = () => {
    //PUT request -- save task
    const response = {
      //tasks
      tasks: [
        {
          // answers: [],
          components: [
            {
              order_key: "",
              component_type: "",
              direction: "RTL",
              label: this.state.label,
            },
          ],
          // images: [],
          // task_title: "jj",
          // task_content: "", ////////?
          // is_required: true, ///////?
        },
      ],
      //data
      // creation_date: "2021-01-06 23:25", //
      // questionnaire_name: this.state.expName,
      // hosted_link: "", //
      // is_active: "true",
      // language_id: this.getLangId(),
      // questionnaire_type_id: "1", //
    };

    console.log(response);
    const requestOptions = {
      method: "put",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };

    fetch(
      "http://127.0.0.1:8000/questionnaire-preview-data/" +
        this.state.questionnaire_id +
        "/",
      requestOptions
    )
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .catch((error) => this.setState({ error })); // event.preventDefault();
  };

  render() {
    // const { validated, validatedTooltip } = this.state;
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }

    return (
      <Aux>
        <div className={mainClass.join(" ")}>
          <div className="pcoded-main-container full-screenable-node">
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Row className="align-items-center page-header">
                        <Col>
                          <Breadcrumb />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Card>
                            <Card.Header>
                              <Card.Title as="h5">
                                <Form.Control
                                  type="text"
                                  // placeholder=`${this.props.name}:Inputs`
                                  placeholder="Enter Your Task Title"
                                  // value={this.state.title}
                                  // onChange={this.sendData}
                                  onChange={(e) =>
                                    this.setState({ title: e.target.title })
                                  }
                                />
                              </Card.Title>
                            </Card.Header>
                            <Card.Body>
                              <hr />
                              <Row>
                                <Col md={6}>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Control
                                      type="text"
                                      placeholder="Enter Your Question"
                                      // value={this.state.label}
                                      onChange={(e) =>
                                        this.setState({ label: e.target.label })
                                      }
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={6}>
                                  <Button onClick={this.sendData}>Save</Button>
                                </Col>
                              </Row>
                              {this.props.name === "Range" && (
                                <Row>
                                  <Col md={6}>
                                    <Form.Group controlId="exampleForm.RangeInput">
                                      <Form.Control
                                        type="range"
                                        className="form-control-range"
                                        // value={this.state.label}
                                        onChange={(e) =>
                                          this.setState({
                                            label: e.target.label,
                                          })
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormsElements);
