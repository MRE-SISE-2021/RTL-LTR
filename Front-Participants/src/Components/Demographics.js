import React from "react";
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
import { Form, Row } from "react-bootstrap";
class Demographics extends React.Component {
  constructor(props) {
    super(props);
    // this.onInputchange = this.onInputchange.bind(this);
    this.state = {
      tasks: props.demoTasks,
      is_demographics: [
        props.isDemo.is_age_demo, //Age -1
        props.isDemo.is_native_demo, //Native -2
        props.isDemo.is_other_demo, //other -3
        props.isDemo.is_knowledge_demo, //Knowledge -4
        props.isDemo.is_daily_demo, //daily -5
        props.isDemo.is_writing_demo, //writing -6
        props.isDemo.is_mobile_demo, //mobile -7
        props.isDemo.is_mouse_demo, //mouse -8
        props.isDemo.is_design_demo, //design -9
        props.isDemo.is_hci_demo, //hci -10
        props.isDemo.is_develop_demo, //develop -11
      ],
      inputList: [],
      answers: [],
    };
  }

  // componentWillMount() {
  //   // set page if items array isn't empty
  //   if (this.props.items && this.props.items.length) {
  //     this.setPage(this.props.initialPage);
  //   }
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   // reset page if items array has changed
  //   if (this.props.items !== prevProps.items) {
  //     this.setPage(this.props.initialPage);
  //   }
  // }

  onInputchange(i, event) {
    console.log(event.target);
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  render() {
    console.log(this.state);
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
    let actual_index = 0;
    return (
      <ThemeProvider theme={theme}>
        {this.state.tasks.map((task, index) => {
          // console.log(index);
          if (this.state.is_demographics[index] === true) {
            actual_index = actual_index + 1;
            let type = "radio";
            if (index === 10 || index === 4 || index === 2) {
              type = "checkbox";
            }
            // console.log(task);
            // Return the element. Also pass key
            return (
              <Div
                key={"task" + index}
                id={"task" + index}
                // onChange={this.onInputchange}
              >
                <h4>
                  {actual_index}. {task.label}
                </h4>
                {/* <div
                  key={"task" + index}
                  id={"task" + index}
                  onChange={this.onInputchange}
                > */}
                <Form.Group
                  // as={Row}

                  key={"task" + index}
                  id={"task" + index}
                >
                  {task.answers.map(function (answer, i) {
                    return (
                      // <div key={i}>
                      //   <input
                      //     type={type}
                      //     key={i}
                      //     // defaultChecked
                      //     id={`answer` + i} //question number
                      //     // ansid={i + 1} //answer id
                      //     name={"ans" + index}
                      //     value={answer.answer_content}
                      //     // onChange={this.onInputchange}
                      //   />
                      //   {answer.answer_content}
                      // </div>
                      <Form.Check
                        type={type}
                        label={answer.answer_content}
                        name={"ans" + index}
                        key={i}
                        value={answer.answer_content}
                        // id={`answer` + i}
                        onChange={this.onInputchange.bind(this, i)}
                      />
                      // <Form.Check
                      //   key={i}
                      //   type="radio"
                      //   label={answer.answer_content}
                      //   name="formHorizontalRadios"
                      //   id={"task" + task.order_key + " ans" + i}
                      //   onChange={this.onInputchange}
                      // />
                    );
                  })}
                </Form.Group>

                {/* </div> */}
              </Div>
            );
          }
        })}
      </ThemeProvider>
    );
  }
}

export default Demographics;
