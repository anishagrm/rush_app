import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import surveyDetailStyle from '../styles/surveyDetails';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import { CardContent } from '@material-ui/core';

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import firebaseAdmin from "../util/firebase"

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const nightOptions = [
    "O1",
    "O2",
    "C"
]

class SurveyDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            surveys: [],
            filters: ["O1", "O2", "C"],
            loading: true,
        };

    };


    componentDidMount = () => {
        if (this.props.constants.showAllSurveys || this.props.onBidcomm) {
            this.getRusheeSurveys();
        }
    };

    getRusheeSurveys = () => {

        authMiddleWare(this.props.history).then(() => {
            axios
                .get('/rusheeDetail', {
                    params: {
                        "rusheeGTID": this.props.rushee.gtid,
                    }
                })
                .then((response) => {
                    if (response.data) {
                        this.setState({
                            surveys: response.data.surveys,
                            loading: false
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    // TODO handle errors better
                    this.props.history.push('/login')
                });
        });
    }

    chooseFilter = (event, value) => {

        this.setState({
            filters: value
        })

    }

    render() {
        const { classes, } = this.props;

        return (
            <div>
                {this.state.loading ? <LinearProgress /> : <div />}
                {this.state.surveys.length === 0 ?
                    <Grid container justify='flex-end' spacing={1}>
                        <Grid item xs={12} sm={8}>
                            <Card className={classes.emptyCard}>
                                <Typography variant="h6"><i>Hiding surveys for now or none to show!</i></Typography>
                            </Card>
                        </Grid>
                    </Grid> :

                    <div>

                        <p></p>

                        <Autocomplete
                            multiple
                            id="checkboxes-tags-demo"
                            options={nightOptions}
                            value={this.state.filters}
                            disableCloseOnSelect
                            onChange={this.chooseFilter}
                            renderOption={(option, { selected }) => (
                                <React.Fragment>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </React.Fragment>
                            )}
                            style={{ width: 400 }}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" label="Filter by Nights" placeholder="Nights" />
                            )}
                        />

                    </div>
                }

                {this.state.filters.length === 0 ? <h1>No Nights chosen, select nights above to see surveys!</h1> : <div/>}

                {this.state.surveys.map((surveyInfo) => {
                    var professionalism = surveyInfo.survey.professionalism;
                    var leadership = surveyInfo.survey.leadership;
                    var brotherhood = surveyInfo.survey.brotherhood;
                    var growth = surveyInfo.survey.growth;
                    var brotherName = surveyInfo.survey.anonymous ? "Anonymous" : surveyInfo.brotherName;
                    var brotherID = surveyInfo.survey.anonymous ? -1 : surveyInfo.brotherID;

                    var night = surveyInfo.survey.night;
                    var brotherImage = `https://firebasestorage.googleapis.com/v0/b/rush-app-46833.appspot.com/o/${brotherID}.jpg?alt=media`;

                    if (!this.state.filters.includes(night)) {
                        return (
                            <div/>
                        )
                    }

                    return (
                        <Grid container spacing={4} className={classes.surveyInfo} justify="flex-end" key={surveyInfo.survey.brotherName}>
                            <Grid item xs={12} sm={4}>
                                {/* ------- Remove would extend bid front frontend ------- */}
                                {/* {surveyInfo.survey.extendBid ? 
                            <Typography variant="subtitle1" color="textSecondary">
                                {"Would Extend Bid"}
                            </Typography> : 
                            <div/>
                        }
                        <Divider/> */}
                                <Typography variant="subtitle1" color="textSecondary">
                                    {"Professionalism: " + professionalism}
                                </Typography>
                                <Divider />
                                <Typography variant="subtitle1" color="textSecondary">
                                    {"Why AKPsi: " + leadership}
                                </Typography>
                                <Divider />
                                <Typography variant="subtitle1" color="textSecondary">
                                    {"1:1 interactions: " + brotherhood}
                                </Typography>
                                <Divider />
                                <Typography variant="subtitle1" color="textSecondary">
                                    {"Group interactions: " + growth}
                                </Typography>


                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Card>
                                    <div className={classes.surveyHeader}>
                                        <Chip className={classes.chipHeader} size="" label={brotherName}
                                            avatar={<Avatar alt={brotherName} src={brotherImage} />}
                                        />
                                        <Chip className={classes.chipHeader} size=" " label={night}
                                        />
                                    </div>
                                    <CardContent className={classes.surveyContent}>
                                        <div dangerouslySetInnerHTML={{ __html: surveyInfo.survey.body }}></div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )
                })}

            </div>
        );
    }
}


export default withStyles(surveyDetailStyle)(SurveyDetail);
