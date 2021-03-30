import React from "react";
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
class Demographics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.demo_task,
    };
  }

  setTaskAnswer(event) {
    console.log(event.target.value); //orderkey = value
    let answer_id = event.target.id;
    let order_key = event.target.value;
    // let answers = [...this.props.answers];
    // let arr = [];

    // arr = arr.concat([answer_id]);
    // answers[order_key] =
    // call change page function in parent component
    this.props.onChange({
      answer_id: answer_id,
      order_key: order_key,
    });
  }
  callSet(id, value) {
    // 1. Make a shallow copy of the answers
    // let answers = [...this.state.answers];
    // console.log(answers);
    // //Check if checkbox --- to add answers else override answer for radio button
    // let arr = [];
    // if (
    //   this.state.answers[value] !== undefined &&
    //   (value === "2" || value === "4" || value === "10")
    // ) {
    //   arr = this.state.answers[value].answer_ids;
    // }
    // // 2. Make a shallow copy of the item you want to mutate
    // let item = { ...answers[value] };
    // // 3. Replace the property you're intested in
    // item = {
    //   ...answers[value],
    //   answer_ids: arr.concat([id]),
    //   order_key: value,
    // };
    // // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    // answers[value] = item;
    // // 5. Set the state to our new copy
    // this.setState({ answers });
    // console.log(this.state);
    // this.setState({
    //   answers: this.state.answers.concat([newelement]),
    // });
    /////////////////
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
    if (actual_index === 10 || actual_index === 4 || actual_index === 2) {
      type = "checkbox";
    }
    return (
      <ThemeProvider theme={theme}>
        <Div key={"task"}>
          <h4>{this.state.task.label}</h4>
          <div onChange={this.setTaskAnswer.bind(this)}>
            {this.state.task.answers.map(function (answer, index) {
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
            })}
          </div>
        </Div>

        {/* })} */}
      </ThemeProvider>
    );
  }
}

export default Demographics;
