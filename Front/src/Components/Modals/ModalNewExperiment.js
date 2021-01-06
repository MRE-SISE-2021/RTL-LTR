import React from "react";
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
  Container,
  Form,
} from "react-bootstrap";

import { Link } from "react-router-dom";

class BasicModals extends React.Component {
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
      chosenRadio: "eng",
      expName: "exp",
    };
    this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <Button
          variant="primary"
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
            <Form>
              <Form.Group controlId="formExpName">
                <Form.Label>Experiment Name</Form.Label>
                <Form.Control
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

              <Form.Group>
                <Form.Label>Languages</Form.Label>
                <Col sm={10}>
                  <Form.Check
                    type="radio"
                    label="Arabic"
                    name="Lang"
                    id="aLangId"
                    onClick={() => this.setState({ chosenRadio: "ar" })}
                  />
                  <Form.Check
                    type="radio"
                    label="English"
                    name="Lang"
                    id="eLangId"
                    onClick={() => this.setState({ chosenRadio: "eng" })}
                  />
                  <Form.Check
                    type="radio"
                    label="Hebrew"
                    name="Lang"
                    id="hLangId"
                    onClick={() => this.setState({ chosenRadio: "heb" })}
                  />
                  <Form.Check
                    type="radio"
                    label="Russian"
                    name="Lang"
                    id="rLangId"
                    onClick={() => this.setState({ chosenRadio: "ru" })}
                  />
                </Col>
              </Form.Group>

              {/* <Button variant="primary" hre>Create</Button> */}
              <Link
                to={
                  "/create/" +
                  this.state.expName +
                  "/exp/" +
                  this.state.chosenRadio
                }
              >
                <Button variant="primary">Create</Button>
              </Link>
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
      </div>
    );
  }
}
export default BasicModals;
