import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
// import windowSize from "react-window-size";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import Card from "../../App/components/MainCard";
import { MDBIcon } from "mdbreact";
import Input from "../QuestionsInput";
// import NavBar from "./NavBar";
// import Configuration from "./Configuration";
// import Loader from "../Loader";
// import routes from "../../../routes";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";

class ComponentsTable extends Component {
  constructor(props) {
    super(props);
    this.state = { inputList: [] };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
  }

  onAddBtnClick(event) {
    const inputList = this.state.inputList;
    this.setState({
      inputList: inputList.concat(<Input key={inputList.length} />),
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

    let navBarClass = ["navbar-wrapper", "content-main"];
    if (this.props.fullWidthLayout) {
      navBarClass = [...navBarClass, "container-fluid"];
    } else {
      navBarClass = [...navBarClass, "container"];
    }

    console.log(this.props.match);
    return (
      <Aux>
        {" "}
        {this.state.inputList.map(function (input, index) {
          return input;
        })}
        <nav className={navClass.join(" ")}>
          <Card>
            <Tabs defaultActiveKey="home" className="mb-3">
              <Tab eventKey="home" title={<MDBIcon icon="plus" />}>
                <ul className="list-group list-group-full">
                  <h5>Genral forms</h5>
                  <li className="list-group-item">
                    {/* //////// */}
                    <a onClick={this.onAddBtnClick} className="text-muted">
                      <i className="feather icon-file-text" /> Welcome Page
                    </a>{" "}
                  </li>
                  <li className="list-group-item">
                    <a href="#" className="text-muted">
                      <i className="feather icon-file-text" /> Explanation page
                    </a>{" "}
                  </li>
                  <li className="list-group-item">
                    <a href="#" className="text-muted">
                      <i className="feather icon-file-text" /> Thank you page
                    </a>{" "}
                  </li>
                  <br />
                  <h5>Text Based</h5>
                  <li className="list-group-item">
                    <a href="#" className="text-muted">
                      <i className="feather icon-file" /> Text Box
                    </a>
                  </li>
                  <li className="list-group-item">
                    <a href="#" className="text-muted">
                      <i className="feather icon-file" /> Number
                    </a>
                  </li>
                </ul>{" "}
              </Tab>
              <Tab eventKey="profile" title={<MDBIcon icon="cog" />}>
                <p>SETTINGS TAB.</p>
              </Tab>
            </Tabs>
          </Card>
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
