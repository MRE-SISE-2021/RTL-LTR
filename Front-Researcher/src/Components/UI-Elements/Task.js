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
    this.updateDelete = this.updateDelete.bind(this);
  }
  //Call delete task from pareant component(Components Table)
  updateDelete(value) {
    this.props.updateDelete(value);
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
              dir={this.props.dir}
              is_add_picture_setting={this.props.is_add_picture_setting}
              is_direction_setting={this.props.is_direction_setting}
              is_new_page_setting={this.props.is_new_page_setting}
              is_required_setting={this.props.is_required_setting}
              lang={this.props.lang}
              updateDelete={this.updateDelete}
            />
          ),
        });
        break;
      case 11:
        this.setState({
          inputList: inputList.concat(
            <Input
              key={"info_page" + this.props.key}
              expId={this.props.expId}
              keyOrder={this.props.keyOrder}
              label={this.props.label}
              taskId={this.props.taskId}
              title={this.props.title}
              compTypeId={this.props.compTypeId}
              answers={this.props.answers}
              dir={this.props.dir}
              is_add_picture_setting={this.props.is_add_picture_setting}
              is_direction_setting={this.props.is_direction_setting}
              is_new_page_setting={this.props.is_new_page_setting}
              is_required_setting={this.props.is_required_setting}
              lang={this.props.lang}
              updateDelete={this.updateDelete}
            />
          ),
        });
        break;
      case 12:
        this.setState({
          inputList: inputList.concat(
            <Input
              key={"inst_page" + this.props.key}
              expId={this.props.expId}
              keyOrder={this.props.keyOrder}
              label={this.props.label}
              taskId={this.props.taskId}
              title={this.props.title}
              compTypeId={this.props.compTypeId}
              answers={this.props.answers}
              dir={this.props.dir}
              is_add_picture_setting={this.props.is_add_picture_setting}
              is_direction_setting={this.props.is_direction_setting}
              is_new_page_setting={this.props.is_new_page_setting}
              is_required_setting={this.props.is_required_setting}
              lang={this.props.lang}
              updateDelete={this.updateDelete}
            />
          ),
        });
        break;
      default:
        this.setState({
          inputList: inputList.concat(
            <QuestionsInput
              key={"text" + this.props.key}
              expId={this.props.expId}
              dir={this.props.dir}
              keyOrder={this.props.keyOrder}
              label={this.props.label}
              taskId={this.props.taskId}
              title={this.props.title}
              compTypeId={this.props.compTypeId}
              answers={this.props.answers}
              is_add_picture_setting={this.props.is_add_picture_setting}
              is_direction_setting={this.props.is_direction_setting}
              is_new_page_setting={this.props.is_new_page_setting}
              is_required_setting={this.props.is_required_setting}
              lang={this.props.lang}
              delete={this.updateDelete}
              images={this.props.images}
            />
          ),
        });
        break;
    }
    // console.log(this.state);
  }
  render() {
    return (
      <Aux>
        <div
          style={{
            width: "60rem",
            marginBottom: "3%",
            marginLeft: "25%",
          }}
        >
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
