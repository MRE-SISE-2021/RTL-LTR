import React from "react";
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.demo_task,
    };
  }

  setTaskAnswer(event) {
    console.log(event.target.value); //orderkey = value
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
    });
  }

  render() {
    // console.log(this.state);
    const Div = styled.div`
      border: 2px solid BLACK;
      background: gainsboro;
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
          <h4>{this.state.task.label}</h4>
          <div onChange={this.setTaskAnswer.bind(this)}>
            {this.state.task.answers.length === 0 ? (
              <input
                type="text"
                // name={"ans" }
                // value={answer.answer_content}
                id="age"
              />
            ) : (
              this.state.task.answers.map(function (answer, index) {
                if (answer.answer_content === "Other") {
                  return (
                    <div key={index}>
                      <input
                        type={type}
                        key={index}
                        id={answer.answer_id} //answer_id
                        name={"ans" + actual_index}
                        value={actual_index} //order_key
                      />
                      {answer.answer_content}:
                      <input
                        type="text"
                        name={actual_index}
                        // value={actual_index}

                        id="other"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={index}>
                      <input
                        type={type}
                        key={index}
                        id={answer.answer_id} //answer_id
                        name={"ans" + actual_index}
                        value={actual_index} //order_key
                      />
                      {answer.answer_content}
                    </div>
                  );
                }
              })
            )}
          </div>
        </Div>

        {/* })} */}
      </ThemeProvider>
    );
  }
}

export default Task;
