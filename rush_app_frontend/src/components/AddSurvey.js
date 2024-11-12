import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import addSurveyStyle from '../styles/addSurveyStyle';
import Grid from '@material-ui/core/Grid';
import ReactQuill from 'react-quill';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import { authMiddleWare } from '../util/auth';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FormHelperText} from '@material-ui/core';

const nights = [
    'O1', 'O2', 'C'
  ];

const ratings = [
    "Satisfactory", "Unsatisfactory", "Not Seen"
];

const placeholder = `Think about whether this rushee would be a strong/involved brother in the fraternity.\n\nThink about whether this rushee is truly passionate about their interests and ambitions.\n\nThink about this rushee's willingess to grow and adapt to a rigorous pledging process\n\nIf you saw any red flags during rush, include why that might impact the fraternity negatively`

class AddSurvey extends Component {
	constructor(props) {
		super(props);
		this.state = {
            professionalism: "",
            leadership: "",
            brotherhood: "",
            growth: "",
            dropdownErrors: [false, false, false, false],
            anonymous: false,
            extendBid: false, // default value is false from now on [Aug 2024]
            night: '',
            nightErrors: false,
            emptySurveyError: false, 
            text: '',
            loading: true
        };
        this.handleChange = this.handleChange.bind(this);

    };
    handleChange (text) {
        this.setState({ text: text });
    };

    handleScoreCheck = (event) => {
		this.setState({
			[event.target.name]: event.target.checked
		});
    };

    handleProfessionalism = (event) => this.setState({ professionalism : event.target.value});
    handleLeadership = (event) => this.setState({ leadership : event.target.value});
    handleBrotherhood = (event) => this.setState({ brotherhood : event.target.value});
    handleGrowth = (event) => this.setState({ growth : event.target.value});

    
    handleAnonymous = (event) => {
        this.setState({
            anonymous: event.target.checked,
        })
    };


    /**
     * DEPRACTED - part of remove extend bid checkbox
     * @param {*} event 
     */
    // handleExtendBid = (event) => {
    //     this.setState({
    //         extendBid: event.target.checked,
    //     })
    // };

    handleNight = (event) => {
        this.setState({
            night: event.target.value
        })
        this.getSurvey();
    };

    componentDidMount = () => {
		this.getSurvey()
    };
    
