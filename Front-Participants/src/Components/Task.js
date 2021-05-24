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
    this.setCheckboxTaskAnswer = this.setCheckboxTaskAnswer.bind(this);
    this.setRadioTaskAnswer = this.setRadioTaskAnswer.bind(this);
    this.setAgeTaskAnswer = this.setAgeTaskAnswer.bind(this);
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
  setAgeTaskAnswer(event) {
    let isError = true;
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
      order_key: 1,
      free_answer: event.target.value,
      isError: isError,
      task_id: this.state.task_id,
    });
  }

  setCheckboxTaskAnswer(event) {
    debugger;
    if (event.target.id === "other") {
      this.props.onChange({
        order_key: event.target.name,
        free_answer: event.target.value,
        task_id: this.state.task_id,
      });
      return;
    }
    let answer_id = event.target.id;
    let order_key = event.target.value;
    let check = event.target.checked;
    this.props.onChange({
      answer_id: answer_id,
      order_key: order_key,
      checked: check,
      task_id: this.state.task_id,
    });
  }

  setRadioTaskAnswer(event, index) {
    if (event.target.id === "other") {
      this.props.onChange({
        order_key: event.target.name,
        free_answer: event.target.value,
        task_id: this.state.task_id,
      });
      return;
    }
    debugger;
    let answer_id = event.target.id;
    let order_key = event.target.value;
    this.props.onChange({
      answer_id: answer_id,
      order_key: order_key,
      task_id: this.state.task_id,
      index: index,
    });
  }

  // async setTaskAnswer(event, value) {
  //   //console.log(value); //orderkey = value
  //   debugger;
  //   let isError = true;
  //   if (event.target.id === "age") {
  //     if (event.target.value > 99 || event.target.value < 14) {
  //       this.setState({
  //         age: event.target.value,
  //         isError: true,
  //       });
  //       isError = true;
  //     } else {
  //       this.setState({
  //         age: event.target.value,
  //         isError: false,
  //       });
  //       isError = false;
  //     }

  //     this.props.onChange({
  //       order_key: 1,
  //       free_answer: event.target.value,
  //       isError: isError,
  //       task_id: this.state.task_id,
  //     });
  //     return;
  //   }
  //   if (event.target.id === "other") {
  //     this.props.onChange({
  //       order_key: event.target.name,
  //       free_answer: event.target.value,
  //       task_id: this.state.task_id,
  //     });
  //     return;
  //   }
  //   let answer_id = event.target.id;
  //   let order_key = event.target.value;
  //   this.props.onChange({
  //     answer_id: answer_id,
  //     order_key: order_key,
  //     value: value,
  //     task_id: this.state.task_id,
  //   });
  // }

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
    // let type = "radio";
    // if (actual_index === 11 || actual_index === 5 || actual_index === 3) {
    //   type = "checkbox";
    // }

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
                    onChange={this.setAgeTaskAnswer}
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
            ) : actual_index === 11 ||
              actual_index === 5 ||
              actual_index === 3 ? (
              this.state.task.answers.map((answer, index) => (
                <Form.Group key={index}>
                  <Row className="rows">
                    <Form.Control
                      style={{
                        width: "16px",
                        hight: "16px",
                        position: "absolute",
                      }}
                      type="checkbox"
                      key={index}
                      id={answer.answer_id} //answer_id
                      name={"ans" + actual_index}
                      value={actual_index} //order_ key.
                      onChange={(e) => {
                        this.setCheckboxTaskAnswer(e);
                      }}
                    />

                    <Form.Label
                      style={{
                        position: "relative",
                        padding: "6px",
                        marginLeft: "15px",
                        marginRight: "15px",
                        marginTop: "1px",
                      }}
                    >
                      {"          " + answer.answer_content}
                    </Form.Label>
                    {answer.value === "Other" ? (
                      <Form.Control
                        style={{ width: "200px" }}
                        type="text"
                        name={actual_index}
                        onChange={this.setCheckboxTaskAnswer}
                        id="other"
                      />
                    ) : null}
                  </Row>
                </Form.Group>
              ))
            ) : (
              this.state.task.answers.map((answer, index) => (
                <Form.Group key={index}>
                  <Row className="rows">
                    <Form.Control
                      style={{
                        width: "16px",
                        hight: "16px",
                        position: "absolute",
                      }}
                      type="radio"
                      key={index}
                      id={answer.answer_id} //answer_id
                      name={"ans" + actual_index}
                      value={actual_index} //order_ key.
                      onChange={(e) => {
                        this.setRadioTaskAnswer(e, index);
                      }}
                    />
                    <Form.Label
                      style={{
                        position: "relative",
                        padding: "6px",
                        marginLeft: "15px",
                        marginRight: "15px",
                        marginTop: "1px",
                      }}
                    >
                      {"  " + answer.answer_content}
                    </Form.Label>
                    {answer.value === "Other" ? (
                      <Form.Control
                        style={{ width: "200px" }}
                        type="text"
                        name={actual_index}
                        onChange={this.setRadioTaskAnswer}
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
