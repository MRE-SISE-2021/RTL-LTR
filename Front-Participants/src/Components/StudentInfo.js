import React from "react";
import { Col, Form, Row } from "react-bootstrap";

class StudentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      id: "",
    };
    this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event) {
    // debugger;
    this.setState({
      [event.target.name]: event.target.value,
    });

    this.props.onChange({
      order_key: 50,
      [event.target.name]: event.target.value,
      // isError: isError,
      // task_id: this.state.task_id,
    });
  }
  render() {
    return (
      <Form>
        <Form.Group key={1}>
          <h4>על מנת לקבל בונוס בקורוס מנשקי אדם מחשב מלא את פרטיך:</h4>
          <Row className="rows">
            <Form.Label
              style={{
                position: "relative",
                padding: "6px",
                marginLeft: "15px",
                marginRight: "15px",
                marginTop: "2px",
              }}
            >
              שם:
            </Form.Label>
            <Form.Control
              style={{ width: "200px" }}
              type="text"
              name="name"
              id="student_name"
              value={this.state.name}
              onChange={this.onInputchange}
            />
          </Row>
          <Row className="rows">
            <Form.Label
              style={{
                position: "relative",
                padding: "6px",
                marginLeft: "15px",
                marginRight: "15px",
                marginTop: "2px",
              }}
            >
              ת"ז:
            </Form.Label>
            <Form.Control
              style={{ width: "200px" }}
              type="text"
              name="id"
              id="student_id"
              value={this.state.id}
              onChange={this.onInputchange}
            />
          </Row>
        </Form.Group>
      </Form>
    );
  }
}

export default StudentInfo;
