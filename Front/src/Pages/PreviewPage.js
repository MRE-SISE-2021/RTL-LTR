import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import { Row, Col, Card } from "react-bootstrap";
import NavBar from "../Components/NavBars/NavBarExp";
class ExperimentPage extends Component {
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
    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }
    console.log(this.props.match);
    return (
      <Aux>
        <NavBar />
        <div className={mainClass.join(" ")}>
          <div className="pcoded-main-container full-screenable-node">
            <div className="pcoded-wrapper">
              <div className="pcoded-content">
                <div className="pcoded-inner-content">
                  <div className="main-body">
                    <div className="page-wrapper">
                      <Aux>
                        <Row>
                          <Col>
                            <Card isOption>
                              <Card.Header>
                                <Card.Title>fcfxgfxd</Card.Title>
                              </Card.Header>
                              <Card.Body>
                                <Row>
                                  <Col>
                                    <b>Created: </b>
                                  </Col>
                                  <Col>
                                    <b>Language: </b>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <b>Hosted Link: </b>
                                  </Col>
                                  <Col>
                                    <b>Status: </b>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Aux>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExperimentPage);
