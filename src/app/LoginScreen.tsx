import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { useState } from "react";

export function LoginScreen() {
  const [email, setEmail] = useState("danilio@email.com");
  const [password, setPassword] = useState("1234");

  function signIn(evt: React.FormEvent) {
    evt.preventDefault();
    console.log("signIn");
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
          type="password "
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        <Box marginTop="10px" textAlign="right">
          <Button variant="contained" color="primary" type="submit">
            Entrar
          </Button>
        </Box>
      </form>
    </Container>
  );
}