    getSurvey = () => {

		authMiddleWare(this.props.history).then(() => {
		axios
			.get('/survey', {
                params: {
                    "rusheeGTID": this.props.rushee.gtid,
                    "night": this.state.night,
                }
              })
			.then((response) => {
                if(response.data) {
                    console.log(response.data.survey);
                    this.setState({
                            loading: false,
                            professionalism: response.data.survey.professionalism,
                            leadership: response.data.survey.leadership,
                            brotherhood: response.data.survey.brotherhood,
                            growth: response.data.survey.growth,
                            anonymous: response.data.survey.anonymous,
                            extendBid: response.data.survey.extendBid,
                            text: response.data.survey.body,
                    });
                    
                } else {
                    this.setState({
                        loading: false,
                        professionalism: "",
                        leadership: "",
                        brotherhood: "",
                        growth: "",
                        anonymous: false,
                        extendBid: false,
                        text: '',
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

	publishSurvey = (event) => {
        event.preventDefault();
        if (this.state.night === '' ) {
            this.setState({nightErrors: true});
            return;
        } else if (this.state.professionalism === '' || this.state.leadership === '' || this.state.brotherhood === '' || this.state.growth === '') {
            this.setState({dropdownErrors: [this.state.professionalism === '', this.state.leadership === '', this.state.brotherhood === '', this.state.growth === '']});
            return;
        } else if (this.state.text.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
            this.setState({emptySurveyError: true});
            return;
        }


        this.setState({ loading: true });

		const surveyData = {
			rusheeGTID: this.props.rushee.gtid,
			survey: {
                professionalism: this.state.professionalism,
                leadership: this.state.leadership,
                brotherhood: this.state.brotherhood,
                growth: this.state.growth,
                body: this.state.text,
                anonymous: this.state.anonymous,
                extendBid: this.state.extendBid,
                night: this.state.night
            }
        };
        
		authMiddleWare(this.props.history).then(() => {
		axios
			.post('/survey', surveyData)
			.then(() => {
				this.setState({
                    loading: false,
                });
                this.props.close();
			}).then(() => {
                axios.get('/updateAll');
            }).then(() => {
                this.props.getUpdatedRushees();
            })
			.catch((error) => {
				console.log(error);
				this.setState({
					errors: error.response.data,
					loading: false
				});
            });
        });
    };
    
	render() {
		const { classes,  } = this.props;

        return (
            <div>
            {this.state.loading ? <LinearProgress /> : <div/>}
            <Grid container spacing={4}>
                <Grid item xs={12 } sm={4}>
                    <FormGroup>
                        <FormControlLabel disabled={this.state.night === ""} label="Professionalism:" labelPlacement="start" style={{marginTop: 30}}  control={
                            <Select value={this.state.professionalism} onChange={this.handleProfessionalism} style={{paddingLeft:10}} error={this.state.dropdownErrors[0]}> 
                                {ratings.map((rating) => (
                                    <MenuItem key={rating} value={rating}>
                                    {rating}
                                    </MenuItem>
                                ))}
                            </Select>
                        }>
                        </FormControlLabel>

                        <FormControlLabel disabled={this.state.night === ""} label="Why AKPsi:" labelPlacement="start" style={{marginTop: 25}}  control={
                            <Select value={this.state.leadership} onChange={this.handleLeadership} style={{paddingLeft:10}} error={this.state.dropdownErrors[1]}> 
                                {ratings.map((rating) => (
                                    <MenuItem key={rating} value={rating}>
                                    {rating}
                                    </MenuItem>
                                ))}
                            </Select>
                        }>
                        </FormControlLabel>

                        <FormControlLabel disabled={this.state.night === ""} label="1:1 interactions:" labelPlacement="start" style={{marginTop: 25}}   control={
                            <Select value={this.state.brotherhood} onChange={this.handleBrotherhood} style={{paddingLeft:10}} error={this.state.dropdownErrors[2]}> 
                                {ratings.map((rating) => (
                                    <MenuItem key={rating} value={rating}>
                                    {rating}
                                    </MenuItem>
                                ))}
                            </Select>
                        }>
                        </FormControlLabel>

                        <FormControlLabel disabled={this.state.night === ""} label="Group Interactions:" labelPlacement="start" style={{marginTop: 25}}  control={
                            <Select value={this.state.growth} onChange={this.handleGrowth} style={{paddingLeft:10}} error={this.state.dropdownErrors[3]}> 
                                {ratings.map((rating) => (
                                    <MenuItem key={rating} value={rating}>
                                    {rating}
                                    </MenuItem>
                                ))}
                            </Select>
                        }>
                        </FormControlLabel>
                    </FormGroup>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <FormGroup row>
                        <FormControlLabel labelPlacement="start"
                            control={
                            <Select
                                value={this.state.night}
                                onChange={this.handleNight}
                                error={this.state.nightErrors}
                            >
                                {nights.map((name) => (
                                    <MenuItem key={name} value={name}>
                                    {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        }label="Night:  "/>


                    </FormGroup>


                    <ReactQuill theme="snow" value={this.state.night === "" ? "" : this.state.text} placeholder={placeholder} onChange={this.handleChange} error = {this.state.emptySurveyError}/>
                    <Button
                            color="primary"
                            className={classes.publishButton}
                            onClick={this.publishSurvey}
                        >
                            Publish Survey
                        </Button>
                        { this.state.nightErrors && <FormHelperText  error={true} >Night Required</FormHelperText>}
                        { this.state.dropdownErrors.includes(true) && <FormHelperText  error={true} >One or more ratings missing</FormHelperText>}
                        { this.state.emptySurveyError && <FormHelperText  error={true} > Cannot publish empty survey</FormHelperText>}
                </Grid>
            </Grid>
            </div>
        );
		}
	}


export default withStyles(addSurveyStyle)(AddSurvey);
