import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Modal from "../Modals/ModalNewExperiment";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import { Table, Button, Row } from "react-bootstrap";
import QuestionnaireInfo from "../ExperimentInfo";
import { MDBIcon } from "mdbreact";
import "../../styles/homePageStyle.css";

class ExperimentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: {},
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  resize = () => {
    const contentWidth = document.getElementById("root").clientWidth;

    if (this.props.layout === "horizontal" && contentWidth < 992) {
      this.props.onChangeLayout("vertical");
    }
  };

  componentDidMount() {
    //////
    fetch("http://127.0.0.1:8000/viewset/questionnaire")
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log(result);
          if (result[0] !== undefined) {
            this.setState({
              isLoaded: true,
              items: result,
              chosen: result[0],
            });
          } else {
            this.setState({
              isLoaded: true,
              items: [],
              chosen: {},
            });
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
    this.resize();
    window.addEventListener("resize", this.resize);
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

    ///////////////////////////
    const handleReload = (event) => {
      // event.preventDefault();
      console.log("reloaddddd");
      this.componentDidMount();
      this.forceUpdate();
    };
    const handleClick = (value) => {
      fetch(`http://127.0.0.1:8000/viewset/questionnaire/${value}`)
        .then((res) => res.json())
        .then(
          (result) => {
            // console.log(result);
            this.setState({
              isLoaded: true,
              chosen: result,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    };
    const names = this.state.items;

    return (
      <Aux>
        <nav style={{ marginLeft: "200px" }}>
          <QuestionnaireInfo chosen={this.state.chosen} />
        </nav>

        <nav style={{ width: "30%" }} className={navClass.join(" ")}>
          <Row className="mt-4 ml-1">
            <h5>My Experiments</h5>
            <Modal />
          </Row>
          <Table
            style={{
              borderStyle: "solid",
              width: "320px",
              height: "450px",
              overflow: "auto",
              display: "inline-block",
            }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Experiment Name</th>
                <th>status</th>
                <th>
                  <MDBIcon
                    type="button"
                    onClick={() => handleReload()}
                    icon="redo"
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              {/* {console.log(names)} */}
              {names.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <Button
                        variant="outline-info"
                        onClick={() => handleClick(value.questionnaire_id)}
                      >
                        {value.questionnaire_name}
                      </Button>
                    </td>
                    <td>
                      <MDBIcon far icon="play-circle" />
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
  connect(mapStateToProps, mapDispatchToProps)(ExperimentTable)
);
