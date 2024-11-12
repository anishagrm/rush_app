import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import pisDetailStyle from '../styles/pisDetails';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import firebaseAdmin from "../util/firebase";
import axios from 'axios';


class PISDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
            loading: true,
            hidePIS: !props.constants.showAllPIS && !props.onBidcomm
        };

        console.log(this.props.rushee.PIS)

    };


	render() {
        const { classes, rushee } = this.props;
        var pis = rushee.PIS;
        if (this.state.hidePIS) {
            return (
                <div>
                    <LinearProgress/>
                    <Grid container justify='flex-end' spacing={1}>
                    <Grid item xs={12} sm={8}>
                        <Card className={classes.question}>
                            <Typography variant="h6"><i>Hiding surveys for now!</i></Typography>
                        </Card>
                    </Grid>
                    </Grid>
                </div>

            )
        }
        if(!pis) {
            return(
            <Grid container justify='flex-end' spacing={1}>
                <Grid item xs={12} sm={8}>
                    <Card className={classes.question}>
                        <Typography variant="h6"><i>No PIS yet!</i></Typography>
                    </Card>
                </Grid>
            </Grid>
            )

        }

        return (
            <Grid container justify='flex-end' spacing={1}>

            <Grid item xs={12} sm={4}>
                <Card className={classes.question}>
                    <Typography variant="subtitle1"><b>Brother 1:</b> {pis.brothers[0]}</Typography>
                    {pis.brotherReviews.bids[0] ? <Typography variant="subtitle2"><i>would extend bid</i></Typography> :
                    <Typography variant="subtitle2"><i>would <b>not</b> extend a bid</i></Typography>}
                    {pis.brotherReviews.present[0] ? <Typography variant="subtitle2"><i>Will be present at bid vote</i></Typography> :
                    <Typography variant="subtitle2"><i>Will <b>not</b> be present at bid vote</i></Typography>}
                    <div dangerouslySetInnerHTML={{__html: pis.brotherReviews.reviews[0]}}></div>
                </Card>
            </Grid>
            {
                pis.brothers[1] !== "" ? <Grid item xs={12} sm={4}>
                <Card className={classes.question}>
                <Typography variant="subtitle1"><b>Brother 2:</b> {pis.brothers[1]}</Typography>
                    {pis.brotherReviews.bids[1] ? <Typography variant="subtitle2"><i>{"would extend bid"}</i></Typography> :
                    <Typography variant="subtitle2"><i>would <b>not</b> extend a bid</i></Typography>}
                    {pis.brotherReviews.present[0] ? <Typography variant="subtitle2"><i>Will be present at bid vote</i></Typography> :
                    <Typography variant="subtitle2"><i>Will <b>not</b> be present at bid vote</i></Typography>}
                    <div dangerouslySetInnerHTML={{__html: pis.brotherReviews.reviews[1]}}></div>
                </Card>
            </Grid> : null
            }
            
            { 
                pis.responses !== undefined ? 
            
            <Grid item xs={12} sm={8}>
            {(pis.responses.questions).map((question, index) => (
                <Card className={classes.question}>
                    <Typography variant="subtitle1"><b>Question {index+1}.</b> <i>{question}</i></Typography>
                    <div dangerouslySetInnerHTML={{__html: pis.responses.questionsResponse[index]}}></div>
                </Card>
            ))}
            </Grid>
            : null}

{ 
                pis.responses !== undefined ? 
            <Grid item xs={12} sm={8}>
            {(pis.responses.optionalQuestions).map((question, index) => (
                <Card className={classes.question}>
                    <Typography variant="subtitle1"><b>Optional Question {index+1}.</b> <i>{question}</i></Typography>
                    <div dangerouslySetInnerHTML={{__html: pis.responses.optionalQuestionsResponse[index]}}></div>
                </Card>
            ))}
            </Grid>
            : null}
            </Grid> 
        );
		}
	}


export default withStyles(pisDetailStyle)(PISDetail);
