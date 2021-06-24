import { CalendarScreen } from "./CalendarScreen";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { getToday } from "./dateFunctions";
import { useEffect, useState } from "react";
import { getUserEndPoint, IUser } from "./backend";
import { LoginScreen } from "./LoginScreen";
import { authContext } from "./authContext";

function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndPoint().then(
      (user) => setUser(user),
      () => onSignOut()
    );
  }, [user]);

  function onSignOut() {
    setUser(null);
  }

  if (user) {
    return (
      <authContext.Provider value={{ user, onSignOut }}>
        <Router>
          <Switch>
            <Route path="/calendar/:month">
              <CalendarScreen></CalendarScreen>;
            </Route>
            <Redirect to={{ pathname: "/calendar/" + month }}></Redirect>
          </Switch>
        </Router>
      </authContext.Provider>
    );
  } else {
    return <LoginScreen onSignIn={(user) => setUser(user)} />;
  }
}

export default App;
