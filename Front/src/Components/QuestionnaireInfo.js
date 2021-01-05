import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
// import windowSize from "react-window-size";
import { Row, Col } from "react-bootstrap";
import Card from "../App/components/MainCard";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import QuestionaireInfoResponse from "../Api/mocks/QuestionaireInfoResponse";
class QuestionaireInfo extends Component {
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

    const data = QuestionaireInfoResponse;
    return (
      <Aux>
        {/* <NavBar /> */}
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
                            <Card title={data.name} isOption>
                              <Row>
                                <Col>Created: {data.creation_date}</Col>
                                <Col>Language: {data.language}</Col>
                              </Row>
                              <Row>
                                <Col>Hosted Link: {data.hosted_link}</Col>
                                <Col>Status: {data.is_active}</Col>
                              </Row>
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
        {/* <Configuration /> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionaireInfo);
