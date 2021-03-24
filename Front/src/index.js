import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reducer from "./store/reducer";
import config from "./config";
import "./assets/scss/style.scss";
import ExperimentPage from "./Pages/ExperimentPage";
import PreviewPage from "./Pages/PreviewPage";
import Login from "./Components/Login";
import { CookiesProvider } from "react-cookie";

const store = createStore(reducer);

const app = (
  <CookiesProvider>
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
        <Switch>
          <Route exact path="/home" component={App} />
          <Route exact path="/" component={Login} />
          <Route
            path="/create/:name/:type/:language/:dir/:id"
            component={ExperimentPage}
          />
          <Route path="/preview/:id" component={PreviewPage} />
        </Switch>
      </BrowserRouter>
    </Provider>
  </CookiesProvider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
