import React from "react";
import { ProgressBar, Button } from "react-bootstrap";

class Demographics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_age_demo: props.demo.is_age_demo,
      is_native_demo: props.demo.is_native_demo,
      is_other_demo: props.demo.is_other_demo,
      is_knowledge_demo: props.demo.is_knowledge_demo,
      is_daily_demo: props.demo.is_daily_demo,
      is_writing_demo: props.demo.is_writing_demo,
      is_mobile_demo: props.demo.is_mobile_demo,
      is_mouse_demo: props.demo.is_mouse_demo,
      is_design_demo: props.demo.is_design_demo,
      is_hci_demo: props.demo.is_hci_demo,
      is_develop_demo: props.demo.is_develop_demo,
    };
  }

  componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <h1>Demographics</h1>
      </div>
    );
  }
}

export default Demographics;
