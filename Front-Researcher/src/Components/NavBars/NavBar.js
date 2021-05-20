import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import { Link } from "react-router-dom";
import "../../styles/homePageStyle.css";
import { MDBIcon } from "mdbreact";
import { Navbar } from "react-bootstrap";
import { withCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

import { Cookies } from "react-cookie";
import inMemoryToken from "../../inMemoryToken";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toLogin: false,
    };
  }

  render() {
    const cookies = new Cookies();
    //console.log(cookies);
    if (this.state.toLogin === true) {
      return <Redirect to={"/"} />;
    }

    const handleClick = () => {
      this.setState({ toLogin: true });
      inMemoryToken.ereaseToken();
      cookies.remove("refresh_token");
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
      /*
      <Aux>
       <ul class="p-3 mb-2 bg-info text-white">
              <li>
                <MDBIcon icon="home" size="3x" className="indigo-text pr-3" />
              </li>
            </ul>
      </Aux>
*/
      <Aux>
        {/* <Navbar fixed="top" bg="Light" variant="dark"> */}
        <OverlayTrigger
          key={1}
          placement="bottom"
          overlay={
            <Tooltip>
              <span style={{ boxShadow: "-1px 2px 5px rgba(0,0,0,0.1)" }}>
                Home
              </span>
            </Tooltip>
          }
        >
          <Link to="/home">
            <ul className="mb-1 text-primary">
              <li>
                <MDBIcon icon="home" size="2x" className="indigo-text pr-3" />{" "}
              </li>
            </ul>
          </Link>
        </OverlayTrigger>

        <div className="navbar-collapse2">
          <OverlayTrigger
            key={1}
            placement="bottom"
            overlay={<Tooltip>Log out</Tooltip>}
          >
            <Button variant="outline-*" onClick={() => handleClick()}>
              <ul className="mb-1 text-primary">
                <li>
                  <MDBIcon
                    icon="sign-out-alt"
                    size="2x"
                    className="indigo-text pr-3"
                  />
                </li>
              </ul>
            </Button>
          </OverlayTrigger>
        </div>
        {/* </Navbar> */}
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
