import React from "react";
import { Modal, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Redirect } from "react-router-dom";
import API from "../../Api/Api";

class SaveModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBasic: false,
      isVertically: false,
      isTooltip: false,
      isGrid: false,
      isScrolling: false,
      isLarge: false,
      title: "",
      toDashboard: false,
      name: props.data.name,
      lang: props.data.lang,
      demographic: props.data.demo,
      id: props.data.expId,
      is_active: props.is_active,
    };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.getLangId = this.getLangId.bind(this);
    this.getComponents = this.getComponents.bind(this);
  }
  componentWillReceiveProps(propsIncoming) {
    let demo = propsIncoming.data.demo;
    let expId = propsIncoming.data.expId;
    this.setState({
      demographic: demo,
      id: expId,
      is_active: propsIncoming.is_active,
    });
  }

  getLangId() {
    switch (this.state.lang) {
      case "english":
        return "2";
      case "hebrew":
        return "3";
      case "arabic":
        return "1";
      case "russian":
        return "4";
      default:
        return "2";
    }
  }

  getComponents() {
    const tasks = [];
    // this.props.data.tasks.map(function (task, index) {
    //   tasks[index] = {
    //     order_key: task.key,
    //     component_type: task.props.name,
    //     direction: "RTL",
    //     label: "whatsssssuppp",
    //   };
    // });
    return tasks;
  }

  onAddBtnClick() {
    // const langId = this.getLangId();
    console.log(this.state.is_active);
    let response = {
      questionnaire_id: this.state.id, //
      demographic: this.state.demographic,
      is_active: this.state.is_active,
    };
    console.log(response);
    API.putRequest(
      "questionnaire-preview-data/" + this.state.id,
      response
    ).then((data) => {
      console.log(data);
    });

    this.setState({ isBasic: false });
    this.setState(() => ({
      toDashboard: true,
    }));
  }

  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to={"/home/"} />;
    }
    return (
      <div>
        <Button
          variant="outline-*"
          onClick={() => this.setState({ isBasic: true })}
        >
          <MDBIcon
            icon="save"
            //className="text-white"
            className="pr-3"
            size="2x"
          />
        </Button>
        <Modal
          show={this.state.isBasic}
          onHide={() => this.setState({ isBasic: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title as="h5">All Data Will be Saved!</Modal.Title>
          </Modal.Header>
          <img
            alt="save icon"
            src="https://icon-library.com/images/save-icon-image/save-icon-image-12.jpg"
          />
          <Modal.Footer>
            <Button variant="secondary" onClick={this.onAddBtnClick}>
              Save!
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default SaveModal;
