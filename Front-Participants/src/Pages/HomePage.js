import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import API from "../Api/Api";
import { Card, ListGroup, Form, Row } from "react-bootstrap";
import Rating from "react-rating";
import Slider from "rc-slider";
import { format } from "date-fns";

//RTL
import styled, { keyframes, ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
//new Page
import Pagination from "../Components/Pagination";

import axiosInstance from "../axios";
import "../styles/PreviewPage.css";
import Demographics from "../Components/Demographics";
import Task from "../Components/Task";
const createSliderWithTooltip = Slider.createSliderWithTooltip;

const Range = createSliderWithTooltip(Slider.Range);
//

class HomePage extends Component {
  constructor(props) {
    super(props);
    console.log(props.data);
    this.state = {
      tasks: props.data.tasks, //what we get from db
      inputList: [], //what we show to the user
      pageOfComponents: [], // show on one page
      name: props.data.name,
      lang: props.data.lang,
      type: props.data.type,
      direction: props.data.direction,
      demographic_task: props.data.demographic_task,
      demographic: props.data.demographic,
      demo_answers: [],
      total_answer: props.data.demographic_task.length - 3,
      isError: true,
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onUpdateDemoAnswer = this.onUpdateDemoAnswer.bind(this);
    this.onCreateUser = this.onCreateUser.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.setDemoUI = this.setDemoUI.bind(this);
    this.deleteFromArray = this.deleteFromArray.bind(this);
  }

  async componentWillReceiveProps(propsIncoming) {
    //Edit EXP
    // debugger;
    console.log(propsIncoming);
    await this.setState({
      tasks: propsIncoming.data.tasks, //what we get from db
      name: propsIncoming.data.name,
      lang: propsIncoming.data.lang,
      type: propsIncoming.data.type,
      direction: propsIncoming.data.direction,
      demographic_task: propsIncoming.data.demographic_task,
      demographic: propsIncoming.data.demographic,
      total_answer: propsIncoming.data.demographic_task.length - 3,
    });
    console.log(this.state);

    this.putInputList();
  }
  onChangePage(pageOfComponents) {
    // update state with new page of items
    this.setState({ pageOfComponents: pageOfComponents });
  }

  onCreateUser() {
    // post Request!
    console.log("Post --- request --- create new user");
    const response = {
      demo_answers: this.state.demo_answers,
      // questionnaire_id: "1", //
      hash: this.props.hosted_link,
      questionnaire_start: format(new Date(), "yyyy-MM-dd kk:mm:ss"),
    };
    console.log(response);
    // API.postRequest("participant-data", response).then((data) => {
    //   console.log(data); // JSON data parsed by `data.json()` call
    //   // this.setState({ expId: data.questionnaire_id });
    // });
  }
  onUpdateDemoAnswer(answer) {
    if (answer.isError !== undefined) {
      this.setState({ isError: answer.isError });
    }
    debugger;
    // update state with new answer from Task component
    let order_key = parseInt(answer.order_key);
    let answers = this.state.demo_answers;
    let answer_id = parseInt(answer.answer_id);
    let arr = [];
    // debugger;
    //if free text?
    if (answer.free_answer !== undefined) {
      this.setDemoText(answer, answers, order_key);
      return;
    }
    ///else
    // to add answer to check box list
    if (order_key === 3 || order_key === 5 || order_key === 11) {
      if (this.setDemoCheckbox(answers, order_key, arr, answer_id)) {
        return;
      }
    }
    if (order_key === 9) {
      if (this.setDemoUI(answer.value)) {
        return;
      }
    }

    for (let [i, ans] of answers.entries()) {
      //switch radio button selection
      if (ans.order_key === order_key) {
        answers[i] = {
          answer_ids: arr.concat([answer_id]),
          order_key: order_key,
        };
        this.setState({
          demo_answers: answers,
        });
        return;
      }
    }
    // add new answer (radio or checkBox)
    this.setState({
      demo_answers: this.state.demo_answers.concat({
        answer_ids: arr.concat([answer_id]),
        order_key: order_key,
      }),
    });
    console.log(this.state);
  }

  //help function -- delete from object array according to id(order_key/somthing else...)
  deleteFromArray(array, key) {
    // debugger;
    for (let i = 0; i < array.length; i++) {
      let answer = array[i];
      if (answer.order_key === key) {
        array.splice(key, 1);
      }
    }
    return array;
  }

  //Question 10 + 11 according to question 9 answer
  setDemoUI(value) {
    if (value === "0") {
      // debugger;
      var array = [...this.state.pageOfComponents]; // make a separate copy of the array
      var index = this.state.pageOfComponents.length;
      if (index > 2) {
        array.splice(index - 1, 1);
        this.setState({
          demo_answers: this.deleteFromArray(this.state.demo_answers, 10),
        });
        this.setState({
          demo_answers: this.deleteFromArray(this.state.demo_answers, 9),
        });
        this.setState({
          pageOfComponents: array,
          total_answer: this.state.total_answer - 2,
        });
      }
    } else {
      // debugger;
      //add questions 10 + 11 to input list
      console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      // 1. Make a shallow copy of the array
      let inputList = [...this.state.pageOfComponents];
      let new_inputList = [];
      // 2. Make a shallow copy of the element you want to mutate
      // let temp_element = { ...inputList[1] };

      // 3. Update the property you're interested in
      // temp_element = temp_element.concat(<div>meoo</div>);
      for (let i = 0; i < inputList.length; i++) {
        new_inputList = new_inputList.concat({ ...inputList[i] });
        if (i === 1) {
          new_inputList = new_inputList.concat(
            <div>
              <Task
                key={9}
                demo_task={this.state.demographic_task[9]}
                lang={this.state.lang}
                onChange={this.onUpdateDemoAnswer}
                answers={this.state.demo_answers}
              />
              <Task
                key={10}
                demo_task={this.state.demographic_task[10]}
                lang={this.state.lang}
                onChange={this.onUpdateDemoAnswer}
                answers={this.state.demo_answers}
              />
            </div>
          );
        }
      }

      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      // inputList[1] = temp_element;
      // console.log(inputList);

      // 5. Set the state to our new copy
      this.setState({
        pageOfComponents: new_inputList,
        total_answer: this.state.total_answer + 2,
      });
    }
  }

  setDemoCheckbox(answers, order_key, arr, answer_id) {
    for (let [i, ans] of answers.entries()) {
      if (ans.order_key === order_key) {
        arr = ans.answer_ids; // answers array
        if (arr.includes(answer_id)) {
          // to delete a checkbox from array
          answers[i] = {
            answer_ids: arr.splice(arr.indexOf(answer_id), 1),
            order_key: order_key,
          };
        } else {
          // add
          answers[i] = {
            answer_ids: arr.concat([answer_id]),
            order_key: order_key,
          };
        }

        this.setState({
          demo_answers: answers,
        });
        return true;
      }
    }
    return false;
  }
  setDemoText(answer, answers, order_key) {
    for (let [i, ans] of answers.entries()) {
      //update free answer accourding to order_key
      if (ans.order_key === order_key) {
        if (answer.other !== undefined) {
          answers[i] = {
            answer_ids: [7],
            order_key: order_key,
            free_answer: answer.free_answer,
          };
        } else {
          answers[i] = {
            answer_ids: [],
            order_key: order_key,
            free_answer: answer.free_answer,
          };
        }

        this.setState({
          demo_answers: answers,
        });
        return;
      }
    }
    // first time ...
    this.setState({
      demo_answers: this.state.demo_answers.concat({
        answer_ids: [],
        order_key: order_key,
        free_answer: parseInt(answer.free_answer),
      }),
    });
    console.log(this.state);
  }

  onInputchange(event) {
    // event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  putInputList() {
    console.log(this.state);
    this.state.tasks.forEach((task, index) => {
      let inputList = this.state.inputList;
      console.log(task);
      ////Task Comp Direction
      let compdirection = "rtl";
      let CompDiv = styled.div`
        direction: rtl;
      `;
      if (
        (task.is_direction_setting && this.state.direction === "RTL") ||
        (!task.is_direction_setting && this.state.direction === "LTR")
      ) {
        compdirection = "ltr";
        CompDiv = styled.div`
          direction: ltr;
        `;
      }
      //////// ----- add in a new page ----- //////////
      if (
        task.is_new_page_setting ||
        task.component_type_id === 1 ||
        task.component_type_id === 11
      ) {
        this.setState({
          inputList: inputList.concat(<div></div>),
        });
        inputList = this.state.inputList;
      }
      ///////////////---RTL support --- ///////////////

      const Div = styled.div`
        padding: 10px;
        ${rtl`
        margin-right: 50px;
        text-align: left;
        direction: ltr;
        `};
      `;
      let theme = {
        dir: "ltr",
      };
      if (this.state.direction === "RTL") {
        theme = {
          dir: "rtl",
        };
      }
      ///////////////---RTL support --- ///////////////
      if (task.component_type_id === 11) {
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div
                key={task.order_key}
                dir={theme.dir}
                dangerouslySetInnerHTML={{ __html: task.label }}
              ></Div>
            </ThemeProvider>
          ),
        });
      } else if (task.component_type_id === 1) {
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div
                key={task.order_key}
                dir={theme.dir}
                dangerouslySetInnerHTML={{ __html: task.label }}
              ></Div>
            </ThemeProvider>
          ),
        });
        debugger;
        inputList = this.state.inputList;
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div>
                {/* <Demographics
                  isDemo={this.state.demographic}
                  demoTasks={this.state.demographic_task}
                  lang={this.state.lang}
                /> */}
                <div
                  style={{ textAlign: "center" }}
                  key="11"
                  dir={theme.dir}
                  dangerouslySetInnerHTML={{
                    __html: this.state.demographic_task[11].label,
                  }}
                ></div>
                {this.state.demographic_task.map((demo, i) => {
                  console.log("Entered");
                  console.log(this.state.demographic[i]);
                  // Return the element. Also pass key
                  if (this.state.demographic[i] && i < 9) {
                    return (
                      <Task
                        key={i}
                        demo_task={demo}
                        lang={this.state.lang}
                        onChange={this.onUpdateDemoAnswer}
                        answers={this.state.demo_answers}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
              </Div>
            </ThemeProvider>
          ),
        });
        inputList = this.state.inputList;
        this.setState({
          inputList: inputList.concat(<div></div>),
        });
        inputList = this.state.inputList;
      } else if (
        task.component_type_id === 2 ||
        task.component_type_id === 5 ||
        task.component_type_id === 6 ||
        task.component_type_id === 4 ||
        task.component_type_id === 7
      ) {
        // console.log(task.is_direction_setting);
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div key={"range" + index}>
                <h4>{task.label}</h4>
                {task.component_type_id === 7 ? (
                  <CompDiv>
                    <Form.Control as="select">
                      {task.answers.map(function (answer, index) {
                        return (
                          <option key={index}>{answer.answer_content}</option>
                        );
                      })}
                    </Form.Control>
                  </CompDiv>
                ) : task.component_type_id === 2 ? (
                  <Slider
                    className="pc-range-slider"
                    id="slider"
                    direction={compdirection}
                  />
                ) : task.component_type_id === 5 ? (
                  <Rating
                    emptySymbol="far fa-star fa-2x"
                    fullSymbol="fas fa-star fa-2x"
                    id="stars"
                    direction={compdirection}
                  />
                ) : task.component_type_id === 4 ? (
                  <Range
                    className="pc-range-slider"
                    step={10}
                    defaultValue={[20, 30]}
                    id="double_slider"
                    direction={compdirection}
                  />
                ) : (
                  <Rating
                    // initialRating={this.state.squareRating}
                    direction={compdirection}
                    id="rating"
                    stop={10}
                    emptySymbol={[1, 2, 3, 4, 5 , 6, 7, 8, 9, 10].map((n) => (
                      <span className="theme-bar-square">
                        <span>{n}</span>
                      </span>
                    ))}
                    fullSymbol={[1, 2, 3, 4, 5 , 6, 7, 8, 9, 10].map((n) => (
                      <span className="theme-bar-square">
                        <span className="active">{n}</span>
                      </span>
                    ))}
                    onChange={(rate) => this.setState({ squareRating: rate })}
                  />
                )}
              </Div>
            </ThemeProvider>
          ),
        });
      } else if (task.component_type_id === 3 || task.component_type_id === 8) {
        let type = "radio";
        if (task.component_type_id === 8) {
          type = "checkbox";
        }
        console.log(theme.dir);
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div key={"task" + index}>
                <h4>{task.label}</h4>
                <Form>
                  {task.answers.map((answer, index) => (
                    <CompDiv key={index}>
                      <Form.Group key={index}>
                        <Row>
                          <Form.Control
                            style={{ width: "16px", hight: "16px" }}
                            type={type}
                            key={index}
                            id={answer.answer_id} //answer_id
                            name={"ans"}
                            // value={actual_index} //order_ key.
                          />
                          <Form.Label
                            style={{ position: "relative", padding: "6px" }}
                          >
                            {"  " + answer.answer_content + "  "}
                          </Form.Label>
                        </Row>
                      </Form.Group>
                    </CompDiv>
                  ))}
                </Form>
                {/* {task.answers.map(function (answer, index) {
                  return (
                    <CompDiv key={index}>
                      <p>
                        <input
                          // className="input_preview"

                          type={type}
                          key={index}
                          name="ans"
                        />
                        {" " + answer.answer_content}
                      </p>
                    </CompDiv>
                  );
                })} */}
              </Div>
            </ThemeProvider>
          ),
        });
      } else if (
        task.component_type_id === 9 ||
        task.component_type_id === 10
      ) {
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div key={"task" + index}>
                <h4>{task.label}</h4>
                {task.component_type_id === 9 ? (
                  <CompDiv class="number">
                    <span class="minus">-</span>
                    <input id="counter" type="text" value="1" />
                    <span class="plus">+</span>
                  </CompDiv>
                ) : task.component_type_id === 10 ? (
                  <h1>Timeline</h1>
                ) : null}
              </Div>
            </ThemeProvider>
          ),
        });
      }
    });
    // });
  }

  render() {
    // console.log(this.state);
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }
    // console.log(this.state);
    return (
      <Aux>
        <div className={mainClass.join(" ")}>
          <Form>
            <Card
              style={{
                width: "90%",
                marginTop: "8%",
                marginLeft: "5%",
                hight: "100%",
              }}
            >
              <Card.Body style={{ marginLeft: "3%", marginRight: "3%" }}>
                <ListGroup.Item>
                  {this.state.pageOfComponents.map((item, index) => (
                    <div
                      style={{
                        marginBottom: "2%",
                        padding: "1%",
                      }}
                      key={index}
                    >
                      {item}
                    </div>
                  ))}
                  <Pagination
                    items={this.state.inputList}
                    onChangePage={this.onChangePage}
                    onCreateUser={this.onCreateUser}
                    pageSize={2}
                    is_next={
                      this.state.demo_answers.length ===
                        this.state.total_answer && !this.state.isError
                    }
                    lang={this.state.lang}
                  />
                </ListGroup.Item>
              </Card.Body>
            </Card>
          </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
