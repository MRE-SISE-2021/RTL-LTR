import React from "react";
import { Modal, Button } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

class SaveModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBasic: false,
      isVertically: false,
      isTooltip: false,
      isGrid: false,
      isScrolling: false,
      isLarge: false,
      title: "",
      name: this.props.data.name,
      lang: this.props.data.lang,
    };
    this.onAddBtnClick = this.onAddBtnClick.bind(this);
    this.getLangId = this.getLangId.bind(this);
  }

  getLangId() {
    switch (this.state.lang) {
      case "eng":
        return "2";
      case "heb":
        return "3";
      case "ar":
        return "1";
      case "ru":
        return "4";
      default:
        return "2";
    }
  }
  onAddBtnClick() {
    const langId = this.getLangId();
    console.log(this.props.data);
    const response = {
      creation_date: Date().toLocaleString(), //
      questionnaire_name: this.state.name,
      hosted_link: "https://www.youtube.com/",
      is_active: "true",
      language_id: langId,
      questionnaire_type_id: "1", //
    };
    console.log(response);
    const requestOptions = {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };

    fetch("http://127.0.0.1:8000/viewset/questionnaire/", requestOptions)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong ...");
        }
      })
      .catch((error) => this.setState({ error }));

    this.setState({ isBasic: false });
  }

  render() {
    return (
      <div className="mr-5">
        <Button
          variant="outline-*"
          onClick={() => this.setState({ isBasic: true })}
        >
          <MDBIcon icon="save" />
        </Button>
        <Modal
          show={this.state.isBasic}
          onHide={() => this.setState({ isBasic: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title as="h5">All Data Will be Saved!</Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.onAddBtnClick}>
              Save!
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default SaveModal;
