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
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
////---rtl
import "./../../assets/scss/style.scss";

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
    // console.log(props);
    this.state = {
      title: props.title || "",
      label: props.label || "",
      id: props.expId,
      delete: true,
      keyOrder: props.keyOrder,
      deleteAll: false,
      taskId: props.taskId,
      answersNum: 2,
      answers: props.answers || [],
      settings: {
        is_direction_setting: props.is_direction_setting || "RTL",
        is_required_setting: props.is_required_setting || false,
        is_new_page_setting: props.is_new_page_setting || false,
        is_add_picture_setting: props.is_add_picture_setting || false,
      },
    };

    this.onInputchange = this.onInputchange.bind(this);
    this.onInputAdd = this.onInputAdd.bind(this);
    this.onInputSub = this.onInputSub.bind(this);
    this.onAnswerchange = this.onAnswerchange.bind(this);
    this.setSettings = this.setSettings.bind(this);
    this.getLangAnswer = this.getLangAnswer.bind(this);
    this.getLangQuestion = this.getLangQuestion.bind(this);
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
    // console.log(this.props.compTypeId);
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
            task_type_id: "1",
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
            task_type_id: "1",
          },
        ],
        questionnaire_id: this.state.id, //
      };
    }
    console.log(response);
    API.putRequest(
      "questionnaire-preview-data/" + this.state.id,
      response
    ).then((data) => {
      console.log(data);
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

    //if the question was saved in DB -- > Delete from DB
    if (this.state.taskId !== undefined && this.state.taskId !== "") {
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
    }
    //Call delete task from pareant component(Task)
    this.props.delete(this.state.keyOrder);

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
    this.state.answers.splice(this.state.answersNum - 1, 1);
    console.log(this.state.answers);
    this.setState({
      answersNum: this.state.answersNum - 1,
      // answers: newList,
    });
  }
  //// -------- Answers

  onAnswerchange(event) {
    console.log("Answeeeeeersss");
    // console.log(event.target.index);
    let index = event.target.id - 1;
    let answer_content = event.target.value;
    let answers = [...this.state.answers];
    if (event.target.name === "check") {
      if (
        this.state.answers[index] !== undefined &&
        this.state.answers[index].answer_content !== undefined
      ) {
        // update answer with new check value
        answers[index] = {
          answer_content: this.state.answers[index].answer_content,
          is_correct: event.target.checked,
          value: "defalut",
        };
      } else {
        // add new answer with new check value
        answers[index] = {
          answer_content: "",
          is_correct: event.target.checked,
          value: "defalut",
        };
      }
      this.setState({ answers });
      return;
    }

    if (
      this.state.answers[index] !== undefined &&
      this.state.answers[index].answer_content !== undefined
    ) {
      // update answer with new ans value
      answers[index] = {
        answer_content: answer_content,
        is_correct: this.state.answers[index].is_correct,
        value: "defalut",
      };
    } else {
      // add new answer with new ans value
      answers[index] = {
        answer_content: answer_content,
        is_correct: false,
        value: "defalut",
      };
    }

    this.setState({ answers });
    // console.log(this.state.answers);
  }

  ///settings----
  setSettings(event) {
    debugger;
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
          settings.is_direction_setting = event.target.value;
          break;
      }

      // update the name property, assign a new value
      return { settings }; // return new object jasper object
    });
  }
  getLangAnswer() {
    switch (this.props.lang) {
      case "1":
        return "إجابه";
      case "2":
        return "Answer";
      case "3":
        return "תשובה";
      case "4":
        return "Отвечать";
      default:
        return "2";
    }
  }
  getLangQuestion() {
    switch (this.props.lang) {
      case "1":
        return "أدخل سؤالك";
      case "2":
        return "Enter your question";
      case "3":
        return "הזן את השאלה שלך";
      case "4":
        return "Введите свой вопрос";
      default:
        return "2";
    }
  }
  render() {
    console.log(this.state);
    const ColStyled = styled.div`
      ${rtl`
    direction: ltr;
    margin-left: auto;
    `};
    `;
    ///rtl
    let theme = {
      dir: "ltr",
      // OR direction: "rtl"
    };
    // console.log(this.props);
    if (this.props.dir === "RTL") {
      theme = {
        dir: "rtl",
        // OR direction: "rtl"
      };
    }
    // console.log(theme);
    //rtl
    //// Answers --------
    var answers = [];
    let lang = this.props.lang;

    for (var i = 0; i < this.state.answersNum; i++) {
      // note: we are adding a key prop here to allow react to uniquely identify each
      // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
      // console.log(this.props.answers);
      let ans = undefined;
      let isCorrect = false;
      if (
        // this.props.answers !== undefined &&
        this.state.answers[i] !== undefined
      ) {
        ans = this.state.answers[i].answer_content;
        isCorrect = this.state.answers[i].is_correct;
        // console.log(isCorrect);
      }
      answers.push(
        <div key={i}>
          <Row key={i}>
            {/* <p key={i}>answ</p> */}

            <Form.Control
              type="checkbox"
              name="check"
              id={i + 1}
              checked={isCorrect}
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
              // id={i + 1 + " task " + this.state.taskId}
              id={i + 1}
              key={i}
              type="text"
              placeholder={this.getLangAnswer() + " " + i}
              name="answer_content"
              // readOnly={this.state.deleteAll}
              value={
                this.state.answers[i] === undefined
                  ? ans
                  : this.state.answers[i].answer_content
              }
              onChange={this.onAnswerchange}
              required
              // readOnly={this.state.deleteAll}
            />

            {i + 1 === this.state.answersNum ? (
              <ColStyled>
                <Button
                  variant="primary"
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
              </ColStyled>
            ) : null}
          </Row>
          <br />
        </div>
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
      "Text",
    ];
    // console.log(compArray[this.props.compTypeId - 1]);
    return (
      <Aux>
        <ThemeProvider theme={theme}>
          <Card dir={theme.dir}>
            <Card.Header>
              <Row>
                <Card.Title as="h5">
                  <Col>
                    <Form.Label>
                      {compArray[this.props.compTypeId - 1]}
                    </Form.Label>

                    {/* <Form.Control
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
                    /> */}
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
                            onChange={(rate) =>
                              this.setState({ squareRating: rate })
                            }
                          />
                        </Form.Group>
                        {/* </Col> */}
                      </Row>
                    )}
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
                  <Form.Group>
                    <Form.Control
                      variant="primary"
                      type="text"
                      placeholder={this.getLangQuestion()}
                      name="label"
                      value={this.state.label}
                      onChange={this.onInputchange}
                      required
                      // readOnly={this.state.deleteAll}
                      style={{ width: "160%", border: "2px solid " }}
                      id={"ques " + this.state.taskId}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* ///// */}
              {this.props.compTypeId === 9 ||
              this.props.compTypeId === 10 ||
              this.props.compTypeId === 4 ||
              this.props.compTypeId === 5 ||
              this.props.compTypeId === 6 ||
              this.props.compTypeId === 2
                ? null
                : answers}
              {/* /////// */}
              {/* <Modal.Footer> */}

              {/* </Modal.Footer> */}
            </Card.Body>
            <Card.Footer>
              <Row
                style={{
                  // marginRight: "30%",
                  textAlign: "left",
                  color: "black",
                }}
              >
                <Col xs="auto">
                  {/* <Form.Check
                    type="switch"
                    id={"is_direction " + this.props.keyOrder}
                    // id="is_direction"
                    label="RTL/LTR customization"
                    onChange={this.setSettings}
                    checked={this.state.settings.is_direction_setting}
                  /> */}
                  <Form.Group
                    // className=" mr-4"
                    // style={{
                    //   flexFlow: "inherit",
                    //   marginTop: "1%",
                    //   marginRight: "2%",
                    // }}
                    // onChange={this.onDirectionChange}
                    id={"is_direction " + this.props.keyOrder}
                    onChange={this.setSettings}
                  >
                    <Form.Control as="select" value={this.state.direction}>
                      <option value="RTL">RTL</option>
                      <option value="LTR">LTR</option>
                      <option value="RND">RND</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  <Form.Check
                    type="switch"
                    id={"is_required " + this.props.keyOrder}
                    label="is required"
                    // id="is_required"
                    onChange={this.setSettings}
                    checked={this.state.settings.is_required_setting}
                  />
                  <Form.Check
                    type="switch"
                    id={"is_add_picture " + this.props.keyOrder}
                    // id="is_add_picture"
                    label="Add picture under the question"
                    onChange={this.setSettings}
                    checked={this.state.settings.is_add_picture_setting}
                  />
                </Col>
                <Col xs="auto">
                  <Form.Check
                    type="switch"
                    id={"is_new_page " + this.props.keyOrder}
                    // id="is_new_page"
                    label="Open on a new page"
                    onChange={this.setSettings}
                    checked={this.state.settings.is_new_page_setting}
                  />
                </Col>
                <ColStyled>
                  <Button
                    style={{ border: "#00897B", backgroundColor: "#00897B" }}
                    variant="success"
                    onClick={this.sendData}
                    // disabled={this.state.deleteAll}
                    type="submit"
                  >
                    <MDBIcon icon="save" />
                  </Button>
                  &nbsp;
                  <Button
                    variant="danger"
                    // disabled={this.state.delete}
                    onClick={this.deleteData}
                  >
                    <MDBIcon icon="trash-alt" />
                  </Button>
                </ColStyled>
              </Row>
            </Card.Footer>
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
