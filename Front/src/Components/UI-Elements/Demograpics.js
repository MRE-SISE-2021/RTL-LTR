import React from "react";
import styled, { ThemeProvider } from "styled-components";
import rtl from "styled-components-rtl";
class Demographics extends React.Component {
  constructor(props) {
    super(props);
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
    };
  }

  componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }
  async componentDidMount() {
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
    if (this.props.lang === 1 || this.props.lang === 2) {
      theme = {
        dir: "rtl",
      };
    }

    this.state.tasks.forEach((task, index) => {
      console.log(this.state.is_demographics[index]);
      let inputList = this.state.inputList;
      if (this.state.is_demographics[index] === true) {
        let type = "radio";
        if (index === 10 || index === 4 || index === 2) {
          type = "checkbox";
        }
        console.log(task);
        this.setState({
          inputList: inputList.concat(
            <ThemeProvider theme={theme}>
              <Div key={"task" + index}>
                <h4>{task.label}</h4>
                {task.answers.map(function (answer, index) {
                  return (
                    <div key={index}>
                      <input
                        // className="input_preview"

                        type={type}
                        key={index}
                        name="ans"
                      />
                      {answer.answer_content}
                    </div>
                  );
                })}
              </Div>
            </ThemeProvider>
          ),
        });
        console.log(this.state);
      }
    });
  }
  render() {
    console.log(this.state);
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
    let actual_index = 0;
    return (
      <ThemeProvider theme={theme}>
        {this.state.tasks.map((task, index) => {
          console.log(index);
          if (this.state.is_demographics[index] === true) {
            actual_index = actual_index + 1;
            let type = "radio";
            if (index === 10 || index === 4 || index === 2) {
              type = "checkbox";
            }
            // Return the element. Also pass key
            return (
              <Div key={"task" + index}>
                <h4>
                  {actual_index}. {task.label}
                </h4>
                {task.answers.map(function (answer, index) {
                  return (
                    <div key={index}>
                      <input
                        // className="input_preview"

                        type={type}
                        key={index}
                        name="ans"
                      />
                      {answer.answer_content}
                    </div>
                  );
                })}
              </Div>
            );
          }
        })}
      </ThemeProvider>
    );
  }
}

export default Demographics;
