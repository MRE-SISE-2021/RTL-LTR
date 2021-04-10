import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Modal from "../Modals/ModalNewExperiment";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import { Table, Button, Row, Col } from "react-bootstrap";
import QuestionnaireInfo from "../ExperimentInfo";
import { MDBIcon, MDBBtn } from "mdbreact";
import "../../styles/homePageStyle.css";
import { withCookies } from "react-cookie";

import axiosInstance from "../../axios";



class ExperimentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: {},
      error: null,
      isLoaded: false,
      items: [],
      isActive: null,
    };
  }

  resize = () => {
    const contentWidth = document.getElementById("root").clientWidth;

    if (this.props.layout === "horizontal" && contentWidth < 992) {
      this.props.onChangeLayout("vertical");
    }
  };

  async componentDidMount() {
    //////
    await axiosInstance.get("viewset/questionnaire/").then(
      (result) => {
        result = result.data;
        console.log(result);
        if (result[0] !== undefined) {
          this.setState({
            isLoaded: true,
            items: result.reverse(),
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
        console.log(error);
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
    const handleClick = async (value,index) => {
      await axiosInstance.get(`viewset/questionnaire/${value}`).then(
        (result) => {
          result = result.data;
          console.log(result);
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

      //Remove the if statement if you don't want to unselect an already selected item
  if (index === this.state.isActive) {
    this.setState({
      isActive: null
    });
  } else {
    this.setState({
      isActive: index
    });
  }
    };
    const names = this.state.items;
    /*
  <div class="infoStyle">
          
        </div>

*/

    return (
      <div>
        <div
          style={{
            position: "absolute",
            right: "0",
            transform: "translatex(-1%)",
            marginLeft: "50%",
            marginTop: "6%",
            width: "50%",
            overflow: "auto",
            overflowX: "hidden",
          }}
        >
          <QuestionnaireInfo chosen={this.state.chosen} />
        </div>

        <div
          style={{
            position: "absolute",
            left: "1%",
            marginTop: "6%",
            width: "45%",
            overflow: "auto",
            overflowX: "hidden",
          }}
          className={navClass.join(" ")}
        >
          <Row>
            <Col sm={8}>
              <h5>
                MY EXPERIMENTS ({names.length}){" "}
                <MDBIcon
                  type="button"
                  onClick={() => handleReload()}
                  icon="redo"
                />
              </h5>
            </Col>

            <Modal />
          </Row>
          <div className="mt-3">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>CREATED</th>
                  <th>LNG</th>
                  <th>
                    # <MDBIcon icon="user-friends" />
                  </th>
                  <th>
                    NEW <MDBIcon icon="user-friends" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* {console.log(names)} */}
                {names.map((value, index) => {
                  return (
                    <tr
                    key={index}
                    style={
                      this.state.isActive === index
                        ? {  background: '#BBDEFB' }
                        : {  background: 'white' }
                    }
                    onClick={() => handleClick(value.questionnaire_id,index)                      }
                  >
                      
              
                      <td >
                        {value.is_active ? (
                          <MDBIcon
                            icon="circle"
                            style={{ color: "limegreen" }}
                          />
                        ) : (
                          <MDBIcon icon="circle" style={{ color: "red" }} />
                        )}
                        &nbsp;
                        {value.questionnaire_name}
                      </td>
                      <td>{value.creation_date}</td>
                      <td>
                        {
                          {
                            1: "Arabic",
                            2: "English",
                            3: "Hebrew",
                            4: "Russian",
                          }[value.language_id]
                        }
                      </td>
                      <td>sum</td>
                      <td>sum</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
  changeColor = selectedRow => e => {
    if (selectedRow !== undefined) {
      this.setState({ selectedRow  });
    }
  };
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

export default withCookies(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(ExperimentTable))
);
