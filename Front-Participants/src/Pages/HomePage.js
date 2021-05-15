import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import API from "../Api/Api";
import Stats from "../Api/Stats";
import { Card, ListGroup, Form, Row } from "react-bootstrap";
import Rating from "react-rating";
import Slider from "rc-slider";
import { format } from "date-fns";
//import CounterInput from 'react-bootstrap-counter';
import CounterInput from "react-counter-input";

//RTL
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
//new Page
import Pagination from "../Components/Pagination";
import "../styles/PreviewPage.css";
import Task from "../Components/Task";

import "../App.css";

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
      demo_answers: {},
      answers: {},
      total_answer: props.data.demographic_task.length - 3,
      isError: true,
      statsInfo: {},
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onDemochange = this.onDemochange.bind(this);
    this.onUpdateDemoAnswer = this.onUpdateDemoAnswer.bind(this);
    this.onCreateUser = this.onCreateUser.bind(this);
    this.onUpdateUser = this.onUpdateUser.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.setDemoUI = this.setDemoUI.bind(this);
    this.deleteFromArray = this.deleteFromArray.bind(this);
  }

  componentDidMount() {
    //call get stats!!!!!!
    Stats.getGeoInfo().then((result) => {
      this.setState({
        statsInfo: {
          ...this.state.statsInfo,
          country: result.country_name,
          city: result.city,
        },
      });
    });
    let browser = Stats.getBrowser(window);
    let opt = Stats.getOperatingSystem(window);
    this.setState({
      statsInfo: {
        ...this.state.statsInfo,
        browser: browser,
        operating_system: opt,
      },
    });
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
      statsInfo: this.state.statsInfo,
      hash: this.props.hosted_link,
      test_started: format(new Date(), "yyyy-MM-dd kk:mm:ss"),
    };
    console.log(response);
    API.postRequest("participant-data", response).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      this.setState({ participant_id: data.participant_id });
    });
  }

  onUpdateUser(final) {
    // put Request!
    console.log("Put --- request --- update user answers");
    let response = {
      participant_id: this.state.participant_id,
      answers: this.state.answers,
      hash: this.props.hosted_link,
      // test_started: format(new Date(), "yyyy-MM-dd kk:mm:ss"),
    };
    if (final !== undefined) {
      response.test_completed = format(new Date(), "yyyy-MM-dd kk:mm:ss");
    }
    this.setState({ answers: {} });
    console.log(response);
    API.putRequest(
      "participant-data/" + this.state.participant_id,
      response
    ).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      // this.setState({ expId: data.questionnaire_id });
    });
  }
  onUpdateDemoAnswer(answer) {
    //input isnt correct?
    if (answer.isError !== undefined) {
      this.setState({ isError: answer.isError });
    }

    // update state with new answer from Task component
    let order_key = parseInt(answer.order_key);
    let answer_id = parseInt(answer.answer_id);
    let task_id = parseInt(answer.task_id);
    let free_answer = answer.free_answer;
    let checked = answer.checked;
    debugger;
    //value -- is answer id
    if (order_key === 9) {
      if (this.setDemoUI(answer.index)) {
        return;
      }
    }
    //checkbox answer
    if (checked !== undefined) {
      //other - checkbox answer
      if (free_answer !== undefined) {
        this.onDemochange(
          task_id,
          order_key,
          free_answer,
          "other-check",
          checked
        );
        return;
      }
      //regular checkbox answer
      this.onDemochange(task_id, order_key, answer_id, "check", checked);
      return;
    }
    //free answer
    if (free_answer !== undefined) {
      this.onDemochange(task_id, order_key, free_answer, "other");
      return;
    }

    this.onDemochange(task_id, order_key, answer_id, "radio");
  }

  //change vlaue of demographics questions
  onDemochange(id, order_key, value, type, checked) {
    //insert a question first vlaue
    if (this.state.demo_answers[id] === undefined) {
      //answer_id -- radio + dropdown
      if (type === "radio") {
        this.setState({
          demo_answers: {
            ...this.state.demo_answers,
            [id]: {
              order_key: order_key,
              answer_id: value,
            },
          },
        });
        return;
      }

      //checkbox?
      if (type === "other-check") {
        if (checked) {
          this.setState({
            demo_answers: {
              ...this.state.demo_answers,
              [id]: {
                order_key: order_key,
                submitted_free_answer: value,
              },
            },
          });
          return;
        }
      }
      if (type === "check") {
        this.setState({
          demo_answers: {
            ...this.state.demo_answers,
            [id]: {
              order_key: order_key,
              [value]: checked,
            },
          },
        });
        return;
      }

      //update regular questions
      this.setState({
        demo_answers: {
          ...this.state.demo_answers,
          [id]: {
            order_key: order_key,
            submitted_free_answer: value,
          },
        },
      });
    } else {
      // update values
      let answers = this.state.demo_answers;
      answers[id].order_key = order_key;
      if (type === "check") {
        answers[id][value] = checked;
      } else if (type === "radio") {
        answers[id].answer_id = value;
      } else {
        answers[id].submitted_free_answer = value;
      }
      this.setState({
        demo_answers: answers,
      });
    }
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
    if (value === 0) {
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

  //save answer per component
  //value -- is answer id for (comp_type = checkbox/select/radio)
  onInputchange(id, type, value, direction, checked) {
    // debugger;
    //insert a question first vlaue
    if (this.state.answers[id] === undefined) {
      //answer_id -- radio + dropdown
      if (type === 3 || type === 7) {
        this.setState({
          answers: {
            ...this.state.answers,
            [id]: {
              comp_type: type,
              answer_id: value,
              task_direction: direction,
              task_clicks: 1,
            },
          },
        });
        return;
      }

      //checkbox?
      if (type === 8) {
        this.setState({
          answers: {
            ...this.state.answers,
            [id]: {
              comp_type: type,
              [value]: checked,
              task_direction: direction,
              task_clicks: 1,
            },
          },
        });
        return;
      }

      //update regular questions
      this.setState({
        answers: {
          ...this.state.answers,
          [id]: {
            comp_type: type,
            submitted_free_answer: value,
            task_direction: direction,
            task_clicks: 1,
          },
        },
      });
    } else {
      // update values
      let answers = this.state.answers;
      answers[id].comp_type = type;
      answers[id].task_direction = direction;
      answers[id].task_clicks = answers[id].task_clicks + 1;
      if (type === 8) {
        answers[id][value] = checked;
      } else if (type === 3 || type === 7) {
        answers[id].answer_id = value;
      } else {
        answers[id].submitted_free_answer = value;
      }
      this.setState({
        answers: answers,
      });
    }
  }

  putInputList() {
    console.log(this.state);
    this.state.tasks.forEach((task, index) => {
      let inputList = this.state.inputList;
      console.log(task);
      ////Task Comp default Direction
      let compdirection = "rtl";
      let CompDiv = styled.div`
        direction: rtl;
      `;
      //Random value
      let rnd_value = "";
      if (task.is_direction_setting === "RND") {
        let rnd = Math.floor(Math.random() * 2);
        if (rnd === 1) {
          rnd_value = "LTR";
        }
      }
      // if comp direction is LTR
      if (task.is_direction_setting === "LTR" || rnd_value === "LTR") {
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

      let Div = styled.div`
        padding: 10px;
        ${rtl`
        margin-right: 50px;
        text-align: left;
        direction: ltr;
        `};
      `;
      const ConstDiv = styled.div`
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
      let const_theme = {
        dir: "ltr",
      };

      /// alighnment of pages -- not exp
      if (this.state.lang === 1 || this.state.lang === 3) {
        const_theme = {
          dir: "rtl",
        };
      }

      //Random value
      let rnd_value_align = "";
      if (this.state.direction === "RND") {
        let temp = Math.floor(Math.random() * 3);
        if (temp === 1) {
          rnd_value_align = "RTL";
        } else if (temp === 2) {
          rnd_value_align = "Cntr";
        }
      }
      //Alignemt of all exp
      if (
        this.state.direction === "RTL" ||
        (this.state.direction === "RND" && rnd_value_align === "RTL")
      ) {
        theme = {
          dir: "rtl",
        };
      } else if (
        this.state.direction === "Cntr" ||
        (this.state.direction === "RND" && rnd_value_align === "Cntr")
      ) {
        Div = styled.div`
          text-align: center;
        `;
        Div = styled.div`
          text-align: center;
        `;
        if (this.state.lang === 1 || this.state.lang === 3) {
          Div = styled.div`
            text-align: center;
            direction: rtl;
          `;
          if (task.is_direction_setting === "LTR") {
            CompDiv = styled.div`
              margin-right: 35%;
              direction: ltr;
            `;
          } else {
            CompDiv = styled.div`
              margin-right: 35%;
            `;
          }
        } else {
          Div = styled.div`
            text-align: center;
            direction: ltr;
          `;
          if (task.is_direction_setting === "RTL") {
            CompDiv = styled.div`
              margin-left: 35%;
              direction: rtlr;
            `;
          } else {
            CompDiv = styled.div`
              margin-left: 35%;
            `;
          }
        }
      }
      ///////////////---RTL support --- ///////////////
      if (task.component_type_id === 11) {
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={const_theme}>
              <ConstDiv
                key={task.order_key}
                dir={const_theme.dir}
                dangerouslySetInnerHTML={{ __html: task.label }}
              ></ConstDiv>
            </ThemeProvider>
          ),
        });
      } else if (task.component_type_id === 1) {
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={const_theme}>
              <ConstDiv
                key={task.order_key}
                dir={const_theme.dir}
                dangerouslySetInnerHTML={{ __html: task.label }}
              ></ConstDiv>
            </ThemeProvider>
          ),
        });
        // debugger;
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
        // console.log(task);
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div key={"range" + index}>
                <h4>{task.label}</h4>
                {task.component_type_id === 7 ? (
                  <CompDiv style={{ width: "35%" }}>
                    <Form.Control
                      as="select"
                      onChange={(event) => {
                        debugger;
                        this.onInputchange(
                          task.task_id,
                          task.component_type_id,
                          event.target.selectedOptions[0].id, // answer_id
                          task.is_direction_setting
                        );
                      }} //value, task_id, task_comp
                    >
                      {task.answers.map(function (answer, index) {
                        return (
                          <option key={index} id={answer.answer_id}>
                            {answer.answer_content}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </CompDiv>
                ) : task.component_type_id === 2 ? (
                  <CompDiv style={{ width: "35%" }}>
                    <Slider
                      className="pc-range-slider"
                      id="slider"
                      direction={compdirection}
                      onChange={(event) =>
                        this.onInputchange(
                          task.task_id,
                          task.component_type_id,
                          event, // value -- not answer_id
                          task.is_direction_setting
                        )
                      } //value, task_id, task_comp
                    />
                  </CompDiv>
                ) : task.component_type_id === 5 ? (
                  <Rating
                    emptySymbol="far fa-star fa-2x"
                    fullSymbol="fas fa-star fa-2x"
                    id="stars"
                    direction={compdirection}
                    onChange={(event) =>
                      this.onInputchange(
                        task.task_id,
                        task.component_type_id,
                        event, // value -- not answer_id
                        task.is_direction_setting
                      )
                    } //value, task_id, task_comp
                  />
                ) : task.component_type_id === 4 ? (
                  <CompDiv style={{ width: "35%" }}>
                    <Range
                      className="pc-range-slider"
                      step={10}
                      defaultValue={[20, 30]}
                      id="double_slider"
                      direction={compdirection}
                      onChange={(event) =>
                        this.onInputchange(
                          task.task_id,
                          task.component_type_id,
                          event, // value -- not answer_id
                          task.is_direction_setting
                        )
                      } //value, task_id, task_comp
                    />
                  </CompDiv>
                ) : (
                  <Rating
                    // initialRating={this.state.squareRating}
                    direction={compdirection}
                    id="rating"
                    stop={10}
                    emptySymbol={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <span className="theme-bar-square">
                        <span>{n}</span>
                      </span>
                    ))}
                    fullSymbol={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <span className="theme-bar-square">
                        <span className="active">{n}</span>
                      </span>
                    ))}
                    //onChange={(rate) => this.setState({ squareRating: rate })}
                    onChange={(event) =>
                      this.onInputchange(
                        task.task_id,
                        task.component_type_id,
                        event, // value -- not answer_id
                        task.is_direction_setting
                      )
                    } //value, task_id, task_comp
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
                    <CompDiv
                      key={task.order_key + " " + index}
                      style={{ width: "35%" }}
                    >
                      <Form.Group key={index}>
                        <Row>
                          <Form.Control
                            style={{ width: "16px", hight: "16px" }}
                            type={type}
                            key={index}
                            id={answer.answer_id} //answer_id
                            name={"ans"}
                            value={answer.answer_content} //order_ key.
                            onChange={(event) =>
                              this.onInputchange(
                                task.task_id,
                                task.component_type_id,
                                event.target.id, // value -- not answer_id
                                task.is_direction_setting,
                                event.target.checked
                              )
                            } //value, task_id, task_comp
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
                  <CompDiv style={{ width: "35%" }}>
                    <CounterInput
                      className="number"
                      value={2}
                      min={1}
                      max={50}
                      onCountChange={(event) =>
                        this.onInputchange(
                          task.task_id,
                          task.component_type_id,
                          event, // value -- not answer_id
                          task.is_direction_setting
                        )
                      } //value, task_id, task_comp
                    />
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
    console.log(this.state);
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
                    onUpdateUser={this.onUpdateUser}
                    pageSize={2}
                    is_next={
                      Object.keys(this.state.demo_answers).length ===
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
