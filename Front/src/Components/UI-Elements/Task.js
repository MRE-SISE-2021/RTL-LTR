import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/_Aux";
import * as actionTypes from "../../store/actions";
import QuestionsInput from "../UI-Elements/QuestionsInput";
import Input from "../UI-Elements/PagesInput";
import { Card } from "react-bootstrap";
import { CardBody } from "react-bootstrap/Card";

class Task extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = { inputList: [] };
  }

  //define task type according to compTypeId
  componentDidMount() {
    // console.log(this.props);
    const inputList = this.state.inputList;

    switch (this.props.compTypeId) {
      case 1:
        this.setState({
          inputList: inputList.concat(
            <Input
              key={"page" + this.props.key}
              expId={this.props.expId}
              keyOrder={this.props.keyOrder}
              label={this.props.label}
              taskId={this.props.taskId}
              title={this.props.title}
              compTypeId={this.props.compTypeId}
              answers={this.props.answers}
            />
          ),
        });
        break;
      case 2:
        this.setState({
          inputList: inputList.concat(
            <QuestionsInput
              key={"range" + this.props.key}
              expId={this.props.expId}
              keyOrder={this.props.keyOrder}
              label={this.props.label}
              taskId={this.props.taskId}
              title={this.props.title}
              compTypeId={this.props.compTypeId}
              answers={this.props.answers}
            />
          ),
        });
        break;
      case 3:
        this.setState({
          inputList: inputList.concat(
            <QuestionsInput
              key={"text" + this.props.key}
              expId={this.props.expId}
              keyOrder={this.props.keyOrder}
              label={this.props.label}
              taskId={this.props.taskId}
              title={this.props.title}
              compTypeId={this.props.compTypeId}
              answers={this.props.answers}
            />
          ),
        });
        break;
      default:
        break;
    }
    // console.log(this.state);
  }
  render() {
    return (
      <Aux>

        <div style={{
          width: '60rem',
          marginBottom:"3%",
          marginLeft: "25%"
        }}>
             {this.state.inputList.map(function (input, index) {
              return input;
            })}
        

        </div>
       
          
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    defaultPath: state.defaultPath,
    collapseMenu: state.collapseMenu,
    layout: state.layout,
    fullWidthLayout: state.fullWidthLayout,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onComponentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Task);
