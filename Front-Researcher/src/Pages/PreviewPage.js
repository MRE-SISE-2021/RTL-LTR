import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import NavBarPre from "../Components/NavBars/NavBar";
// import PreviewResponse from "../Api/mocks/PreviewResponse";
// cookies
import { withCookies } from "react-cookie";
import { Card, ListGroup, Form, Row } from "react-bootstrap";
import Rating from "react-rating";
import Slider from "rc-slider";
//RTL
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
//new Page
import Pagination from "../Pagination";
//import CounterInput from 'react-bootstrap-counter';
import CounterInput from "react-counter-input";

import axiosInstance from "../axios";
import "../styles/PreviewPage.css";
import Demographics from "../Components/UI-Elements/Demographics";

const createSliderWithTooltip = Slider.createSliderWithTooltip;

const Range = createSliderWithTooltip(Slider.Range);
//

class PreviewPage extends Component {
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
    };
    this.onChangePage = this.onChangePage.bind(this);
  }
  onChangePage(pageOfComponents) {
    // update state with new page of items
    this.setState({ pageOfComponents: pageOfComponents });
  }

  async componentDidMount() {
    await axiosInstance
      .get("questionnaire-preview-data/" + this.props.match.params.id, {
        params: {
          language: this.props.match.params.lang,
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
            demographic: {
              is_age_demo: result.is_age_demo,
              is_native_demo: result.is_native_demo,
              is_other_demo: result.is_other_demo,
              is_knowledge_demo: result.is_knowledge_demo,
              is_daily_demo: result.is_daily_demo,
              is_writing_demo: result.is_writing_demo,
              is_mobile_demo: result.is_mobile_demo,
              is_mouse_demo: result.is_mouse_demo,
              is_design_demo: result.is_design_demo,
              is_hci_demo: result.is_hci_demo,
              is_develop_demo: result.is_develop_demo,
            },
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
      //Random value
      let rnd_value = "";
      if (task.is_direction_setting === "RND") {
        let rnd = Math.floor(Math.random() * 2);
        if (rnd === 1) {
          rnd_value = "LTR";
        }
      }
      debugger;
      // if comp direction is LTR
      if (task.is_direction_setting === "LTR" || rnd_value === "LTR") {
        compdirection = "ltr";
        CompDiv = styled.div`
          direction: ltr;
        `;
      }
      // else if (task.is_direction_setting === "Cntr") {
      //   compdirection = "center";
      //   CompDiv = styled.div`
      //     margin-left: 50%;
      //   `;
      // }
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
      debugger;
      /// alighnment of pages -- not exp
      if (this.state.lang === 1 || this.state.lang === 3) {
        const_theme = {
          dir: "rtl",
        };
      }

      //Random value
      let rnd_value_align = "RTL";
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
        // theme = {
        //   dir: "center",
        // };
        Div = styled.div`
          text-align: center;
        `;
        if (this.state.lang === 1 || this.state.lang === 3) {
          CompDiv = styled.div`
            margin-right: 35%;
          `;
        } else {
          CompDiv = styled.div`
            margin-left: 35%;
          `;
        }
      }
      ///////////////---RTL support --- ///////////////
      if (task.component_type_id === 11) {
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={const_theme}>
              <ConstDiv
                key="11"
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
                key="1"
                dir={const_theme.dir}
                dangerouslySetInnerHTML={{ __html: task.label }}
              ></ConstDiv>
            </ThemeProvider>
          ),
        });
        inputList = this.state.inputList;
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div>
                <Demographics
                  isDemo={this.state.demographic}
                  demoTasks={this.state.demographic_task}
                  lang={this.state.lang}
                />
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
                  <CompDiv style={{ width: "35%" }}>
                    <Form.Control as="select">
                      {task.answers.map(function (answer, index) {
                        return (
                          <option key={index}>{answer.answer_content}</option>
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
                    />
                  </CompDiv>
                ) : task.component_type_id === 5 ? (
                  <Rating
                    emptySymbol="far fa-star fa-2x"
                    fullSymbol="fas fa-star fa-2x"
                    id="stars"
                    direction={compdirection}
                  />
                ) : task.component_type_id === 4 ? (
                  <CompDiv style={{ width: "35%" }}>
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
                      onChange={(value) => {
                        console.log(value);
                      }}
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
        <NavBarPre
          name={this.state.name}
          type={this.state.type}
          lang={this.state.lang}
          taskId={this.props.match.params.id}
        />

        <div className={mainClass.join(" ")}>
          <Aux>
            <Card
              //border="primary"
              style={{
                //border: "2px solid ",
                width: "90%",
                marginTop: "8%",
                marginLeft: "5%",
                hight: "100%",
              }}
            >
              <Card.Header className="text-center" style={{ fontSize: "30px" }}>
                Preview
              </Card.Header>
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

export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(PreviewPage)
);
