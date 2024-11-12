import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { CardMedia } from "@material-ui/core";
import rusheeCardStyle from "../styles/rusheeCard";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";
import AddSurvey from "./AddSurvey";
import "react-quill/dist/quill.snow.css";
import SurveyDetail from "./SurveyDetail";
import PISDetail from "./PISDetail";
import BidcommDetail from "./BidcommDetail";
import BrothersList from "./BrothersList";

class RusheeCard extends Component {
	constructor(props) {

		super(props);
		this.state = {
			addSurveyExpanded: false,
			viewSurveyDetailExpanded: false,
			viewPISDetailExpanded: false,
			viewBidcommDetailExpanded: false,
			viewBrothersListExpanded: false,
		};



	}

	editSurvey = (e, value) => {
		if (this.state.addSurveyExpanded) {
			this.setState({
				addSurveyExpanded: false,
			});
		} else {
			this.setState({
				addSurveyExpanded: true,
				viewSurveyDetailExpanded: false,
				viewPISDetailExpanded: false,
				viewBidcommDetailExpanded: false,
				viewBrothersListExpanded: false,
			});
		}
	};

	viewSurveyDetail = (e, value) => {
		if (this.state.viewSurveyDetailExpanded) {
			this.setState({
				viewSurveyDetailExpanded: false,
			});
		} else {
			this.setState({
				viewSurveyDetailExpanded: true,
				addSurveyExpanded: false,
				viewPISDetailExpanded: false,
				viewBidcommDetailExpanded: false,
				viewBrothersListExpanded: false,
			});
		}
	};

	viewPISDetail = (e, value) => {
		if (this.state.viewPISDetailExpanded) {
			this.setState({
				viewPISDetailExpanded: false,
			});
		} else {
			this.setState({
				viewPISDetailExpanded: true,
				addSurveyExpanded: false,
				viewSurveyDetailExpanded: false,
				viewBidcommDetailExpanded: false,
				viewBrothersListExpanded: false,
			});
		}
	};

	/**
	 * Changes the state of the
	 * @param {*} e 
	 * @param {*} value 
	 */
	viewBrothersList = (e, value) => {
		if (this.state.viewBrothersListExpanded) {
			this.setState({
				viewBrothersListExpanded: false
			})
		} else {
			this.setState({
				viewPISDetailExpanded: false,
				addSurveyExpanded: false,
				viewSurveyDetailExpanded: false,
				viewBidcommDetailExpanded: false,
				viewBrothersListExpanded: true,
			})
		}
	}

	verifyNights = (rushee) => {
		
		let newAttendance = []

		rushee.nights.forEach((night) => {
			if (!newAttendance.includes(night)) {
				newAttendance.push(night)
			}
		})

		return newAttendance

	}

	render() {
		const { classes } = this.props;
		var rushee = this.props.rushee;
		rushee.nights = this.verifyNights(rushee);
		var discovery = rushee.discovery;

		if (discovery === "Brother in GT AKPsi") {
			discovery = "Introduced by " + rushee.referredBy;
		}
		return (
			<div className={classes.root}>
				<Card className={classes.card}>
					<Grid container>
						<Grid item xs={12} sm={4}>
							<CardMedia className={classes.cover} image={rushee.image} />
						</Grid>
						<Grid item xs={12} sm={8}>
							<CardContent>       
                                <Grid container className = {classes.name}>
                                    <Grid item xs = {11}>
                                        <Typography component="h5" variant="h5">{rushee.name}</Typography>
                                    </Grid>
                                    <Grid className = {classes.numberBox} item xs = {1}>
                                        <Typography className = {classes.number} component= "h6" variant = "h6">{rushee.number}</Typography>
                                    </Grid>
                                </Grid>

								<Grid container className={classes.content} spacing={2}>
									<Grid item xs={8}>
										<Typography variant="subtitle1" color="textSecondary">
											{"Major: " + rushee.major}
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{"Year: " + rushee.year}
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{"Pronouns: " + rushee.pronouns}
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{"Total Yes: " + rushee.totalYes}
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{"Total Survey: " + rushee.totalSurveys}
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{"Nights: " + rushee.nights.toString()}
										</Typography>
										<Typography variant="subtitle1" color="textSecondary">
											{"Heard through: " + discovery}
										</Typography>
									</Grid>

									<Grid item xs={4}>
										<Typography variant="subtitle1" color="textSecondary">
											{"Professionalism: " +
												(rushee.professionalism !== "N/A"
													? rushee.professionalism + "%"
													: "N/A")}
										</Typography>
										<Divider />
										<Typography variant="subtitle1" color="textSecondary">
											{"Why AKPSi: " +
												(rushee.leadership !== "N/A"
													? rushee.leadership + "%"
													: "N/A")}
										</Typography>
										<Divider />
										<Typography variant="subtitle1" color="textSecondary">
											{"1:1 interactions: " +
												(rushee.brotherhood !== "N/A"
													? rushee.brotherhood + "%"
													: "N/A")}
										</Typography>
										<Divider />
										<Typography variant="subtitle1" color="textSecondary">
											{"Group Interactions: " +
												(rushee.growth !== "N/A" ? rushee.growth + "%" : "N/A")}
										</Typography>
									</Grid>
								</Grid>
							</CardContent>
							<CardActions>
								<Button
									size="small"
									color="secondary"
									onClick={this.editSurvey}
									disabled={!this.props.constants.allowEditSurvey}
								>
									Add/Edit Survey
								</Button>
								<Divider orientation="vertical" flexItem />
								<Button
									size="small"
									color="secondary"
									onClick={this.viewSurveyDetail}
								>
									All Surveys
								</Button>
								<Button
									size="small"
									color="secondary"
									onClick={this.viewPISDetail}
								>
									PIS
								</Button>
								<Button
									size="small"
									color="secondary"
									onClick={this.viewBrothersList}
								>
									View Brothers List
								</Button>
							</CardActions>
						</Grid>
					</Grid>
				</Card>
				<Collapse in={this.state.viewSurveyDetailExpanded} unmountOnExit>
					<SurveyDetail
						rushee={this.props.rushee}
						constants={this.props.constants}
						close={this.viewSurveyDetail}
						history={this.props.history}
						onBidcomm={this.props.onBidcomm}
					></SurveyDetail>
				</Collapse>
				<Collapse in={this.state.viewPISDetailExpanded} unmountOnExit>
					<PISDetail
						rushee={this.props.rushee}
						constants={this.props.constants}
						close={this.viewPISDetail}
						history={this.props.history}
						onBidcomm={this.props.onBidcomm}
					></PISDetail>
				</Collapse>
				<Collapse in={this.state.addSurveyExpanded} unmountOnExit>
					<AddSurvey
						rushee={this.props.rushee}
						close={this.editSurvey}
						history={this.props.history}
						getUpdatedRushees={this.props.getUpdatedRushees}
					></AddSurvey>
				</Collapse>
				<Collapse in={this.state.viewBidcommDetailExpanded} unmountOnExit>
					<BidcommDetail
						rushee={this.props.rushee}
						close={this.viewBidcommDetail}
						history={this.props.history}
					></BidcommDetail>
				</Collapse>
				<Collapse in={this.state.viewBrothersListExpanded} unmountOnExit>
					<BrothersList
						rushee={this.props.rushee}
						close={this.viewBrothersList}
						history={this.props.history}
					/>
				</Collapse>
			</div>
		);
	}
}

export default withStyles(rusheeCardStyle)(RusheeCard);
