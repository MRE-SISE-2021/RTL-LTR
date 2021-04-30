import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import { Link } from "react-router-dom";
import "../../styles/homePageStyle.css";
import { MDBIcon } from "mdbreact";
import { Navbar, OverlayTrigger ,Tooltip} from "react-bootstrap";
import { withCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import { Button } from "react-bootstrap";

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

    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Simple tooltip
      </Tooltip>
    );

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
        <Navbar fixed="top" style={{ height: "10%" }}>
      
        <OverlayTrigger
                  placement="bottom"
                  //delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                
          <Link to="/home">
            <ul className="mb-1 text-primary">
              <li>
           
               
                <MDBIcon icon="home" size="2x" className="indigo-text pr-3" />{" "}
               
              </li>
            </ul>
          </Link>
          </OverlayTrigger>

          <OverlayTrigger
                  placement="bottom"
                  //delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
          <div className="navbar-collapse2">
          <Button variant="outline-*" onClick={() => handleClick()}>
              <ul className="mb-1 text-primary">
                <li>
                  <MDBIcon
                    icon="arrow-left"
                    size="2x"
                    className="indigo-text pr-3"
                  />
                </li>
                
              </ul>
            </Button>
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
            
          </div>
          </OverlayTrigger>
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
