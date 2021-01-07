import React from "react";
import { Col, Modal, Button, Form } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import Aux from "../../hoc/_Aux";

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
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  submitHandler(event) {
    event.preventDefault();
    // do some sort of verification here if you need to
    //   <Link
    // to={
    //   "/create/" +
    //   this.state.expName +
    //   "/exp/" +
    //   this.state.chosenRadio
    // }
    // >
    this.setState(() => ({
      toDashboard: true,
    }));
  }
  render() {
    if (this.state.toDashboard === true) {
      return (
        <Redirect
          to={
            "/create/" + this.state.expName + "/exp/" + this.state.chosenRadio
          }
        />
      );
    }
    return (
      <Aux>
        <Button
          className="ml-2"
          variant="outline-dark"
          onClick={() => this.setState({ isBasic: true })}
        >
          Create
        </Button>
        <Modal
          show={this.state.isBasic}
          onHide={() => this.setState({ isBasic: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title as="h5">Modal Title</Modal.Title>
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

              <Button type="submit" variant="primary">
                Create
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ isBasic: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Aux>
    );
  }
}
export default NewExperimentModal;
