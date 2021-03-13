import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import NavBar from "../NavBars/NavBarExp";
import Task from "../UI-Elements/Task";
class ComponentsTable extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = { inputList: [] };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
  }

  componentWillReceiveProps(propsIncoming) {
    //Edit EXP
    const id = propsIncoming.expId;
    let inputListNew = [];
    if (propsIncoming.tasks.length > 0) {
      propsIncoming.tasks.forEach((task, index) => {
        console.log(task);
        const task_id = task.task_id;
        const task_title = task.task_title;

        inputListNew = inputListNew.concat(
          <Task
            key={index}
            expId={id}
            keyOrder={index}
            label={task.label}
            taskId={task_id}
            title={task_title}
            compTypeId={task.component_type_id}
            answers={task.answers}
          />
        );
        // }
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
        <Task
          key={inputList.length}
          compTypeId={parseInt(event.target.id)}
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
    // console.log(this.props.tasks.length);

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

    // console.log(this.state.inputList);
    return (
      <Aux>
        <NavBar
          name={this.props.name}
          type={this.props.type}
          lang={this.props.lang}
          tasks={this.state.inputList}
          expId={this.props.expId}
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
                    id="1"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file-text" /> New Page
                  </Button>
                </li>
                <br />
                <h5>Text Based</h5>

                <li className="list-group-item">
                  <Button
                    id="3"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Text
                  </Button>
                </li>

                <br />
                <h5>Range Sliders</h5>
                <li className="list-group-item">
                  <Button
                    id="2"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Slider
                  </Button>
                </li>
                <li className="list-group-item">
                  <Button
                    id="4"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" />
                    Double Slider
                  </Button>
                </li>
                <h5>Rating</h5>

                <li className="list-group-item">
                  <Button
                    id="5"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Stars
                  </Button>
                </li>
                <li className="list-group-item">
                  <Button
                    id="6"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Numeric
                  </Button>
                </li>
              </ul>
            </Tab>
            <Tab eventKey="profile" title={<MDBIcon icon="cog" />}>
              <ul
                style={{
                  width: "300px",
                  textAlign: "center",
                }}
                className="list-group list-group-full"
              >
                <h5>Settings Tab</h5>
                <br />

                <Form style={{ textAlign: "left", color: "black" }}>
                  <Form.Check
                    type="switch"
                    id="rtl-switch"
                    label="RTL/LTR customazation"
                  />
                  <br />
                  <Form.Check
                    type="switch"
                    label="is required"
                    id="is-required-switch"
                  />
                  <br />

                  <Form.Check
                    type="switch"
                    id="new-page-switch"
                    label="Open on a new page"
                  />
                  <br />

                  <Form.Check
                    type="switch"
                    id="picture-switch"
                    label="Add picture under the question"
                  />
                </Form>
              </ul>
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
