// Material UI components
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import firebaseAdmin from '../util/firebase';
import logo from "../static/akpsi-logo.png"
import loginStyles from '../styles/login'




class PasswordReset extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            errors: [],
            loading: false,
            sentText: ""
        };

    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
            sentText: ""
        });
        firebaseAdmin
            .auth()
            .sendPasswordResetEmail(this.state.email)
            .then(() => {
                this.setState({
                    loading: false,
                    errors: [],
                    sentText: "Successfully Sent. Check your inbox."
                });
            })
            .catch((err) => {
                var errors = {}
                switch(err.code) {
                    case "auth/invalid-email":
                        errors["email"] = err.message;
                        break;
                    case "auth/user-not-found":
                        errors["email"] = err.message;
                        break;
                    default:
                        break;
                }
                this.setState({
                    errors: errors,
                    loading: false,
                    sentText: errors.email
                });
                console.log(err);
            });
    };


    render() {
        const { classes } = this.props;
        const { errors, loading, sent } = this.state;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <img src={logo} alt={"logo"} width={300}></img>

                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            helperText={this.state.sentText}
                            error={errors.email ? true : false}
                            onChange={this.handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleSubmit}
                            disabled = {loading || !this.state.email }
                        >
                            Send Email
                            {loading && <CircularProgress size={30} className={classes.progress}/> }
                        </Button>

                    </form>
                </div>
            </Container>
        )
    }
}



export default withStyles(loginStyles)(PasswordReset);
