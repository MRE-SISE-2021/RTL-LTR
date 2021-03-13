import React from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import * as actionTypes from "../../store/actions";
// import Card from "../App/components/MainCard";
import Aux from "../../hoc/_Aux";
import { MDBIcon } from "mdbreact";
import API from "../../Api/Api";
import { withCookies } from "react-cookie";
import Rating from "react-rating";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

class FormsElements extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      title: props.title || "",
      label: props.label || "",
      id: props.expId,
      delete: true,
      deleteAll: false,
      taskId: props.taskId,
      answersNum: 2,
      answers: props.answers,
    };

    this.onInputchange = this.onInputchange.bind(this);
    this.onInputAdd = this.onInputAdd.bind(this);
    this.onInputSub = this.onInputSub.bind(this);
    this.onAnswerchange = this.onAnswerchange.bind(this);
  }

  componentWillReceiveProps(propsIncoming) {
    console.log(propsIncoming);

    this.setState({ label: propsIncoming.label });
  }
  sendData = () => {
    // cookies

    //PUT request -- save task
    // console.log(this.state);
    const { cookies } = this.props;
    console.log(this.props.compTypeId);
    let response = {};
    if (this.taskId !== "") {
      response = {
        //tasks
        tasks: [
          {
            answers: this.state.answers,
            order_key: this.props.keyOrder,
            component_type_id: this.props.compTypeId,
            direction: "RTL",
            label: this.state.label,
            images: [],
            task_title: this.state.title,
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
            answers: this.props.answers,
            order_key: this.props.keyOrder,
            component_type_id: this.props.compTypeId,
            direction: "RTL",
            label: this.state.label,
            images: [],
            task_title: this.state.title,
            task_content: "", ////////?
            is_required: true, ///////?
          },
        ],
        questionnaire_id: this.state.id, //
      };
    }
    console.log(response);
    API.putRequest(
      "questionnaire-preview-data/" + this.state.id,
      response,
      cookies.cookies.token
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
    const { cookies } = this.props;

    // console.log(this.props);
    const response = {
      task_id: this.state.taskId, //
    };

    API.deleteRequest(
      "delete-task-from-questionnaire/" + this.state.id,
      response,
      cookies.cookies.token
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
    // console.log(this.state);
    if (this.props.answers !== undefined) {
      this.setState({ answersNum: this.props.answers.length });
    }
    if (this.state.taskId !== undefined) {
      this.openDelete();
    }
  }

  //// Answers --------
  onInputAdd() {
    this.setState({
      answersNum: this.state.answersNum + 1,
    });
  }

  onInputSub() {
    console.log(this.state.answersNum);
    const newList = this.state.answers.splice(this.state.answersNum - 1, 1);
    console.log(this.state.answers);
    this.setState({
      answersNum: this.state.answersNum - 1,
      // answers: newList,
    });
  }
  //// -------- Answers

  onAnswerchange(event) {
    console.log("Answeeeeeersss");
    console.log(this.state);
    console.log(this.props);

    let index = event.target.id - 1;
    let answer_content = event.target.value;
    let answers = [];
    if (this.state.answers !== undefined) {
      answers = [...this.state.answers];
    }
    // let answers = [...this.state.answers];
    if (event.target.name === "check") {
      if (
        this.props.answers !== undefined &&
        this.props.answers[index] !== undefined
      ) {
        answers[index] = {
          answer_content: this.props.answers[index].answer_content,
          is_correct: event.target.checked,
          value: "defalut",
        };
      } else {
        answers[index] = {
          answer_content: this.state.answers[index].answer_content,
          is_correct: event.target.checked,
          value: "defalut",
        };
      }

      this.setState({ answers });
      return;
    }
    answers[index] = {
      answer_content: answer_content,
      is_correct: false,
      value: "defalut",
    };
    this.setState({ answers });
    console.log(this.state.answers);
  }

  render() {
    //// Answers --------
    var answers = [];
    for (var i = 0; i < this.state.answersNum; i++) {
      // note: we are adding a key prop here to allow react to uniquely identify each
      // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
      let ans = undefined;
      if (
        this.props.answers !== undefined &&
        this.props.answers[i] !== undefined
      ) {
        ans = this.props.answers[i].answer_content;
      }
      answers.push(
        <Row key={i}>
          {/* <p key={i}>answ</p> */}
          <Form.Control
            type="checkbox"
            name="check"
            id={i + 1}
            // value="show_title"
            // defaultChecked={this.state.showTitle}
            onChange={this.onAnswerchange}
            style={{ marginLeft: "0", width: "5%" }}
          />

          <Form.Control
            style={{
              width: "68%",
              border: "2px solid black",
              marginLeft: "1%",
            }}
            id={i + 1}
            key={i}
            type="text"
            placeholder={"Answer " + i}
            name="answer_content"
            // value={this.state.label}
            value={ans}
            onChange={this.onAnswerchange}
            required
            // readOnly={this.state.deleteAll}
          />
          <br />
          {i + 1 === this.state.answersNum ? (
            <Col md={3}>
              <Button
                variant="info"
                onClick={this.onInputAdd}
                // disabled={this.state.deleteAll}
              >
                <MDBIcon icon="plus" />
              </Button>
              {this.state.answersNum - 1 >= 2 ? (
                <Button
                  variant="danger"
                  // disabled={this.state.delete}
                  onClick={this.onInputSub}
                >
                  <MDBIcon icon="times" />
                </Button>
              ) : null}
            </Col>
          ) : null}
          <br />
          {this.props.compTypeId === 2 && (
            <Row>
              {console.log(this.props.compTypeId)}
              {/* <Col md={6}> */}
              <Form.Group>
                <Slider
                  className="pc-range-slider"
                  defaultValue={20}
                  handle={handle}
                />{" "}
              </Form.Group>
              {/* </Col> */}
            </Row>
          )}
          {this.props.compTypeId === 4 && (
            <Row>
              {console.log(this.props.compTypeId)}
              {/* <Col md={6}> */}
              <Form.Group controlId="exampleForm.RangeInput">
                <Range
                  className="pc-range-slider"
                  allowCross={false}
                  defaultValue={[0, 20]}
                />
              </Form.Group>
              {/* </Col> */}
            </Row>
          )}
          {this.props.compTypeId === 5 && (
            <Row>
              {console.log(this.props.compTypeId)}
              {/* <Col md={6}> */}
              <Form.Group controlId="exampleForm.RangeInput">
                <Rating
                  emptySymbol="far fa-star fa-2x"
                  fullSymbol="fas fa-star fa-2x"
                />
              </Form.Group>
              {/* </Col> */}
            </Row>
          )}
          {this.props.compTypeId === 6 && (
            <Row>
              {console.log(this.props.compTypeId)}
              {/* <Col md={6}> */}
              <Form.Group controlId="exampleForm.RangeInput">
                <Rating
                  initialRating={this.state.squareRating}
                  emptySymbol={[1, 2, 3, 4, 5].map((n) => (
                    <span className="theme-bar-square">
                      <span>{n}</span>
                    </span>
                  ))}
                  fullSymbol={[1, 2, 3, 4, 5].map((n) => (
                    <span className="theme-bar-square">
                      <span className="active">{n}</span>
                    </span>
                  ))}
                  onChange={(rate) => this.setState({ squareRating: rate })}
                />
              </Form.Group>
              {/* </Col> */}
            </Row>
          )}
        </Row>
      );
    }
    //// -------- Answers
    // console.log(this.state);

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
              <Row>
                <Card.Title as="h5">
                  <Form.Control
                    type="text"
                    placeholder="Enter Your Task Title"
                    onChange={this.onInputchange}
                    name="title"
                    value={this.state.title}
                    required
                    readOnly={this.state.deleteAll}
                    style={{ border: "2px solid red", width: "110%" }}
                  />
                </Card.Title>
                <Col md={7}>
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
                      style={{ width: "160%", border: "2px solid black" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* ///// */}
              {answers}
              {/* /////// */}
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
  connect(mapStateToProps, mapDispatchToProps)(FormsElements)
);
