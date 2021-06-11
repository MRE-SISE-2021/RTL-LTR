import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab, Form, Button, Row, Col } from "react-bootstrap";
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
    this.state = {
      inputList: [],
      demographic: {},
    };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.onDemoChanged = this.onDemoChanged.bind(this);
    this.updateDelete = this.updateDelete.bind(this);
  }

  //when task button was pressed --> delete task from inputlist
  updateDelete(orderKey) {
    let array = this.state.inputList;
    array.splice(orderKey, 1);
    this.setState({ inputList: array });
  }
  componentWillReceiveProps(propsIncoming) {
    //Edit EXP
    console.log(propsIncoming);
    console.log(propsIncoming.demographic.is_age_demo);
    const id = propsIncoming.expId;
    if (propsIncoming.demographic.is_age_demo !== undefined) {
      this.setState({
        demographic: propsIncoming.demographic,
      });
      console.log(this.state);
    }

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
            dir={this.props.dir}
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
            lang={this.props.lang}
            updateDelete={this.updateDelete}
            images={task.images}
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
          dir={this.props.dir}
          lang={this.props.lang}
          updateDelete={this.updateDelete}
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

  onDemoChanged(event) {
    this.setState({
      demographic: {
        ...this.state.demographic,
        [event.target.id]: event.target.checked,
      },
    });
    console.log(this.state);
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
          dir={this.props.dir}
          demo={this.state.demographic}
          is_active={this.props.is_active}
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
                }}
                className=" list-group list-group-full"
              >
                <div className=" list-group-item">
                  <h5>General forms</h5>

                  <Button
                    id="1"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file-text" /> Welcome Page
                  </Button>
                  <Button
                    id="11"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file-text" /> New Page
                  </Button>
                </div>

                <div className="list-group-item">
                  <h5>Choice Based</h5>

                  <Button
                    id="3"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file" /> Radio
                  </Button>

                  <Button
                    id="7"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file active " /> Dropdown
                  </Button>

                  <Button
                    id="8"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file" /> Checkbox
                  </Button>
                </div>

                <div className="list-group-item">
                  <h5>Sliders</h5>

                  <Button
                    id="2"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file" /> Slider
                  </Button>

                  <Button
                    id="4"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file" />
                    Double Slider
                  </Button>
                </div>

                <div className="list-group-item">
                  <h5>Rating</h5>
                  <Button
                    id="5"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file" /> Stars
                  </Button>

                  <Button
                    id="6"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file" /> Numeric
                  </Button>

                  <Button
                    id="9"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file" /> Counter
                  </Button>

                  <Button
                    id="10"
                    onClick={this.onAddBtnClick}
                    variant="outline-primary"
                    block
                  >
                    <i className="feather icon-file" /> Text
                  </Button>
                </div>
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
                    id="is_age_demo"
                    checked={this.state.demographic.is_age_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo ">Age</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_native_demo"
                    checked={this.state.demographic.is_native_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    Native Language
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_other_demo"
                    checked={this.state.demographic.is_other_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    Other Languages
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_knowledge_demo"
                    checked={this.state.demographic.is_knowledge_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    Language Knowledge
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_daily_demo"
                    checked={this.state.demographic.is_daily_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    Characterizing daily work
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_writing_demo"
                    checked={this.state.demographic.is_writing_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    Preferred hand - writing
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_mobile_demo"
                    checked={this.state.demographic.is_mobile_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    Preferred hand- mobile telephone
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_mouse_demo"
                    checked={this.state.demographic.is_mouse_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    Preferred hand - computer mouse
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_design_demo"
                    checked={this.state.demographic.is_design_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    experience in UX, UI design
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_hci_demo"
                    checked={this.state.demographic.is_hci_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    Your professional HCI experience
                  </Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_develop_demo"
                    checked={this.state.demographic.is_develop_demo}
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">
                    languages - interfaces developed
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
