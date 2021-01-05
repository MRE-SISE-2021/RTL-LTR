import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import windowSize from "react-window-size";
import Modal from "../Modals/ModalNewExperiment";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import { Table, Button } from "react-bootstrap";

import ExperimentsResponse from "../../Api/mocks/ExperimentsResponse";
import axios from "axios";

class Navigation extends Component {
  state = {
    data: "",
  };

  resize = () => {
    const contentWidth = document.getElementById("root").clientWidth;

    if (this.props.layout === "horizontal" && contentWidth < 992) {
      this.props.onChangeLayout("vertical");
    }
  };

  componentDidMount() {
    this.resize();
    window.addEventListener("resize", this.resize);

    axios
      .get(`http://127.0.0.1:8000/viewset/questionnaire`, {
        headers: { "Access-Control-Allow-Origin": "*" },
      })
      .then((res) => {
        const persons = res.data[0];
        this.setState(persons);
        console.log(this.state);
      });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  scroll = () => {
    if (this.props.navFixedLayout && this.props.headerFixedLayout === false) {
      const el = document.querySelector(".pcoded-navbar.menupos-fixed");
      const scrollPosition = window.pageYOffset;
      if (scrollPosition > 60) {
        el.style.position = "fixed";
        el.style.transition = "none";
        el.style.marginTop = "0";
      } else {
        el.style.position = "absolute";
        el.style.marginTop = "60px";
      }
    } else {
      document.querySelector(".pcoded-navbar").removeAttribute("style");
    }
  };

  sayHello() {
    alert("Hello!");
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
    ///////////////////////////////
    const handleClick = (value) => {
      alert(value);
    };

    const names = ExperimentsResponse;

    return (
      <Aux>
        <nav className={navClass.join(" ")}>
          <h5>My Experiments</h5>
          <Modal />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Questionaire Name</th>
              </tr>
            </thead>
            <tbody>
              {names.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Button
                        variant="outline-*"
                        onClick={() => handleClick(value)}
                      >
                        {value}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </nav>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layout: state.layout,
    collapseMenu: state.collapseMenu,
    layoutType: state.layoutType,
    fullWidthLayout: state.fullWidthLayout,
    navFixedLayout: state.navFixedLayout,
    headerFixedLayout: state.headerFixedLayout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
    onChangeLayout: (layout) =>
      dispatch({ type: actionTypes.CHANGE_LAYOUT, layout: layout }),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
