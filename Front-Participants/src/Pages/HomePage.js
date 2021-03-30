import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import API from "../Api/Api";
import { Card, ListGroup, Form } from "react-bootstrap";
import Rating from "react-rating";
import Slider from "rc-slider";
import { format } from "date-fns";

//RTL
import styled, { ThemeProvider } from "styled-components";
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
  constructor() {
    super();
    this.state = {
      tasks: [], //what we get from db
      inputList: [], //what we show to the user
      pageOfComponents: [], // show on one page
      name: "",
      lang: "",
      type: "",
      direction: "LTR",
      demographic_task: [],
      demographic: {},
      demo_answers: [],
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onUpdateDemoAnswer = this.onUpdateDemoAnswer.bind(this);
    this.onCreateUser = this.onCreateUser.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
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
      questionnaire_id: "1", //
      questionnaire_start: format(new Date(), "yyyy-MM-dd kk:mm:ss"),
    };
    console.log(response);
    API.postRequest("participant-data", response).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      // this.setState({ expId: data.questionnaire_id });
    });
  }
  onUpdateDemoAnswer(answer) {
    // update state with new answer from Task component
    let order_key = answer.order_key;
    let answers = this.state.demo_answers;
    let answer_id = answer.answer_id;
    let arr = [];
    // to add answer to check box list
    if (order_key === "2" || order_key === "4" || order_key === "10") {
      for (let [i, ans] of answers.entries()) {
        if (ans.order_key === order_key) {
          arr = ans.answer_ids;
          answers[i] = {
            answer_ids: arr.concat(parseInt([answer_id])),
            order_key: parseInt(order_key),
          };
          this.setState({
            demo_answers: answers,
          });
          return;
        }
      }
    }
    arr = arr.concat(parseInt([answer_id]));
    this.setState({
      demo_answers: this.state.demo_answers.concat({
        answer_ids: arr,
        order_key: parseInt(order_key),
      }),
    });
    console.log(this.state);
  }

  async componentDidMount() {
    await axiosInstance
      .get("questionnaire-preview-data/" + "1", {
        params: {
          language: "2",
        },
      })
      .then(
        (result) => {
          result = result.data;
          console.log(result);
          this.setState(() => ({
            tasks: result.tasks,
            name: result.questionnaire_name,
            type: result.questionnaire_type_id,
            lang: result.language_id,
            direction: result.direction,
            demographic_task: result.demographic_task,
            // demographic: {
            //   is_age_demo: result.is_age_demo,
            //   is_native_demo: result.is_native_demo,
            //   is_other_demo: result.is_other_demo,
            //   is_knowledge_demo: result.is_knowledge_demo,
            //   is_daily_demo: result.is_daily_demo,
            //   is_writing_demo: result.is_writing_demo,
            //   is_mobile_demo: result.is_mobile_demo,
            //   is_mouse_demo: result.is_mouse_demo,
            //   is_design_demo: result.is_design_demo,
            //   is_hci_demo: result.is_hci_demo,
            //   is_develop_demo: result.is_develop_demo,
            // },
            demographic: [
              result.is_age_demo,
              result.is_native_demo,
              result.is_other_demo,
              result.is_knowledge_demo,
              result.is_daily_demo,
              result.is_writing_demo,
              result.is_mobile_demo,
              result.is_mouse_demo,
              result.is_design_demo,
              result.is_hci_demo,
              result.is_develop_demo,
            ],
          }));
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );

    this.putInputList();
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
      console.log(task.label);
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
      if (task.is_new_page_setting || task.component_type_id === 1) {
        this.setState({
          inputList: inputList.concat(<div></div>),
        });
        inputList = this.state.inputList;
      }
      ///////////////---RTL support --- ///////////////

      const Div = styled.div`
        border: 2px solid BLACK;
        background: gainsboro;
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
      if (task.component_type_id === 1) {
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div
                key="1"
                dir={theme.dir}
                dangerouslySetInnerHTML={{ __html: task.label }}
              ></Div>
            </ThemeProvider>
          ),
        });
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
                {this.state.demographic_task.map((demo, i) => {
                  console.log("Entered");
                  console.log(this.state.demographic[i]);
                  // Return the element. Also pass key
                  if (this.state.demographic[i]) {
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
        console.log(task.is_direction_setting);

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
                ) : (
                  task.answers.map(function (answer, index) {
                    return (
                      <div key={index} dir={theme.dir}>
                        {answer.answer_content}:
                        {task.component_type_id === 2 ? (
                          <CompDiv>
                            <Slider
                              // className="pc-range-slider"
                              id="slider"
                              style={{ flexDirection: "col-reverse" }}
                            />
                          </CompDiv>
                        ) : task.component_type_id === 5 ? (
                          <Rating
                            emptySymbol="far fa-star fa-2x"
                            fullSymbol="fas fa-star fa-2x"
                            id="stars"
                            direction={compdirection}
                            onChange={() => this.onInputchange}
                          />
                        ) : task.component_type_id === 4 ? (
                          <CompDiv>
                            <Range
                              className="pc-range-slider"
                              step={10}
                              defaultValue={[20, 30]}
                              id="double_slider"
                              direction={compdirection}
                            />
                          </CompDiv>
                        ) : (
                          <Rating
                            // initialRating={this.state.squareRating}
                            direction={compdirection}
                            id="rating"
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
                        )}
                      </div>
                    );
                  })
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
                {task.answers.map(function (answer, index) {
                  return (
                    <CompDiv key={index}>
                      <input
                        // className="input_preview"

                        type={type}
                        key={index}
                        name="ans"
                      />
                      {answer.answer_content}
                    </CompDiv>
                  );
                })}
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
          <Aux>
            <Card
              border="primary"
              style={{
                border: "2px solid ",
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
                    lang={this.state.lang}
                  />
                </ListGroup.Item>
              </Card.Body>
            </Card>
          </Aux>
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
