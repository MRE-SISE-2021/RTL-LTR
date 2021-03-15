import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import NavBar from "../Components/NavBars/NavBarExp";
// import PreviewResponse from "../Api/mocks/PreviewResponse";
// cookies
import { withCookies } from "react-cookie";
import { Card, ListGroup } from "react-bootstrap";

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
      }
      // else if (task.component_type === "Explanation") {
      //   this.setState({
      //     inputList: inputList.concat(
      //       <div
      //         key="explain"
      //         dangerouslySetInnerHTML={{ __html: task.label }}
      //       ></div>
      //     ),
      //   });
      // }
      else if (task.component_type_id === 2) {
        this.setState({
          inputList: inputList.concat(
            <div key={"range" + index}>
              <h3>--- {task.task_title} ---</h3>
              <h4>{task.label}</h4>
              {task.answers.map(function (answer, index) {
                // return <p>{answer.answer_content}</p>;
                // console.log(answer.answer_content);
                return (
                  <div key={index}>
                    {answer.answer_content}
                    <input
                      key={"range" + index}
                      type="range"
                      className="custom-range"
                      defaultValue="22"
                      id="customRange1"
                    />{" "}
                  </div>
                );
              })}
            </div>
          ),
        });
      } else if (task.component_type_id === 3) {
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
                    <input type="radio" key={index} name="ans" />
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
          prev={true}
        />

        <div className={mainClass.join(" ")}>
          <div className="pcoded-main-container full-screenable-node">
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Aux>
                        <Card
                          border="info"
                          style={{ border: "2px solid ", width: "50rem" }}
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
                              {this.state.inputList.map(function (
                                input,
                                index
                              ) {
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
  connect(mapStateToProps, mapDispatchToProps)(ExperimentPage)
);
