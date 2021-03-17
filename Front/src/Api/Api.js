import axiosInstance from '../axios';

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await axiosInstance.post(url, data)
  //{
  //   method: "POST", // *GET, POST, PUT, DELETE, etc.
  //   mode: "cors", // no-cors, *cors, same-origin
  //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //   credentials: "same-origin", // include, *same-origin, omit
  //   redirect: "follow", // manual, *follow, error
  //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //   body: JSON.stringify(data), // body data type must match "Content-Type" header
  // })
  .then((result) => {
    return result.data;
  });

  return response; // parses JSON response into native JavaScript objects
}

async function putData(url = "", data = {}) {
  // Default options are marked with *
  const response = await axiosInstance.put(url, data)
    //{
  //   method: "PUT", // *GET, POST, PUT, DELETE, etc.
  //   mode: "cors", // no-cors, *cors, same-origin
  //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //   credentials: "same-origin", // include, *same-origin, omit
  //   redirect: "follow", // manual, *follow, error
  //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //   body: JSON.stringify(data), // body data type must match "Content-Type" header
  // });
  .then((result) => {
    return result.data;
  });

  return response; // parses JSON response into native JavaScript objects
}

async function deleteData(url = "", data = {}) {
  // Default options are marked with *
  const response = await axiosInstance.delete(url, data)
  // {
  //   method: "DELETE", // *GET, POST, PUT, DELETE, etc.
  //   mode: "cors", // no-cors, *cors, same-origin
  //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //   credentials: "same-origin", // include, *same-origin, omit
  //   redirect: "follow", // manual, *follow, error
  //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //   body: JSON.stringify(data), // body data type must match "Content-Type" header
  // });
  .then((result) => {
    return result.data;
  });
  
  return response; // parses JSON response into native JavaScript objects
}

////////////////////////////////////////////////////////////////////////////
class API {
  // ENDPOINT = "http://127.0.0.1:8000/";

  putRequest(url, response) {
    //return putData(this.ENDPOINT + url, response);
    return putData(url, response);
  }

  deleteRequest(url, response) {
    //return deleteData(this.ENDPOINT + url, response);
    return deleteData(url, response);
  }

  postRequest(url, response) {
    //return postData(this.ENDPOINT + url, response);
    return postData(url, response);
  }
}
export default new API();
