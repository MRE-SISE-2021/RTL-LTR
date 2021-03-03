import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import * as actionTypes from "../store/actions";
// import Card from "../App/components/MainCard";
import Aux from "../hoc/_Aux";
// import Breadcrumb from "../App/components/Breadcrumb";
import { MDBIcon } from "mdbreact";

async function putData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
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

class FormsElements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      label: "",
      id: props.expId,
      delete: true,
      deleteAll: false,
      taskId: "",
    };
    this.onInputchange = this.onInputchange.bind(this);
  }

  sendData = () => {
    //PUT request -- save task
    console.log(this.props);
    const response = {
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

    putData(
      "http://127.0.0.1:8000/questionnaire-preview-data/" + this.state.id,
      response
    ).then((data) => {
      // console.log(data); // JSON data parsed by `data.json()` call
      this.setState({ taskId: data.task_id[0] });
    });

    ///show delete button
    this.setState({
      delete: false,
    });

    // console.log(this.state);
  };

  deleteData = () => {
    //PUT request -- save task
    console.log(this.props);
    const response = {
      task_id: this.state.taskId, //
    };

    deleteData(
      "http://127.0.0.1:8000/questionnaire-preview-data/" + this.state.id,
      response
    ).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      // this.setState({ taskId: data.task_id[0] });
    });

    ///show delete button
    this.setState({
      delete: true,
      deleteAll: true,
    });

    // console.log(this.state);
  };

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    // console.log(this.state);
    // const { validated, validatedTooltip } = this.state;
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
                  {/* </Col> */}
                  {/* <Col md={3}> */}
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
