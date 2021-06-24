import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { useState } from "react";
import { IUser, signEndPoint } from "./backend";

const useStyles = makeStyles({
  error: {
    backgroundColor: "rgba(255,223,222)",
    padding: "6px;",
    marginTop: "8px",
    color: "rgb(255,0,0)",
    borderRadius: "3px",
  },
});

interface ILoginScreenProps {
  onSignIn: (user: IUser) => void;
}

export function LoginScreen(props: ILoginScreenProps) {
  const [email, setEmail] = useState("danilo@email.com");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const classes = useStyles();

  function signIn(evt: React.FormEvent) {
    evt.preventDefault();
    signEndPoint(email, password).then(
      (user) => {
        props.onSignIn(user);
      },
      (error) => {
        setError("E-mail não encontrado ou senha incorreta.");
      }
    );
  }

  return (
    <Container maxWidth="sm">
      <h1>Agenda React</h1>
      <p>
        Digite e-mail e senha para entrar no sistema, Para testar, use o e-mail{" "}
        <kbd>danilo@email.com</kbd>e a senha <kbd>1234</kbd>.
      </p>
      <form onSubmit={signIn}>
        <TextField
          label="E-mail"
          variant="outlined"
          fullWidth
          type="text"
          margin="normal"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        {error && <div className={classes.error}>{error}</div>}
        <Box marginTop="10px" textAlign="right">
          <Button variant="contained" color="primary" type="submit">
            Entrar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
