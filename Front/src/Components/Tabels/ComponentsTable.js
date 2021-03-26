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
    this.state = {
      inputList: [],
      demographic: {
        is_age_demo: true,
        is_native_demo: true,
        is_other_demo: true,
        is_knowledge_demo: true,
        is_daily_demo: true,
        is_writing_demo: true,
        is_mobile_demo: true,
        is_mouse_demo: true,
        is_design_demo: true,
        is_hci_demo: true,
        is_develop_demo: true,
      },
    };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.onDemoChanged = this.onDemoChanged.bind(this);
  }

  componentWillReceiveProps(propsIncoming) {
    //Edit EXP
    console.log(propsIncoming);
    const id = propsIncoming.expId;
    if (propsIncoming.is_age_demo !== undefined) {
      this.setState({
        demographic: {
          is_age_demo: propsIncoming.is_age_demo,
          is_native_demo: propsIncoming.is_native_demo,
          is_other_demo: propsIncoming.is_other_demo,
          is_knowledge_demo: propsIncoming.is_knowledge_demo,
          is_daily_demo: propsIncoming.is_daily_demo,
          is_writing_demo: propsIncoming.is_writing_demo,
          is_mobile_demo: propsIncoming.is_mobile_demo,
          is_mouse_demo: propsIncoming.is_mouse_demo,
          is_design_demo: propsIncoming.is_design_demo,
          is_hci_demo: propsIncoming.is_hci_demo,
          is_develop_demo: propsIncoming.is_develop_demo,
        },
      });
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
                    id="is_age_demo"
                    defaultChecked
                    onChange={this.onDemoChanged}
                  />
                  <Form.Label className="label_demo">Age</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    type="checkbox"
                    className="check_demo"
                    id="is_native_demo"
                    defaultChecked
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
                    defaultChecked
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
                    defaultChecked
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
                    defaultChecked
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
                    defaultChecked
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
                    defaultChecked
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
                    defaultChecked
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
                    defaultChecked
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
                    defaultChecked
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
                    defaultChecked
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
