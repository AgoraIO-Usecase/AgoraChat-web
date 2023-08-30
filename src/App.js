import "./App.css";

import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import { createHashHistory } from "history";
import Login from "./layout/login";
import Main from "./layout/main";
import Signup from "./layout/signup";

import initListen from "./utils/WebIMListen";
import Loading from "./components/common/loading";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Provider } from "chatuim2";
import { handleError } from "./handleError";
const history = createHashHistory();

const AuthorizedComponent = (props) => {
  const Component = props.component;
  const webimAuth = sessionStorage.getItem("webim_auth");

  return webimAuth ? (
    <Switch>
      <Redirect to="/main" render={(props) => <Component {...props} />} />
    </Switch>
  ) : (
    <Redirect to="/login" />
  );
};

function App() {
  const isFetching = useSelector((state) => state?.isFetching) || false;
  useEffect(() => {
    initListen();
  }, []);
  return (
    <div className="App">
      <Loading show={isFetching} />
      <Provider
        onError={handleError}
        initConfig={{
          appKey: "41117440#383391"
        }}
      >
        <HashRouter basename="/" history={history}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/main" component={Main} />

            <Route exact path="/signup" component={Signup} />
            <Route
              path="/"
              render={() => (
                <AuthorizedComponent token={"11"} component={Main} />
              )}
            />
          </Switch>
        </HashRouter>
      </Provider>
    </div>
  );
}

export default App;
