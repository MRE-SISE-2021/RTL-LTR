import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import { Link } from "react-router-dom";
import "../../styles/homePageStyle.css";
import { MDBIcon } from "mdbreact";
import Navbar from "react-bootstrap/Navbar";
import { withCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import { Button } from "react-bootstrap";
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toLogin: false,
    };
  }

  render() {
    const { cookies } = this.props;

    if (this.state.toLogin === true) {
      return <Redirect to={"/"} />;
    }

    const handleClick = () => {
      this.setState({ toLogin: true });
      cookies.remove("token");
    };

    let headerClass = [
      "navbar",
      "pcoded-header",
      "navbar-expand-lg",
      this.props.headerBackColor,
    ];
    if (this.props.headerFixedLayout) {
      headerClass = [...headerClass, "headerpos-fixed"];
    }

    let navBar = (
      <Aux>
        <Navbar fixed="top" bg="info" variant="dark" style={{ height: "66px" }}>
          <Link to="/home">
            <MDBIcon icon="home" />
          </Link>
          <div style={{ marginLeft: "97%" }}>
            <Button variant="outline-*" onClick={() => handleClick()}>
              <MDBIcon icon="sign-out-alt" />
            </Button>
          </div>
        </Navbar>
      </Aux>
    );

    return (
      <Aux>
        <header className={headerClass.join(" ")}>{navBar}</header>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rtlLayout: state.rtlLayout,
    headerBackColor: state.headerBackColor,
    headerFixedLayout: state.headerFixedLayout,
    collapseMenu: state.collapseMenu,
    layout: state.layout,
    fullWidthLayout: state.fullWidthLayout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggleNavigation: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  };
};

export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(NavBar)
);
