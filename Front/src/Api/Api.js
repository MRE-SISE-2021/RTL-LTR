function post(url = "", response = {}) {
  const PostRequestOptions = {
    method: "post",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };

  fetch(url, PostRequestOptions)
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something went wrong ...");
      }
    })
    .catch((error) => this.setState({ error }));
}

///////////////////////////////////////////////////////////////////////////
function put(url = "", response = {}) {
  const PostRequestOptions = {
    method: "put",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };

  fetch(url, PostRequestOptions)
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        // throw new Error("Something went wrong ...");
      }
    })
    .catch((error) => this.setState({ error }));
}
////////////////////////////////////////////////////////////////////////////
class API {
  ENDPOINT = "http://127.0.0.1:8000/";

  //Post -- create new EXP
  createNewExp = (name, langId) => {
    const response = {
      //tasks
      tasks: [
        {
          answers: [],
          components: [],
          images: [],
          task_title: "jj",
          task_content: "", ////////?
          is_required: true, ///////?
        },
      ],
      //data
      creation_date: "2021-01-06 23:25", //
      questionnaire_name: name,
      hosted_link: "", //
      is_active: "true",
      language_id: langId,
      questionnaire_type_id: "1", //
    };
    post(this.ENDPOINT + "questionnaire-preview-data", response);
    return response.questionnaire_id;
  };

  //   getAllExperiments = () => {
  //     fetch("http://127.0.0.1:8000/viewset/questionnaire")
  //       .then((res) => res.json())
  //       .then((result) => {
  //         console.log(result);
  //         return result;
  //       });
  //   };
}
export default new API();
