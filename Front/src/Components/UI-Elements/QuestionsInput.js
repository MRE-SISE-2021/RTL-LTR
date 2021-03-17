import React from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Container,
} from "react-bootstrap";
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
///// --- rtl
import { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
////---rtl
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
      settings: {
        is_direction_setting: false,
        is_required_setting: false,
        is_new_page_setting: false,
        is_add_picture_setting: false,
      },
    };

    this.onInputchange = this.onInputchange.bind(this);
    this.onInputAdd = this.onInputAdd.bind(this);
    this.onInputSub = this.onInputSub.bind(this);
    this.onAnswerchange = this.onAnswerchange.bind(this);
    this.setSettings = this.setSettings.bind(this);
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
            // direction: "RTL", ////////DELETE
            label: this.state.label,
            images: [],
            task_title: this.state.title,
            // is_required: true, ////////DELETE
            task_id: this.state.taskId,
            settings: this.state.settings,
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
            // direction: "RTL", ////////DELETE
            label: this.state.label,
            images: [],
            task_title: this.state.title,
            task_content: "", ////////?
            // is_required: true, ////////DELETE
            settings: this.state.settings,
          },
        ],
        questionnaire_id: this.state.id, //
      };
    }
    console.log(response);
    API.putRequest(
      "questionnaire-preview-data/" + this.state.id,
      response,
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
      cookies.cookies.access_token
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

  ///settings----
  setSettings(event) {
    var id = event.target.id;
    var checked = event.target.checked;
    this.setState((prevState) => {
      let settings = Object.assign({}, prevState.settings); // creating copy of state variable jasper
      switch (id) {
        case "is_add_picture " + this.props.keyOrder:
          settings.is_add_picture_setting = checked;
          break;
        case "is_new_page " + this.props.keyOrder:
          settings.is_new_page_setting = checked;
          break;
        case "is_required " + this.props.keyOrder:
          settings.is_required_setting = checked;
          break;
        case "is_direction " + this.props.keyOrder:
          settings.is_direction_setting = checked;
          break;
      }

      // update the name property, assign a new value
      return { settings }; // return new object jasper object
    });
  }
  render() {
    const settingsBasic = {
      dots: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerPadding: "500px",
      autoplay: true,
      autoplaySpeed: 5000,
    };
    ///rtl
    let theme = {
      dir: "ltr",
      // OR direction: "rtl"
    };
    if (this.state.settings.is_direction_setting) {
      theme = {
        dir: "rtl",
        // OR direction: "rtl"
      };
    }
    console.log(theme);
    //rtl
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
        <Container key={i}>
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
                width: "60%",
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

            {i + 1 === this.state.answersNum ? (
              <Col>
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
          </Row>
          <br />
          {this.props.compTypeId === 2 && (
            <Row>
              {console.log(this.props.compTypeId)}
              {/* <Card>
                <Card.Body> */}
              <Slider
                style={{
                  width: "80%",
                  top: "2%",
                  left: "5%",
                  bottom: "2%",
                }}
                className="pc-range-slider"
                // {...settingsBasic}
              />
              {/* </Card.Body>
              </Card> */}
            </Row>
          )}
          {this.props.compTypeId === 4 && (
            <Row>
              {console.log(this.props.compTypeId)}
              {/* <Col md={6}> */}
              {/* <Form.Group controlId="exampleForm.RangeInput"> */}
              <Range
                className="pc-range-slider"
                style={{
                  width: "80%",
                  top: "2%",
                  left: "5%",
                  bottom: "2%",
                }}
                step={10}
                defaultValue={[20, 30]}
              />
              {/* </Form.Group> */}
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
          {/* </Row> */}

          <br />
        </Container>
      );
    }
    //// -------- Answers
    // console.log(this.state);
    let compArray = [
      "New Page",
      "Slider",
      "Single choice",
      "Double Slider",
      "Stars",
      "Numiric",
      "Dropdown",
      "Multi Choice",
      "Counter",
      "Timeline",
    ];
    console.log(compArray[this.props.compTypeId - 1]);
    return (
      <Aux>
        <ThemeProvider theme={theme}>
          <Card dir={theme.dir}>
            <Card.Header>
              <Row>
                <Card.Title as="h5">
                  <Col>
                    <Form.Label>
                      {compArray[this.props.compTypeId - 1]}: Task Title
                    </Form.Label>

                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Enter Your Task Title"
                      onChange={this.onInputchange}
                      name="title"
                      value={this.state.title}
                      required
                      readOnly={this.state.deleteAll}
                      border="info"
                      variant="info"
                      style={{ border: " 2px solid " }}
                    />
                  </Col>
                  <Col>
                    {this.state.settings.is_required_setting ? (
                      <p style={{ color: "red" }}>*required</p>
                    ) : null}
                  </Col>
                </Card.Title>
              </Row>
            </Card.Header>
            <Card.Body>
              <hr />

              <Row>
                <Col md={6}>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control
                      variant="info"
                      type="text"
                      placeholder="Enter Your Question"
                      name="label"
                      value={this.state.label}
                      onChange={this.onInputchange}
                      required
                      readOnly={this.state.deleteAll}
                      style={{ width: "160%", border: "2px solid " }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* ///// */}
              {this.props.compTypeId === 9 || this.props.compTypeId === 10
                ? null
                : answers}
              {/* /////// */}
              <Modal.Footer>
                <Form
                  style={{
                    marginRight: "30%",
                    textAlign: "left",
                    color: "black",
                  }}
                >
                  <Row>
                    <Col>
                      <Form.Check
                        type="switch"
                        id={"is_direction " + this.props.keyOrder}
                        // id="is_direction"
                        label="RTL/LTR customazation"
                        onClick={this.setSettings}
                      />
                      <Form.Check
                        type="switch"
                        id={"is_required " + this.props.keyOrder}
                        label="is required"
                        // id="is_required"
                        onClick={this.setSettings}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        type="switch"
                        id={"is_new_page " + this.props.keyOrder}
                        // id="is_new_page"
                        label="Open on a new page"
                        onClick={this.setSettings}
                      />

                      <Form.Check
                        type="switch"
                        id={"is_add_picture " + this.props.keyOrder}
                        // id="is_add_picture"
                        label="Add picture under the question"
                        onClick={this.setSettings}
                      />
                    </Col>
                  </Row>
                </Form>
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
              </Modal.Footer>
            </Card.Body>
          </Card>
        </ThemeProvider>
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
