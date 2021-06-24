import { CalendarScreen } from "./CalendarScreen";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { getToday } from "./dateFunctions";
import { useEffect, useState } from "react";
import { getUserEndPoint } from "./backend";
import { LoginScreen } from "./LoginScreen";

function App() {
  const month = getToday().substring(0, 7);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    getUserEndPoint().then(
      () => {
        setHasSession(true);
      },
      () => {
        setHasSession(false);
      }
    );
  });

  if (hasSession) {
    return (
      <Router>
        <Switch>
          <Route path="/calendar/:month">
            <CalendarScreen></CalendarScreen>;
          </Route>
          <Redirect to={{ pathname: "/calendar/" + month }}></Redirect>
        </Switch>
      </Router>
    );
  } else {
    return <LoginScreen />;
  }
}

export default App;
