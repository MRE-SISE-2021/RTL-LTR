import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import NavBar from "../Components/NavBars/NavBarExp";

class ExperimentPage extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      inputList: [],
      name: "",
      lang: "",
      type: "",
    };
  }
  // UNSAFE_componentWillMount() {
  //   if (
  //     this.props.windowWidth > 992 &&
  //     this.props.windowWidth <= 1024 &&
  //     this.props.layout !== "horizontal"
  //   ) {
  //     this.props.onComponentWillMount();
  //   }
  // }

  // mobileOutClickHandler() {
  //   if (this.props.windowWidth < 992 && this.props.collapseMenu) {
  //     this.props.onComponentWillMount();
  //   }
  // }

  async componentDidMount() {
    //////
    await fetch(
      "http://127.0.0.1:8000/viewset/questionnaire/" +
        this.props.match.params.id +
        "/"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log(result);
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
    // window.addEventListener("resize", this.resize);
  }

  putInputList() {
    // alert("here");
    // console.log(this.state.tasks);

    this.state.tasks.forEach((task, index) => {
      // console.log(task);
      const inputList = this.state.inputList;
      ///////
      task.components.forEach((component, index) => {
        if (component.component_type === "Welcome") {
          this.setState({
            inputList: inputList.concat(
              <div
                key="welcome"
                dangerouslySetInnerHTML={{ __html: component.label }}
              ></div>
            ),
          });
        } else if (component.component_type === "Explanation") {
          this.setState({
            inputList: inputList.concat(
              <div
                key="explain"
                dangerouslySetInnerHTML={{ __html: component.label }}
              ></div>
            ),
          });
        } else if (component.component_type === "Range") {
          this.setState({
            inputList: inputList.concat(
              <div key={"range" + index}>
                <p>{component.label}</p>
                <input
                  type="range"
                  className="custom-range"
                  defaultValue="22"
                  id="customRange1"
                />
              </div>
            ),
          });
        } else if (component.component_type === "Text") {
          this.setState({
            inputList: inputList.concat(
              <div>
                <p>{component.label}</p>
                <input
                  type="text"
                  className="custom-range"
                  // defaultValue="22"
                  id="customRange1"
                />
              </div>
            ),
          });
        } else {
          this.setState({
            inputList: inputList.concat(
              <div
                key="thaks"
                dangerouslySetInnerHTML={{ __html: component.label }}
              ></div>
            ),
          });
        }
      });

      // switch (task.component_type) {
      //   case "Welcome":
      //     this.setState({
      //       inputList: inputList.concat(<h1> Welcome</h1>),
      //     });
      //   case "Explanation":
      //     this.setState({
      //       inputList: inputList.concat(<h1> Explanation</h1>),
      //     });
      //   default:
      //     this.setState({
      //       inputList: inputList.concat(<h1> Default</h1>),
      //     });
      // }

      /////
    });
    // console.log(this.state.inputList);
  }

  render() {
    // console.log(this.props.match.params.id);
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }
    // console.log(this.state.tasks);
    // console.log(this.state.inputList);

    return (
      <Aux>
        <NavBar
          name={this.state.name}
          type={this.state.type}
          lang={this.state.lang}
        />
        <div className={mainClass.join(" ")}>
          <div className="pcoded-main-container full-screenable-node">
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Aux>
                        {this.state.inputList.map(function (input, index) {
                          return input;
                          // alert(index);
                        })}
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentPage);
