import React from "react";
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
import { Form, Row } from "react-bootstrap";
import "../styles/Task.css";
class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.demo_task,
      is_other: false,
      age: "",
      task_id: props.demo_task.task_id,
    };
    this.handleClick = this.handleClick.bind(this);
    this.setTaskAnswer = this.setTaskAnswer.bind(this);
  }
  componentWillReceiveProps(propsIncoming) {
    this.setState({
      task_id: propsIncoming.demo_task.task_id,
    });
  }
  handleClick(event) {
    this.state = {
      is_other: true,
    };
  }
  async setTaskAnswer(event, value) {
    //console.log(value); //orderkey = value
    debugger;
    let isError = true;
    if (event.target.id === "age") {
      if (event.target.value > 99 || event.target.value < 14) {
        this.setState({
          age: event.target.value,
          isError: true,
        });
        isError = true;
      } else {
        this.setState({
          age: event.target.value,
          isError: false,
        });
        isError = false;
      }

      this.props.onChange({
        answer_id: [],
        order_key: 1,
        free_answer: event.target.value,
        isError: isError,
        task_id: this.state.task_id,
      });
      return;
    }
    if (event.target.id === "other") {
      this.props.onChange({
        answer_id: [],
        order_key: event.target.name,
        free_answer: event.target.value,
        other: "other",
        task_id: this.state.task_id,
      });
      return;
    }
    let answer_id = event.target.id;
    let order_key = event.target.value;
    this.props.onChange({
      answer_id: answer_id,
      order_key: order_key,
      value: value,
      task_id: this.state.task_id,
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
              <div key="age_1">
                <Form.Group>
                  <Form.Control
                    style={{ width: "88px" }}
                    type="number"
                    required
                    id="age"
                    value={this.state.age}
                    onChange={this.setTaskAnswer}
                    autoFocus={true}
                  />
                  {this.state.isError && this.props.lang === 1 ? (
                    <p style={{ color: "red" }}>
                      هل أخطأت في ادخال عمرك؟ إذا لم يكن كذلك، يرجى الاتصال بنا
                    </p>
                  ) : this.state.isError && this.props.lang === 2 ? (
                    <p style={{ color: "red" }}>
                      Could it be that you made a mistake in entering your age?
                      If not - please contact us
                    </p>
                  ) : this.state.isError && this.props.lang === 3 ? (
                    <p style={{ color: "red" }}>
                      יכול להיות שטעית בהזנת גילך? אם לא - מבקשים ליצור קשר
                      איתנו
                    </p>
                  ) : this.state.isError && this.props.lang === 4 ? (
                    <p style={{ color: "red" }}>
                      У тебя есть аккаунт? Если у вас его нет, свяжитесь с нами.
                    </p>
                  ) : null}
                </Form.Group>
              </div>
            ) : (
              this.state.task.answers.map((answer, index) => (
                <Form.Group key={index}>
                  <Row className="rows">
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
                      {"  " + answer.answer_content}
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
