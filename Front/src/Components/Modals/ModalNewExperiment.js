import React from "react";
import { Col, Modal, Button, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Aux from "../../hoc/_Aux";
import API from "../../Api/Api";
import "../../styles/homePageStyle.css";

class NewExperimentModal extends React.Component {
  constructor() {
    super();
    this.state = {
      isBasic: false,
      isVertically: false,
      isTooltip: false,
      isGrid: false,
      isScrolling: false,
      isLarge: false,
      title: "",
      chosenRadio: "english",
      expName: "exp",
      toDashboard: false,
      expId: "1",
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.getLangId = this.getLangId.bind(this);
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  getLangId() {
    switch (this.state.chosenRadio) {
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

  submitHandler(event) {
    event.preventDefault();
    //POST ---- default values
    const response = {
      //tasks
      tasks: [
        {
          answers: [],
          components: [],
          images: [],
          task_title: "jj",
          task_content: "", ////////?
          is_required: true, ///////?
        },
      ],
      //data
      creation_date: "2021-01-06 23:25", //
      questionnaire_name: this.state.expName,
      hosted_link: "", //
      is_active: "true",
      language_id: this.getLangId(),
      questionnaire_type_id: "1", //
    };

    const PostRequestOptions = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };

    fetch(
      "http://127.0.0.1:8000/questionnaire-preview-data",
      PostRequestOptions
    )
      // .then((response) => {
      //   console.log(response);
      //   if (response.ok) {
      //     return response.json();
      //   } else {
      //     throw new Error("Something went wrong ...");
      //   }
      // })
      .then((response) => {
        response.json().then((data) => {
          console.log(data);
          this.setState({ expId: data });
        });
      })
      .catch((error) => this.setState({ error }));
    // const newExpId = API.createNewExp(this.state.expName, this.getLangId());

    this.setState({ isBasic: false });
    ///// -- next page
    this.setState(() => ({
      toDashboard: true,
    }));
  }

  //////////
  render() {
    if (this.state.toDashboard === true) {
      return (
        <Redirect
          to={
            "/create/" +
            this.state.expName +
            "/exp/" +
            this.state.chosenRadio +
            "/" +
            this.state.expId
          }
        />
      );
    }
    return (
      <Aux>
        <div style={{ marginLeft: "180px", marginBottom: "20px" }}>
          <Button
            className="sm"
            variant="info"
            onClick={() => this.setState({ isBasic: true })}
          >
            + Create New
          </Button>
        </div>
        <Modal
          show={this.state.isBasic}
          onHide={() => this.setState({ isBasic: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title as="h5">Create New Experiment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.submitHandler}>
              <Form.Group controlId="formExpName">
                <Form.Label>Experiment Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="experiment"
                  name="expName"
                  onChange={this.onInputchange}
                />
              </Form.Group>

              <Form.Group controlId="formType">
                <Form.Label>Type</Form.Label>
                <Form.Control as="select">
                  <option>Experiment</option>
                </Form.Control>
              </Form.Group>

              <Form.Group required>
                <Form.Label>Languages</Form.Label>
                <Col sm={10}>
                  <Form.Check
                    type="radio"
                    label="Arabic"
                    name="Lang"
                    id="aLangId"
                    onClick={() => this.setState({ chosenRadio: "arabic" })}
                  />
                  <Form.Check
                    type="radio"
                    label="English"
                    name="Lang"
                    id="eLangId"
                    onClick={() => this.setState({ chosenRadio: "english" })}
                  />
                  <Form.Check
                    type="radio"
                    label="Hebrew"
                    name="Lang"
                    id="hLangId"
                    onClick={() => this.setState({ chosenRadio: "hebrew" })}
                  />
                  <Form.Check
                    type="radio"
                    label="Russian"
                    name="Lang"
                    id="rLangId"
                    onClick={() => this.setState({ chosenRadio: "russian" })}
                  />
                </Col>
              </Form.Group>
              <Modal.Footer>
                <button
                  type="submit"
                  variant="info"
                  class="btn btn-info mr-auto"
                >
                  Create
                </button>
                <button
                  type="button"
                  variant="light"
                  class="btn btn-light"
                  onClick={() => this.setState({ isBasic: false })}
                >
                  Close
                </button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </Aux>
    );
  }
}
export default NewExperimentModal;
