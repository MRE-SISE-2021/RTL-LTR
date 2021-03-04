import React, { Component } from "react";
import { connect } from "react-redux";
import ComponentsTable from "../Components/Tabels/ComponentsTable";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../Api/Api";

class ExperimentPage extends Component {
  constructor() {
    super();
    this.state = {
      expId: "",
    };
  }
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

  componentDidMount() {
    const response = {
      //tasks
      tasks: [],
      //data
      creation_date: "2021-01-06 23:25", //
      questionnaire_name: this.props.match.params.name,
      hosted_link: "", //
      is_active: "true",
      language_id: "1",
      questionnaire_type_id: "1", //
    };

    API.postRequest("questionnaire-preview-data", response).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      this.setState({ expId: data.questionnaire_id });
    });
  }

  render() {
    console.log(this.props.match);
    console.log(this.state.expId);
    return (
      <Aux>
        {/* <NavBar /> */}
        <ComponentsTable
          name={this.props.match.params.name}
          type={this.props.match.params.type}
          lang={this.props.match.params.language}
          expId={this.state.expId}
        />
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
