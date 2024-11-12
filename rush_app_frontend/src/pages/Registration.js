import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

import registrationStyle from '../styles/registration'
import axios from 'axios';
import brotherList from '../static/brothers';
import Webcam from "react-webcam";
import majors from "../static/majors";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import logo from "../static/akpsi-logo.png"
import noCamera from "../static/no-camera.png"
import Recaptcha from 'react-recaptcha';

const hearAboutUsOptions = [
	"Friend or relative in GT AKPsi",
	"Friend or relative NOT in GT AKPsi",
	"Instagram Account",
	"Instagram Ad",
	"GT 1000/2000 Advertisement",
	"Email Newsletter",
	"Canvas Announcement",
	"TikTok",
	"LinkedIn",
	"Reddit",
	"Email",
	"Flyer Found on Campus",
	"Via Another Organization",
	"AKPsi Website/Online Search",
	"Virtual Information Session",
	"Resume Blitz",
	"4/3 Networking Roundtable Event",
	"8/14 Week of Welcome Event",
	"8/27 and 8/28 Fall Org Fair",
	"9/4 Afternoon Tabling Event",
	"9/4 Interest Night",
	"9/6 Scheller Org Fair",
	"Other",
]

class Registration extends Component {

	constructor(props) {
		super(props);

		this.state = {
            firstName: '',
            lastName: '',
			email: '',
			gtid: '',
			major: '',
			referredBy: '',
			year: '',
			pronouns: '',
			discovery: '',
			housing: '',
			phoneNumber: '',	
			loading: false,
			errors: [],
			uploaded: false,
			// pis: false
		};
	}

