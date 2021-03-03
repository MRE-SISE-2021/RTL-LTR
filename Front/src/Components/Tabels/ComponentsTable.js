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
    this.state = { inputList: [] };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.onAddBtnClick2 = this.onAddBtnClick2.bind(this);
  }

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
    // console.log(this.props);
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

    // let navBarClass = ["navbar-wrapper", "content-main"];
    // if (this.props.fullWidthLayout) {
    //   navBarClass = [...navBarClass, "container-fluid"];
    // } else {
    //   navBarClass = [...navBarClass, "container"];
    // }

    console.log(this.state.inputList);
    return (
      <Aux>
        <NavBar
          name={this.props.name}
          type={this.props.type}
          lang={this.props.lang}
          tasks={this.state.inputList}
        />
        {this.state.inputList.map(function (input, index) {
          return input;
        })}
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
          {/* <Card > */}
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
                  {/* //////// */}

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
          {/* </Card> */}
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
