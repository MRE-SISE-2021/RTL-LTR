import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import * as actionTypes from "../store/actions";
// import Card from "../App/components/MainCard";
import Aux from "../hoc/_Aux";
import { MDBIcon } from "mdbreact";
import API from "../Api/Api";

class FormsElements extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      title: props.title,
      label: props.label,
      id: props.expId,
      delete: true,
      deleteAll: false,
      taskId: props.taskId,
    };
    this.onInputchange = this.onInputchange.bind(this);
  }

  componentWillReceiveProps(propsIncoming) {
    console.log(propsIncoming);
    this.setState({ label: propsIncoming.label });
  }
  sendData = () => {
    //PUT request -- save task
    console.log(this.props);
    let response = {};
    if (this.taskId !== "") {
      response = {
        //tasks
        tasks: [
          {
            answers: [],
            components: [
              {
                order_key: this.props.keyOrder,
                component_type: this.props.name,
                direction: "RTL",
                label: this.state.label,
              },
            ],
            images: [],
            task_title: this.state.title,
            task_content: "", ////////?
            is_required: true, ///////?
            task_id: this.state.taskId,
          },
        ],
        questionnaire_id: this.state.id, //
      };
    } else {
      response = {
        //tasks
        tasks: [
          {
            answers: [],
            components: [
              {
                order_key: this.props.keyOrder,
                component_type: this.props.name,
                direction: "RTL",
                label: this.state.label,
              },
            ],
            images: [],
            task_title: this.state.title,
            task_content: "", ////////?
            is_required: true, ///////?
          },
        ],
        questionnaire_id: this.state.id, //
      };
    }

    API.putRequest(
      "questionnaire-preview-data/" + this.state.id,
      response
    ).then((data) => {
      this.setState({ taskId: data.task_id[0] });
    });

    ///show delete button
    this.setState({
      delete: false,
    });
  };

  deleteData = () => {
    //DELETE request -- delete task
    // console.log(this.props);
    const response = {
      task_id: this.state.taskId, //
    };

    API.deleteRequest(
      "questionnaire-preview-data/" + this.state.id,
      response
    ).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
    });

    ///show delete button
    this.setState({
      delete: true,
      deleteAll: true,
    });
  };

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  openDelete() {
    this.setState({
      delete: false,
    });
  }
  componentDidMount() {
    console.log(this.state);
    if (this.state.taskId !== "") {
      this.openDelete();
    }
  }
  render() {
    console.log(this.state);
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }

    return (
      <Aux>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            style={{
              width: "500px",
            }}
          >
            <Card.Header>
              <Card.Title as="h5">
                <Form.Control
                  type="text"
                  placeholder="Enter Your Task Title"
                  onChange={this.onInputchange}
                  name="title"
                  value={this.state.title}
                  required
                  readOnly={this.state.deleteAll}
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
                      value={this.state.label}
                      onChange={this.onInputchange}
                      required
                      readOnly={this.state.deleteAll}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Button
                    variant="info"
                    onClick={this.sendData}
                    disabled={this.state.deleteAll}
                  >
                    <MDBIcon icon="save" />
                  </Button>
                  <Button
                    variant="danger"
                    disabled={this.state.delete}
                    onClick={this.deleteData}
                  >
                    <MDBIcon icon="trash-alt" />
                  </Button>
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
                        readOnly={this.state.deleteAll}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
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

export default connect(mapStateToProps, mapDispatchToProps)(FormsElements);
