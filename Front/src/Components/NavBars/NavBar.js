import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import * as actionTypes from "../../store/actions";

import '../../styles/homePageStyle.css'; 
import { MDBIcon} from "mdbreact";

class NavBar extends Component {
  render() {
    let headerClass = [
      "navbar",
      "pcoded-header",
      "navbar-expand-lg",
      this.props.headerBackColor,
    ];
    if (this.props.headerFixedLayout) {
      headerClass = [...headerClass, "headerpos-fixed"];
    }

    // let toggleClass = ["mobile-menu"];
    // if (this.props.collapseMenu) {
    //   toggleClass = [...toggleClass, "on"];
    // }

    /*
  <ul class="p-3 mb-2 bg-info text-white">
              <li>
                <a><MDBIcon icon="home" size="3x" className="indigo-text pr-3" /></a>
              </li>
            </ul>

    */
    // let mainHeaderClass = ["content-main"];
    // if (this.props.fullWidthLayout) {
    //   mainHeaderClass = [...mainHeaderClass, "container-fluid"];
    // } else {
    //   mainHeaderClass = [...mainHeaderClass, "container"];
    // }
    //<a href={DEMO.BLANK_LINK} className="b-brand">{/* <img id="main-logo" src={mainLogo} alt="" className="logo" /> */}</a>

    let navBar = (
      
      <Aux>
       <ul class="p-3 mb-2 bg-info text-white">
              <li>
                <MDBIcon icon="home" size="3x" className="indigo-text pr-3" />
              </li>
            </ul>
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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
