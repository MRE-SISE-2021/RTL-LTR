import React, { Component, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import windowSize from "react-window-size";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import Card from "../App/components/MainCard";
import { MDBIcon } from "mdbreact";
import NavBar from "../Components/NavBarExp";

// import NavBar from "./NavBar";
// import Configuration from "./Configuration";
// import Loader from "../Loader";
// import routes from "../../../routes";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";

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
    // const menu = routes.map((route, index) => {
    //   return route.component ? (
    //     <Route
    //       key={index}
    //       path={route.path}
    //       exact={route.exact}
    //       name={route.name}
    //       render={(props) => <route.component {...props} />}
    //     />
    //   ) : null;
    // });

    let mainClass = ["content-main"];
    if (this.props.fullWidthLayout) {
      mainClass = [...mainClass, "container-fluid"];
    } else {
      mainClass = [...mainClass, "container"];
    }
    return (
      <Aux>
        <NavBar />

        <div className="pcoded-content">
          <Col lg={3}>
            <Card class="exp">
              <Tabs defaultActiveKey="home" className="mb-3">
                <Tab eventKey="home" title={<MDBIcon icon="plus" />}>
                  <ul className="list-group list-group-full">
                    <h5>Genral forms</h5>
                    <li className="list-group-item">
                      <a href="#" className="text-muted">
                        <i className="feather icon-file-text" /> Welcome Page
                      </a>{" "}
                    </li>
                    <li className="list-group-item">
                      <a href="#" className="text-muted">
                        <i className="feather icon-file-text" /> Explanation
                        page
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
                  <p>
                    Food truck fixie locavore, accusamus mcsweeney's marfa nulla
                    single-origin coffee squid. Exercitation +1 labore velit,
                    blog sartorial PBR leggings next level wes anderson artisan
                    four loko farm-to-table craft beer twee. Qui photo booth
                    letterpress, commodo enim craft beer mlkshk aliquip jean
                    shorts ullamco ad vinyl cillum PBR. Homo nostrud organic,
                    assumenda labore aesthetic magna delectus mollit. Keytar
                    helvetica VHS salvia yr, vero magna velit sapiente labore
                    stumptown. Vegan fanny pack odio cillum wes anderson 8-bit,
                    sustainable jean shorts beard ut DIY ethical culpa terry
                    richardson biodiesel. Art party scenester stumptown, tumblr
                    butcher vero sint qui sapiente accusamus tattooed echo park.
                  </p>
                </Tab>
              </Tabs>
            </Card>
          </Col>
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
