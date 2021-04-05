import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./assets/scss/style.scss";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import reducer from "./store/reducer";
import NotActivePage from "./Pages/NotActivePage";
import FinishPage from "./Pages/FinishPage";
const store = createStore(reducer);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/survey/:hosted_link" component={App} />
        <Route exact path="/not_active" component={NotActivePage} />
        <Route
          exact
          path="/survey/:hosted_link/finish"
          component={FinishPage}
        />
      </Switch>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
