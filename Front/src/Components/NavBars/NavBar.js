import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/_Aux";
import DEMO from "../../store/constant";
import * as actionTypes from "../../store/actions";

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

    // let mainHeaderClass = ["content-main"];
    // if (this.props.fullWidthLayout) {
    //   mainHeaderClass = [...mainHeaderClass, "container-fluid"];
    // } else {
    //   mainHeaderClass = [...mainHeaderClass, "container"];
    // }

    let navBar = (
      <Aux>
        <div>
          <div className="m-header">
            <a href={DEMO.BLANK_LINK} className="b-brand">
              {/* <img id="main-logo" src={mainLogo} alt="" className="logo" /> */}
              <h3>RTL-LTR</h3>
            </a>
          </div>
        </div>
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