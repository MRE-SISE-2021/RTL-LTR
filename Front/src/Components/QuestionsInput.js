import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import * as actionTypes from "../store/actions";
// import Card from "../App/components/MainCard";
import Aux from "../hoc/_Aux";
import Breadcrumb from "../App/components/Breadcrumb";

class FormsElements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      label: "",
      id: this.props.expId,
    };
    this.onInputchange = this.onInputchange.bind(this);
  }

  sendData = () => {
    //PUT request -- save task

    console.log(this.state);
  };

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

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
                                  placeholder="Enter Your Task Title"
                                  onChange={this.onInputchange}
                                  name="title"
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
                                      name="label"
                                      onChange={this.onInputchange}
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
                                        name="label"
                                        onChange={this.onInputchange}
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
