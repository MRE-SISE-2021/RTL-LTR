import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, Button } from "react-bootstrap";
import Card from "../../App/components/MainCard";
import { MDBIcon } from "mdbreact";
import Input from "../PagesInput";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import QuestionsInput from "../QuestionsInput";
import NavBar from "../NavBars/NavBarExp";

class ComponentsTable extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = { inputList: [] };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.onAddBtnClick2 = this.onAddBtnClick2.bind(this);
  }

  componentWillReceiveProps(propsIncoming) {
    //Edit EXP
    const id = propsIncoming.expId;
    let inputListNew = [];
    if (propsIncoming.tasks.length > 0) {
      propsIncoming.tasks.forEach((task, index) => {
        const task_id = task.task_id;
        const task_title = task.task_title;
        task.components.forEach((comp) => {
          // console.log(inputList);
          if (
            comp.component_type === "Welcome" ||
            comp.component_type === "Thank You" ||
            comp.component_type === "Explanation"
          ) {
            console.log(comp.component_id);
            // this.addTasks(comp.component_type, comp.label);

            inputListNew = inputListNew.concat(
              <Input
                key={inputListNew.length}
                name={comp.component_type}
                expId={id}
                keyOrder={index}
                label={comp.label}
                taskId={task_id}
                // title={}
                compId={comp.component_id}
              />
            );
            // console.log("heyyyyyyyyy");
          } else if (
            comp.component_type === "Range" ||
            comp.component_type === "Text"
          ) {
            // this.addTasksQuestions(comp.component_type, comp.label, comp.title);
            // console.log(task_title);

            inputListNew = inputListNew.concat(
              <QuestionsInput
                key={inputListNew.length}
                name={comp.component_type}
                expId={id}
                keyOrder={index}
                label={comp.label}
                taskId={task_id}
                title={task_title}
                compId={comp.component_id}
              />
            );
          }
        });
      });
    }
    this.setState({ inputList: inputListNew });
    console.log(this.state);
  }

  //////--- on button clicked add tasks ---///////
  onAddBtnClick(event) {
    const inputList = this.state.inputList;
    const id = this.props.expId;
    this.setState({
      inputList: inputList.concat(
        <Input
          key={this.state.inputList.length}
          name={event.target.id}
          expId={id}
          keyOrder={inputList.length}
        />
      ),
    });
  }

  onAddBtnClick2(event) {
    // event.persist();
    const inputList = this.state.inputList;
    const id = this.props.expId;
    this.setState({
      inputList: inputList.concat(
        <QuestionsInput
          key={inputList.length}
          name={event.target.id}
          expId={id}
          keyOrder={inputList.length}
        />
      ),
    });
  }

  UNSAFE_componentWillMount() {
    if (
      this.props.windowWidth > 992 &&
      this.props.windowWidth <= 1024 &&
      this.props.layout !== "horizontal"
    ) {
      this.props.onComponentWillMount();
    }
  }

  mobileOutClickHandler() {
    if (this.props.windowWidth < 992 && this.props.collapseMenu) {
      this.props.onComponentWillMount();
    }
  }

  render() {
    console.log(this.props.tasks.length);

    let navClass = ["pcoded-navbar"];

    navClass = [...navClass, this.props.layoutType];

    if (this.props.layout === "horizontal") {
      navClass = [...navClass, "theme-horizontal"];
    } else {
      if (this.props.navFixedLayout) {
        navClass = [...navClass, "menupos-fixed"];
      }

      if (this.props.navFixedLayout && !this.props.headerFixedLayout) {
        window.addEventListener("scroll", this.scroll, true);
        window.scrollTo(0, 0);
      } else {
        window.removeEventListener("scroll", this.scroll, false);
      }
    }

    if (this.props.windowWidth < 992 && this.props.collapseMenu) {
      navClass = [...navClass, "mob-open"];
    } else if (this.props.collapseMenu) {
      navClass = [...navClass, "navbar-collapsed"];
    }

    console.log(this.state.inputList);
    return (
      <Aux>
        <NavBar
          name={this.props.name}
          type={this.props.type}
          lang={this.props.lang}
          tasks={this.state.inputList}
        />
        <div
          style={{
            marginTop: "10%",
          }}
        >
          {this.state.inputList.map(function (input, index) {
            return input;
          })}
        </div>
        <nav
          className={navClass.join(" ")}
          style={{
            width: "300px",
            background: "white",
            position: "fixed",
            top: "0",
            left: "0",
          }}
        >
          <Tabs defaultActiveKey="home">
            <Tab eventKey="home" title={<MDBIcon icon="plus" />}>
              <ul
                style={{
                  width: "300px",
                  textAlign: "center",
                }}
                className="list-group list-group-full"
              >
                <h5>Genral forms</h5>
                <li className="list-group-item">
                  <Button
                    id="Welcome"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file-text" /> Welcome Page
                  </Button>
                </li>
                <li className="list-group-item">
                  <Button
                    id="Explanation"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file-text" /> Explanation page
                  </Button>
                </li>
                <li className="list-group-item">
                  <Button
                    id="Thank You"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file-text" /> Thank you page
                  </Button>
                </li>
                <br />
                <h5>Text Based</h5>

                <li className="list-group-item">
                  <Button
                    id="Range"
                    onClick={this.onAddBtnClick2}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Range
                  </Button>
                </li>
                <li className="list-group-item">
                  <Button
                    id="Text"
                    onClick={this.onAddBtnClick2}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Text
                  </Button>
                </li>
              </ul>{" "}
            </Tab>
            <Tab eventKey="profile" title={<MDBIcon icon="cog" />}>
              <p>SETTINGS TAB.</p>
            </Tab>
          </Tabs>
        </nav>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComponentsTable);
