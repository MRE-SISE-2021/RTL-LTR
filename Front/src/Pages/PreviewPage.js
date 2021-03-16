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
const createSliderWithTooltip = Slider.createSliderWithTooltip;

const Range = createSliderWithTooltip(Slider.Range);

class ExperimentPage extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [], //what we get from db
      inputList: [], //what we show to the user
      name: "",
      lang: "",
      type: "",
    };
  }
  async componentDidMount() {
    // cookies
    const { cookies } = this.props;
    // const tasks = PreviewResponse.tasks;

    // console.log(this.state);
    //////
    await fetch(
      "http://127.0.0.1:8000/viewset/questionnaire/" +
        this.props.match.params.id +
        "/",
      {
        headers: new Headers({
          Authorization: `Token ${cookies.cookies.token}`,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
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
    console.log();
    this.state.tasks.forEach((task, index) => {
      // tasks.forEach((task, index) => {
      const inputList = this.state.inputList;
      ///////
      // console.log(task);
      // task.components.forEach((component, index) => {
      if (task.component_type_id === 1) {
        this.setState({
          inputList: inputList.concat(
            <div key="1" dangerouslySetInnerHTML={{ __html: task.label }}></div>
          ),
        });
      } else if (
        task.component_type_id === 2 ||
        task.component_type_id === 5 ||
        task.component_type_id === 6 ||
        task.component_type_id === 4 ||
        task.component_type_id === 7
      ) {
        this.setState({
          inputList: inputList.concat(
            <div key={"range" + index}>
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
                  // return <p>{answer.answer_content}</p>;
                  // console.log(answer.answer_content);
                  return (
                    <div key={index}>
                      {answer.answer_content}
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
            </div>
          ),
        });
      } else if (task.component_type_id === 3 || task.component_type_id === 8) {
        let type = "radio";
        if (task.component_type_id === 8) {
          type = "checkbox";
        }
        this.setState({
          inputList: inputList.concat(
            <div key={"task" + index}>
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
            </div>
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

    return (
      <Aux>
        <NavBar
          name={this.state.name}
          type={this.state.type}
          lang={this.state.lang}
          taskId={this.props.match.params.id}
        />

        <div className={mainClass.join(" ")}>
          {/* <div className="pcoded-main-container full-screenable-node"> */}
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    <Aux>
                      <Card
                        border="info"
                        style={{
                          border: "2px solid ",
                          width: "90%",
                          marginTop: "10%",
                          marginLeft: "5%",
                        }}
                      >
                        <Card.Header
                          className="text-center"
                          style={{ fontSize: "30px" }}
                        >
                          Preview
                        </Card.Header>
                        <Card.Body
                          style={{ marginLeft: "3%", marginRight: "3%" }}
                        >
                          <ListGroup.Item>
                            {this.state.inputList.map(function (input, index) {
                              return input;
                            })}
                          </ListGroup.Item>
                        </Card.Body>
                      </Card>
                    </Aux>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
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
  connect(mapStateToProps, mapDispatchToProps)(ExperimentPage)
);
