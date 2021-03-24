import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, Form, Button, Row } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import NavBar from "../NavBars/NavBarExp";
import Task from "../UI-Elements/Task";
import "../../styles/ComponentsTableStyle.css";
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
            lang={this.props.lang}
            keyOrder={index}
            label={task.label}
            taskId={task_id}
            title={task_title}
            compTypeId={task.component_type_id}
            answers={task.answers}
            is_add_picture_setting={task.is_add_picture_setting}
            is_direction_setting={task.is_direction_setting}
            is_new_page_setting={task.is_new_page_setting}
            is_required_setting={task.is_required_setting}
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
            width: "20%",
            background: "white",
            position: "fixed",
            top: "2%",
            left: "1%",
            overflow: "auto",
            overflowX: "hidden",
          }}
        >
          <Tabs className="nav-justified" defaultActiveKey="home">
            <Tab eventKey="home" title={<MDBIcon icon="plus" />}>
              <ul
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
                className="mt-4 list-group list-group-full"
              >
                <h5>Genral forms</h5>
                <li className=" list-group-item">
                  <Button
                    id="1"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file-text" /> New Page
                  </Button>
                </li>
                <br />
                <h5>Choice Based</h5>

                <li className="list-group-item">
                  <Button
                    id="3"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Radio
                  </Button>
                </li>
                <li className="list-group-item">
                  <Button
                    id="7"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Dropdown
                  </Button>
                </li>
                <li className="list-group-item">
                  <Button
                    id="8"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Checkbox
                  </Button>
                </li>
                <br />
                <h5>Sliders</h5>
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

                <li className="list-group-item">
                  <Button
                    id="9"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> Counter
                  </Button>
                </li>
                <li className="list-group-item">
                  <Button
                    id="10"
                    onClick={this.onAddBtnClick}
                    variant="outline-info"
                  >
                    <i className="feather icon-file" /> TimeLine
                  </Button>
                </li>
              </ul>
            </Tab>
            <Tab eventKey="profile" title={<MDBIcon icon="id-card" />}>
              <ul
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
                className="mt-4 list-group list-group-full"
              >
                <h5>Demographic Questions tab</h5>

                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={1}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">Gender</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={2}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">Age</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={3}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">Mother tounge</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={4}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">
                    Language proficiency
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={5}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">
                    RTL|LTR proficiency
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={6}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">Domiant hand</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={7}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">With RTL</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={8}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">With LTR</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={9}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">Hci</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id={10}
                    defaultChecked
                    // onChange={this.onAnswerchange}
                  />
                  <Form.Label className="label_demo">
                    Other languages
                  </Form.Label>
                </Row>
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
