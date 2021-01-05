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
class BasicModals extends React.Component {
  state = {
    isBasic: false,
    isVertically: false,
    isTooltip: false,
    isGrid: false,
    isScrolling: false,
    isLarge: false,
    title: "",
  };
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
                  type="email"
                  placeholder="Enter name of experiment"
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
                  />
                  <Form.Check
                    type="radio"
                    label="English"
                    name="Lang"
                    id="eLangId"
                  />
                  <Form.Check
                    type="radio"
                    label="Hebrew"
                    name="Lang"
                    id="hLangId"
                  />
                  <Form.Check
                    type="radio"
                    label="Russian"
                    name="Lang"
                    id="rLangId"
                  />
                </Col>
              </Form.Group>

              <Button variant="primary">Cteate</Button>
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
