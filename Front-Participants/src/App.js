import React from "react";
import HomePage from "./Pages/HomePage";
import axiosInstance from "./axios";
import { Redirect } from "react-router-dom";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tasks: [], //what we get from db
      name: "",
      lang: "",
      type: "",
      direction: "LTR",
      demographic_task: [],
      demographic: {},
      is_active: "",
    };
  }
  async componentDidMount() {
    // console.log(this.props.hosted_link);
    await axiosInstance
      .get("/get-questionnaire-by-hosted-link", {
        params: {
          // hash: this.props.hosted_link,
          hash: this.props.match.params.hosted_link,
        },
      })
      .then(
        (result) => {
          result = result.data;
          console.log(result);
          this.setState(() => ({
            tasks: result.tasks,
            name: result.questionnaire_name,
            type: result.questionnaire_type_id,
            lang: result.language_id,
            is_active: result.is_active,
            direction: result.direction,
            demographic_task: result.demographic_task,
            demographic: [
              result.is_age_demo,
              result.is_native_demo,
              result.is_other_demo,
              result.is_knowledge_demo,
              result.is_daily_demo,
              result.is_writing_demo,
              result.is_mobile_demo,
              result.is_mouse_demo,
              result.is_design_demo,
              result.is_hci_demo,
              result.is_develop_demo,
            ],
          }));
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  render() {
    if (this.state.is_active === false) {
      return <Redirect to={"/not_active"} />;
    }
    return (
      <div className="App">
        {/* <HomePage hosted_link={this.props.match.params.hosted_link} /> */}
        <HomePage data={this.state} />
      </div>
    );
  }
}

export default App;
