import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Api from '../api';
import * as Responses from '../api/responses';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  root: {
    padding: "24px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  title: {
    textAlign: "center"
  },
  error: {
    color: "red"
  },
  logInButton: {
    width: "100%"
  }
});

export interface LogInProps extends WithStyles<typeof styles> {
  onSuccess: (response: Responses.IAuthenticateResponse) => void;
}

interface LogInState {
  username: string,
  password: string,
  signingIn: boolean,
  error: string | null
}

class LogIn extends React.Component<LogInProps, LogInState> {
  
  state: LogInState = {
    username: "",
    password: "",
    signingIn: false,
    error: null
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography variant="h2" className={classes.title}>
          SAR4H
        </Typography>
        <TextField
          id="username"
          label="Username"
          margin="normal"
          fullWidth={true}
          disabled={this.state.signingIn}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="normal"
          fullWidth={true}
          disabled={this.state.signingIn}
          onChange={(e) => this.setState({ password: e.target.value })}
        />

        <p className={classes.error}>{this.state.error}</p>
        <Button
          className={classes.logInButton}
          variant="contained"
          color="primary"
          disabled={this.state.signingIn}
          onClick={this.logIn}>
            Log In
        </Button>
      </div>
    );
  }

  logIn = async () => {

    if (this.state.username.length === 0) {
      this.goToErrorState("You must enter a username!");
      return;
    }
    
    if (this.state.password.length === 0) {
      this.goToErrorState("You must enter a password!");
      return;
    }

    this.goToSigningInState();

    try {
      var response = await Api.authenticateAsync(this.state.username, this.state.password);

      if (response.data.token) {
        this.props.onSuccess(response);
      } else {
        this.goToErrorState("Unknown error. Token not present.");
      }
    } catch (err) {
      this.goToErrorState(err.toString());
    }
  }

  goToSigningInState() {
    this.setState({
      signingIn: true,
      error: null
    });
  }

  goToErrorState(error: string) {
    this.setState({
      signingIn: false,
      error: error
    });
  }
}

export default withStyles(styles)(LogIn);