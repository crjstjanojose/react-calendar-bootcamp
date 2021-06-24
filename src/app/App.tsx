import { CalendarScreen } from "./CalendarScreen";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { getToday } from "./dateFunctions";
import { useEffect, useState } from "react";
import { getUserEndPoint, IUser } from "./backend";
import { LoginScreen } from "./LoginScreen";
import { userContext } from "./authContext";

function App() {
  const month = getToday().substring(0, 7);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    getUserEndPoint().then(
      (user) => setUser(user),
      () => signOut()
    );
  }, [user]);

  function signOut() {
    setUser(null);
  }

  if (user) {
    return (
      <userContext.Provider value={user}>
        <Router>
          <Switch>
            <Route path="/calendar/:month">
              <CalendarScreen onSignOut={signOut}></CalendarScreen>;
            </Route>
            <Redirect to={{ pathname: "/calendar/" + month }}></Redirect>
          </Switch>
        </Router>
      </userContext.Provider>
    );
  } else {
    return <LoginScreen onSignIn={(user) => setUser(user)} />;
  }
}

export default App;
