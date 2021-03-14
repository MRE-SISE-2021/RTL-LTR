import React from "react";
import { Modal, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import { Redirect } from "react-router-dom";

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
    };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.getLangId = this.getLangId.bind(this);
    this.getComponents = this.getComponents.bind(this);
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
    console.log(this.props.data);
    // const response = {
    //   //tasks
    //   tasks: [
    //     {
    //       answers: [],
    //       components: this.getComponents(),
    //       images: [],
    //       task_title: "Test create",
    //       task_content: "", ////////?
    //       is_required: true, ///////?
    //     },
    //   ],
    //   //data
    //   creation_date: "2021-01-06 23:25", //
    //   questionnaire_name: this.state.name,
    //   hosted_link: "https://www.youtube.com/", //
    //   is_active: "true",
    //   language_id: langId,
    //   questionnaire_type_id: "1", //
    // };

    // console.log(response);
    // const requestOptions = {
    //   method: "post",
    //   headers: {
    //     Accept: "application/json, text/plain, */*",
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(response),
    // };

    // fetch("http://127.0.0.1:8000/questionnaire-preview-data", requestOptions)
    //   .then((response) => {
    //     console.log(response);
    //     if (response.ok) {
    //       return response.json();
    //     } else {
    //       throw new Error("Something went wrong ...");
    //     }
    //   })
    //   .catch((error) => this.setState({ error }));

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
      <div className="mr-5">
     
        <Button
          variant="outline-*"
          onClick={() => this.setState({ isBasic: true })}
          
        >
          <MDBIcon icon="save" className="text-white"   size="2x" />
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
