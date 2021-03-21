import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import NavBar from "../Components/NavBars/NavBar";
// import PreviewResponse from "../Api/mocks/PreviewResponse";
// cookies
import { withCookies } from "react-cookie";
import { Card, ListGroup, Form } from "react-bootstrap";
import Rating from "react-rating";
import Slider from "rc-slider";
//import { ThemeProvider } from "styled-components";
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";

import Pagination from "../Pagination";

import axiosInstance from "../axios";
import "../styles/PreviewPage.css";

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
    };
    this.onChangePage = this.onChangePage.bind(this);
  }
  onChangePage(pageOfComponents) {
    // update state with new page of items
    this.setState({ pageOfComponents: pageOfComponents });
  }

  async componentDidMount() {
    await axiosInstance
      .get("viewset/questionnaire/" + this.props.match.params.id + "/")
      .then(
        (result) => {
          result = result.data;
          this.setState(() => ({
            tasks: result.tasks,
            name: result.questionnaire_name,
            type: result.questionnaire_type_id,
            lang: result.language_id,
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
      const inputList = this.state.inputList;
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
      if (task.is_direction_setting) {
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
                <h3>--- {task.task_title} ---</h3>
                <h4>{task.label}</h4>
                {task.component_type_id === 7 ? (
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Control as="select">
                      {task.answers.map(function (answer, index) {
                        return (
                          <option key={index}>{answer.answer_content}</option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                ) : (
                  task.answers.map(function (answer, index) {
                    return (
                      <div key={index} dir={theme.dir}>
                        {answer.answer_content}:
                        {task.component_type_id === 2 ? (
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
                        ) : task.component_type_id === 5 ? (
                          <Rating
                            emptySymbol="far fa-star fa-2x"
                            fullSymbol="fas fa-star fa-2x"
                          />
                        ) : task.component_type_id === 4 ? (
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
                        ) : (
                          <Rating
                            // initialRating={this.state.squareRating}
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
                <h3>--- {task.task_title} ---</h3>
                <h4>{task.label}</h4>{" "}
                {task.answers.map(function (answer, index) {
                  // return <p>{answer.answer_content}</p>;
                  // console.log(answer.answer_content);
                  return (
                    <div key={index}>
                      <input type={type} key={index} name="ans" />
                      {answer.answer_content}
                    </div>
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
            <div key={"task" + index}>
              <h3>--- {task.task_title} ---</h3>
              <h4>{task.label}</h4>{" "}
              {task.component_type_id === 9 ? (
                <div class="number">
                  <span class="minus">-</span>
                  <input id="counter" type="text" value="1" />
                  <span class="plus">+</span>
                </div>
              ) : task.component_type_id === 10 ? (
                <h1>Timeline</h1>
              ) : null}
            </div>
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
        <NavBar
          name={this.state.name}
          type={this.state.type}
          lang={this.state.lang}
          taskId={this.props.match.params.id}
        />

        <div className={mainClass.join(" ")}>
          <Aux>
            <Card
              border="info"
              style={{
                border: "2px solid ",
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
