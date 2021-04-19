import React from "react";
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
import { Form, Row } from "react-bootstrap";
class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.demo_task,
      is_other: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.setTaskAnswer = this.setTaskAnswer.bind(this);
  }
  handleClick(event) {
    this.state = {
      is_other: true,
    };
  }
  setTaskAnswer(event, value) {
    console.log(value); //orderkey = value
    if (event.target.id === "age") {
      this.props.onChange({
        answer_id: [],
        order_key: 1,
        free_answer: event.target.value,
      });
      return;
    }
    if (event.target.id === "other") {
      this.props.onChange({
        answer_id: [],
        order_key: event.target.name,
        free_answer: event.target.value,
        other: "other",
      });
      return;
    }
    let answer_id = event.target.id;
    let order_key = event.target.value;
    this.props.onChange({
      answer_id: answer_id,
      order_key: order_key,
      value: value,
    });
  }

  render() {
    console.log(this.state);
    let is_other = this.state.is_other;
    const Div = styled.div`
      padding: 10px;
      ${rtl`
   margin-right: 50px;
   text-align: left;
   direction: ltr;
   `};
    `;
    let theme = {
      dir: "ltr",
    };
    if (this.props.lang === 1 || this.props.lang === 3) {
      theme = {
        dir: "rtl",
      };
    }
    let actual_index = this.state.task.order_key;
    let type = "radio";
    if (actual_index === 11 || actual_index === 5 || actual_index === 3) {
      type = "checkbox";
    }

    return (
      <ThemeProvider theme={theme}>
        <Div key={"task"}>
          <h4>{this.state.task.order_key + ". " + this.state.task.label}</h4>
          <Form>
            {this.state.task.answers.length === 0 ? (
              <Form.Group>
                <Form.Control
                  style={{ width: "88px" }}
                  type="number"
                  required
                  id="age"
                  onChange={this.setTaskAnswer}
                />
              </Form.Group>
            ) : (
              this.state.task.answers.map((answer, index) => (
                <Form.Group key={index}>
                  <Row>
                    <Form.Control
                      style={{ width: "16px", hight: "16px" }}
                      type={type}
                      key={index}
                      id={answer.answer_id} //answer_id
                      name={"ans" + actual_index}
                      value={actual_index} //order_ key.
                      onChange={(e) => {
                        this.setTaskAnswer(e, answer.value);
                      }}
                    />
                    <Form.Label
                      style={{ position: "relative", padding: "6px" }}
                    >
                      {"  " + answer.answer_content + "  "}
                    </Form.Label>
                    {answer.value === "Other" ? (
                      <Form.Control
                        style={{ width: "200px" }}
                        type="text"
                        name={actual_index}
                        onFocus={this.handleClick}
                        id="other"
                      />
                    ) : null}
                  </Row>
                </Form.Group>
              ))
            )}
          </Form>
        </Div>

        {/* })} */}
      </ThemeProvider>
    );
  }
}

export default Task;