	dataURLtoFile(dataurl) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), 
			n = bstr.length, 
			u8arr = new Uint8Array(n);
			
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], this.state.gtid+".jpeg", {type:mime});
	  }

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.UI && nextProps.UI.errors) {
			this.setState({
				errors: nextProps.UI.errors
			});
		}
	}

	step1NotDone() {
		return !this.state.email || 
		!this.state.firstName || 
		!this.state.lastName || 
		!this.state.gtid ||
		!this.state.major ||
		!this.state.year ||
		!this.state.discovery || 
		!this.state.phoneNumber ||
		!this.state.housing ||
		(this.state.discovery === "Brother in GT AKPsi" && !this.state.referredBy); 
	}
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	setWebcam = (webcam) => {
		this.webcam = webcam;
	};

	takePhoto = () => {
		const photo = this.webcam.getScreenshot({width: 400, height: 400});
		this.setState({ capture: photo });
	};

	retakePhoto = () => {
		this.setState({ capture: null });
	};

	verifyCallback = (response) => {
		if (response) {
		  this.setState({
			isVerified: true
		  })
		}
	  }

	handleSubmit = (event) => {
		event.preventDefault();
		if (!this.state.capture) {
			alert('Please take a photo of yourself!');
			return;
		} else if(!this.state.isVerified) {
			alert('Please verify that you are a human!')
			return;
		}
		this.setState({ loading: true });
		const newUserData = {
			name: this.state.firstName + " " + this.state.lastName,
			gtid: this.state.gtid,
			major: this.state.major,
			email: this.state.email,
			year: this.state.year,
			pronouns: this.state.pronouns,
			referredBy: this.state.referredBy,
			phoneNumber: this.state.phoneNumber,
			discovery: this.state.discovery,
			housing: this.state.housing
		};
		axios
			.post('/rushees', newUserData)
			.then((response) => {
				let form_data = new FormData();
				form_data.set('gtid', this.state.gtid);
				form_data.append('image', this.dataURLtoFile(this.state.capture));
				axios
				.post('/rusheeImage', form_data, {
					headers: {
						'content-type': 'multipart/form-data'
					}
				})
			}).then(() =>{
				this.setState({ 
					uploaded: true,
					loading: false
				});	
			})
			.catch((error) => {
				this.setState({
					errors: error.response.data,
					loading: false
				});
			});
	};

	recaptchaLoaded() {
		console.log('capcha successfully loaded');
	  }

	manageAttendance = () => {
        this.props.history.push('/attendance');
    }

	backToRegistration = () => {
		this.setState({ uploaded: false });
		window.location.reload();
	}

	// RIP Varsha's PIS popup - Monday, January 22nd 2024 6:26PM
	goToPIS = () => {
        window.open('https://docs.google.com/spreadsheets/d/1umTrhjXPs27EOtEhQLZq2rx3LrxIeCOikdrpHuzTFyE/edit#gid=2014805036');
		this.setState({ 
			pis: true,
			uploaded: false
		});	
    }

	render() {
		const { classes } = this.props;
		const { errors, loading } = this.state;
		// const {classes1} = useStyles();
		return (
			<div>
				<AppBar position="static" className={classes.appBar}>
					<Toolbar>
						<img src={logo} alt="logo" className={classes.logo} />
						<Typography variant="h4" className={classes.title} >
							Fall 2024 Rush Registration
						</Typography>
						<Box pl={2}>
                        	<Button variant="outlined" onClick={this.manageAttendance}>Manage Attendance</Button>
                    	</Box>
					</Toolbar>
				</AppBar>
				{/* <Dialog open={this.state.uploaded}>
					<DialogContent>
						<Grid container justify = "center">
							<img src={logo}  alt="logo" className={classes.logo} />
						</Grid>
						<Grid container justify = "center">
							<Typography variant="h4" className={classes.title} >
								Almost Done!
							</Typography>
							<Typography variant="h4" className={classes.title} >
								Make sure to sign up for a PIS.
							</Typography>
							<Typography variant="h7" align = "center" className={classes.title} >
								A PIS is a Personal Information Survey which is a casual interview with brothers. It's just a way for brothers to get to know you better. No need to worry, just be yourself!
							</Typography>
							<DialogTitle id="simple-dialog-title">  </DialogTitle>
							<Box pl={2}>
                        		<Button variant="outlined" onClick={this.goToPIS}>PIS Signup</Button>
                    		</Box>
						</Grid>
					</DialogContent>
				</Dialog> */}
				<Dialog open={this.state.uploaded}>
					<Grid container justify = "center">
						<DialogTitle id="simple-dialog-title">You're successfully registered, see you at rush!</DialogTitle>
						<Button onClick={this.backToRegistration}>Back to Registration</Button>
					</Grid>
				</Dialog>
				<Container component="main" maxWidth="lg">
					<div className={classes.paper}>
						<form className={classes.form} noValidate>
							<Grid container spacing={4}>
								<Grid container item className={classes.section} sm={6} spacing={4}>
									<Grid item xs={12}>
										<Typography variant="h5" className={this.step1NotDone() ? classes.currentTitle : classes.notCurrentTitle}>
											<b>STEP 1:</b> Let's get some basic information:
										</Typography>
									</Grid>
									<Grid item sm={6}>
										<TextField
											required
											fullWidth
											id="firstName"
											label="First Name"
											name="firstName"
											autoComplete="firstName"
											variant="outlined"
											onChange={this.handleChange}
										>
										</TextField>
									</Grid>

									<Grid item sm={6}>
										<TextField
											required
											fullWidth
											id="lastName"
											label="Last Name"
											name="lastName"
											autoComplete="lastName"
											variant="outlined"
											onChange={this.handleChange}
										>
										</TextField>
									</Grid>

									<Grid item md={6}>
										<TextField
											required
											fullWidth
											id="housing"
											label="Housing Building and Room #"
											name="housing"
											autoComplete="housing"
											variant="outlined"
											onChange={this.handleChange}
										>
										</TextField>
									</Grid>

									<Grid item md={6}>
										<TextField
											required
											fullWidth
											id="phoneNumber"
											label="Phone #"
											name="phoneNumber"
											autoComplete="phoneNumber"
											variant="outlined"
											onChange={this.handleChange}
										>
										</TextField>
									</Grid>

									<Grid item xs={12}>
										<TextField
											required
											fullWidth
											id="email"
											label="GT Email Address"
											name="email"
											autoComplete="email"
											variant="outlined"

											error={errors.email ? true : false}
											onChange={this.handleChange}
										/>
									</Grid>
									<Grid item sm={6}>
										<TextField
											required
											fullWidth
											name="gtid"
											// className={classes1.input}
											type="tel" 
											label="GT ID"
											// type="number"
											id="gtid"
											variant="outlined"
											error={errors.gtid ? true : false}

											onChange={this.handleChange}
										/>
									</Grid>

									<Grid item xs={6}>
										<TextField
											required
											fullWidth
											select
											id="major"
											label="Major"
											name="major"
											onChange={this.handleChange}
											variant="outlined"
										>
											{majors.map((major) => (
												<MenuItem key={major} value={major}>
													{major}
												</MenuItem>
											))}
										</TextField>
									</Grid>


									<Grid item xs={6}>
										<TextField
											required
											fullWidth
											select
											id="year"
											label="Year"
											name="year"
											autoComplete="year"
											variant="outlined"
											onChange={this.handleChange}
										>
											<MenuItem key={"1"} value={"1"}>{"1"}</MenuItem>
											<MenuItem key={"2"} value={"2"}>{"2"}</MenuItem>
											<MenuItem key={"3"} value={"3"}>{"3"}</MenuItem>
											<MenuItem key={"4"} value={"4"}>{"4"}</MenuItem>
											<MenuItem key={"5"} value={"5"}>{"5+"}</MenuItem>

										</TextField>
									</Grid>

									<Grid item sm={6}>
										<TextField
											fullWidth
											name="pronouns"
											label="Pronouns"
											type="string"
											id="pronouns"
											variant="outlined"
											onChange={this.handleChange}
										/>
									</Grid>

									<Grid item xs={12}>
										<TextField
											required
											fullWidth
											select
											id="discovery"
											label="How did you find about us?"
											name="discovery"
											autoComplete="discovery"
											onChange={this.handleChange}
											variant="outlined"

										>

											{hearAboutUsOptions.map(function(option) {
												return <MenuItem key={option} value={option}>{option}</MenuItem>
											})}

										</TextField>
									</Grid>

									<Grid item xs={6}>
										{this.state.discovery === "Brother in GT AKPsi" ? 
										<TextField
											required
											fullWidth
											select
											id="referredBy"
											label="Known Brother"
											name="referredBy"
											autoComplete="referredBy"
											onChange={this.handleChange}
											variant="outlined"
										>
											{brotherList.map((brother) => (
												<MenuItem key={brother} value={brother}>
													{brother}
												</MenuItem>
											))}
										</TextField> : null}
									</Grid>

								</Grid>
								<Divider orientation="vertical" className={classes.divider} flexItem />

								<Grid container item sm={6} spacing={2}>
									<Grid item xs={12}>
										<Typography variant="h5" className={!this.step1NotDone()  && !this.state.capture  ? classes.currentTitle : classes.notCurrentTitle}>
											<b>STEP 2:</b> Let's get a quick photo:
										</Typography>
									</Grid>
									<Grid container item xs={12} justify="center" >
										{this.step1NotDone() ? (<img src={noCamera} alt={"no camera"} width={400}/>) :
											(this.state.capture ? (
													<img
														required
														className="capturedPhoto"
														alt={"rushee capture"}
														src={this.state.capture}
													/>
												) : 									
												<Webcam
													audio={false}
													ref={this.setWebcam}
													screenshotFormat="image/jpeg"
													videoConstraints={{width: 400, height: 400}}/>
											) 
										}
									</Grid>
									<Grid container justify="center" >
										<Grid item>
										<Button
											type="button"
											variant="contained"
											size="large"
											disabled={this.step1NotDone()}
											color={(!this.step1NotDone() && !this.state.capture) ? "primary" : ""}

											onClick={this.state.capture ? this.retakePhoto : this.takePhoto}>
											{this.state.capture ? "Retake Photo" : "Take Photo"}
										
										</Button>
										</Grid>
									</Grid>
								</Grid>
								<Grid item>
										{errors.general && (
										<Typography variant="body2" className={classes.customError}>
											{errors.general}
										</Typography>
									)}
								</Grid>
								<Grid xs={12} container item >
									<Recaptcha
										sitekey="6Ld8tTYaAAAAAE_PB87FJf13vuhjtOToYU3ri22d"
										render="explicit"
										onloadCallback={this.recaptchaLoaded}
										verifyCallback={this.verifyCallback}
									/>
								</Grid>
								<Grid xs={12} container item  >
									<Button
										type="submit"
										variant="contained"
										color="primary"
										className={classes.submit}
										size="large"
										onClick={this.handleSubmit}
										disabled={loading || 
											this.step1NotDone() ||
											!this.state.capture || !this.state.isVerified
											}
										>
										Register
										{loading && <CircularProgress size={30} className={classes.progess} />}
									</Button>
								</Grid>

							</Grid>

						</form>
					</div>
				</Container>
			</div>
		);
	}
}

export default withStyles(registrationStyle)(Registration);
