import { CalendarScreen } from "./CalendarScreen";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { getToday } from "./dateFunctions";
import { useEffect, useState } from "react";
import { getUserEndPoint, IUser } from "./backend";
import { LoginScreen } from "./LoginScreen";

function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndPoint().then(
      () => setUser(user),
      () => setUser(null)
    );
  });

  if (user) {
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
    return <LoginScreen onSignIn={(user) => setUser(user)} />;
  }
}

export default App;
