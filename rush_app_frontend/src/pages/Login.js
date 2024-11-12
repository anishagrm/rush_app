// Material UI components
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import loginSytles from '../styles/login'
import logo from "../static/akpsi-logo.png"
import firebaseAdmin from "../util/firebase"

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			errors: [],
			loading: false
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if(nextProps.UI && "errors" in nextProps.UI){
			if (nextProps.UI.errors) {
			return {
				errors: nextProps.UI.errors
			};
		}
		}
		return null;
	}

	// updates the state when text fields change
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		firebaseAdmin
			.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then(() => {
				this.setState({
					loading: false
				});
				this.props.history.push('/');
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
					case "auth/wrong-password":
						errors["password"] = err.message;
						break;
					default:
						break;
				}
				this.setState({
					errors: errors,
					loading: false
				});
				console.log(err);
			});
	};

	render() {
		const { classes } = this.props;
		const { errors, loading } = this.state;
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
							helperText={errors.email}
							error={errors.email ? true : false}
							onChange={this.handleChange}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							helperText={errors.password}
							error={errors.password ? true : false}
							onChange={this.handleChange}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={this.handleSubmit}
							disabled={loading || !this.state.email || !this.state.password}
						>
							Sign In
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container>
							<Grid item>
								<Link href="signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
							<Grid item>
								<Link href="passwordReset" variant="body2">
									{"Forgot your password? Click here to send a reset email"}
								</Link>
							</Grid>
						</Grid>
						{errors.general && (
							<Typography variant="body2" className={classes.customError}>
								{errors.general}
							</Typography>
						)}
					</form>
				</div>
			</Container>
		);
	}
}

export default withStyles(loginSytles)(Login);
