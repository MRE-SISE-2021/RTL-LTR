import React, { Component } from "react";
import { connect } from "react-redux";
import ComponentsTable from "../Components/Tabels/ComponentsTable";
import Aux from "../hoc/_Aux";
import * as actionTypes from "../store/actions";
import "bootstrap/dist/css/bootstrap.min.css";
import API from "../Api/Api";
import { withCookies } from "react-cookie";

class ExperimentPage extends Component {
  constructor() {
    super();
    this.state = {
      expId: "",
      tasks: [],
      is_active: true,
      demographic: {
        is_age_demo: true,
        is_native_demo: true,
        is_other_demo: true,
        is_knowledge_demo: true,
        is_daily_demo: true,
        is_writing_demo: true,
        is_mobile_demo: true,
        is_mouse_demo: true,
        is_design_demo: true,
        is_hci_demo: true,
        is_develop_demo: true,
      },
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
    const { cookies } = this.props;
    // console.log(cookies.cookies.token);
    //Edit EXP
    if (this.props.match.params.id !== "0") {
      // console.log("zerrrrrrrrroooooooooooooo");
      this.setState({
        expId: this.props.match.params.id,
        tasks: this.props.location.state.tasks,
        demographic: this.props.location.state.demographic,
        is_active: this.props.location.state.is_active,
      });
      return;
    }

    //Create new Exp
    const response = {
      //tasks
      tasks: [],
      //data
      creation_date: "2021-01-06 23:25", //
      questionnaire_name: this.props.match.params.name,
      direction: this.props.match.params.dir,
      hosted_link: "", //
      is_active: this.state.is_active,
      language_id: this.props.match.params.language,
      questionnaire_type_id: this.props.location.state.type, //
      demographic: this.state.demographic,
      task_type_id: "1",
    };

    API.postRequest("questionnaire-preview-data", response).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      this.setState({ expId: data.questionnaire_id });
    });
  }

  render() {
    // console.log(this.props.location.state);
    console.log(this.props.match.params);
    //for creating a new EXP the tasks array will be empty
    return (
      <Aux>
        <ComponentsTable
          name={this.props.match.params.name}
          type={this.props.match.params.type}
          dir={this.props.match.params.dir}
          lang={this.props.match.params.language}
          expId={this.state.expId}
          tasks={this.state.tasks}
          demographic={this.state.demographic}
          is_active={this.state.is_active}
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

export default withCookies(
  connect(mapStateToProps, mapDispatchToProps)(ExperimentPage)
);
