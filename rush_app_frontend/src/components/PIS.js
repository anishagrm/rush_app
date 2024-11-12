import { Component } from "react";
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import Typography from '@material-ui/core/Typography';
import pisStyle from '../styles/pis'
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import ReactQuill from 'react-quill';
import Select from '@material-ui/core/Select';
import brotherList from '../static/brothers';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

class PIS extends Component {

    constructor(props) {
        super(props);
		this.state = {
            rusheeName: '',
            graduationSemester: 'Spring',
            graduationYear: '2021',
            requiredDates: [],
            requiredDatesResponse: [],
            questions: [],
            questionsResponse: [],
            optionalQuestionsOptions: [],
            optionalQuestionsChoices: ["","",""],
            optionalQuestionsResponse: [],
            brother: "",
            brotherReview: "",
            brotherBid: false,
            loading: true,
            nameMap: {},
            isScribe: false,
            canSubmit: false,
            brotherBidVote: false, // whether or not the brother will be at bid vote
		};

    }
    
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
    };
    
    handleBrotherInput = (event) => {
        this.setState({
            brotherBid: event.target.checked
        });
    }

    handleBrotherBidVoteInput = (event) => {
        this.setState({
            brotherBidVote: event.target.checked
        })
    }

    chooseBrother = (event) => {
        this.setState({
            brother: event.target.value
        });
    }

    handleDates = (event) => {
        let rDR = [...this.state.requiredDatesResponse];
        rDR[event.target.name] = event.target.checked;
        this.setState({
            requiredDatesResponse: rDR
        });
    }

    handleQuestionChange = (index, text) => {
        let qR = [...this.state.questionsResponse];
        qR[index] = text;
        this.setState({
            questionsResponse: qR
        });
    }

    handleBrotherText = (text) => {
        this.setState({
            brotherReview: text
        });
    }

    chooseOptionalQuestion = (index, event) => {
        let oQC = [...this.state.optionalQuestionsChoices];
        oQC[index] = event.target.value;
        this.setState({
            optionalQuestionsChoices: oQC
        });
    }


    handleOptionalQuestionResponse = (index, text) => {
        let oQR = [...this.state.optionalQuestionsResponse];
        oQR[index] = text;
        this.setState({
            optionalQuestionsResponse: oQR
        });
    }

    handleScribeChange = () => {
        this.setState({
            isScribe: !this.state.isScribe
        });
    }

    componentDidMount = () => {
        this.getPISOutline()
        var nameMap = {}
        var rushee
        for(rushee of this.props.rushees) {
            if (!("PIS" in rushee) || rushee.PIS.brothers[1] == "") {
                nameMap[rushee.name] = rushee.gtid
            }
        }
        this.setState(
            {
                nameMap : nameMap
            }
        );
    };
    
    getPISOutline= () => {
		authMiddleWare(this.props.history).then(() => {
		axios
			.get('/pisOutline', {
                params: {
                    "versionName": "final"
                }
              })
			.then((response) => {
				this.setState({
                    requiredDates: response.data.requiredDates,
                    requiredDatesResponse: new Array(response.data.requiredDates.length).fill(false),
                    questions: response.data.questions,
                    questionsResponse: new Array(response.data.questions.length).fill(""),
                    optionalQuestionsOptions: response.data.optionalQuestions,
                    optionalQuestionsResponse: new Array(2).fill(""),
                    loading: false
				});
			})
			.catch((err) => {
                console.log(err);
                // TODO handle errors better
                this.props.history.push('/login')
            });
        });
    }
    
	publishPIS = (event) => {
        event.preventDefault();        
        this.setState({ loading: true });

        const PISData = {
            rusheeGTID: this.state.nameMap[this.state.rusheeName],
            graduation: this.state.graduationSemester + " " + this.state.graduationYear,
            requiredDates: this.state.requiredDates,
            requiredDatesResponse: this.state.requiredDatesResponse,
            questions: this.state.questions,
            questionsResponse: this.state.questionsResponse,
            optionalQuestions: this.state.optionalQuestionsChoices,
            optionalQuestionsResponse: this.state.optionalQuestionsResponse,
            scribe: this.state.brother
        };

        const reviewData = {
            brother: this.state.brother,
            review: this.state.brotherReview,
            bid: this.state.brotherBid,
            bidVote: this.state.brotherBidVote,

            rusheeGTID: this.state.nameMap[this.state.rusheeName]
        };

        authMiddleWare(this.props.history).then(() => {
            if (this.state.isScribe) {
                axios
                .post('/pis', PISData)
                .then(() => {
                    axios.post('/pisReview', reviewData)
                }).then(() => {
                    this.props.getUpdatedRushees();
                })
                .then(() => {
                    this.setState({
                        loading: false,
                    });
                    this.props.close();
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        errors: error.response.data,
                        loading: false
                    });
                });
            } else {
                axios
                .post('/pisReview', reviewData)
                .then(() => {
                    this.props.getUpdatedRushees();
                })
                .then(() => {
                    this.setState({
                        loading: false,
                    });
                    this.props.close();
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        errors: error.response.data,
                        loading: false
                    });
                });
            }
        });

    };

    render () {
        const { classes } = this.props;
        if(this.state.loading) {
            return(
                <Backdrop className={classes.backdrop} open={this.state.loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )
        }
        return (

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">
                        <b>SUBMIT PIS</b>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    select
                    id="name"
                    label="Rushee Name"
                    name="rusheeName"
                    variant="outlined"
                    onChange={this.handleChange}
                >
                    {Object.keys(this.state.nameMap).map((rushee) => (
                        <MenuItem key={rushee} value={rushee}>
                            {rushee}
                        </MenuItem>
                    ))}
                </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        disabled
                        id="gtid"
                        name="gtid"
                        variant="outlined"
                        value={"GTID: " + (this.state.nameMap[this.state.rusheeName] ? this.state.nameMap[this.state.rusheeName] : "")}
                    />
                    <p>Please verify their GTID. Please report any mismatch to the software team and record answers on a separate document.</p>
                </Grid>

                <Grid container xs={12}>
                    <Grid item xs={10} sm={6}>
                        <Typography variant="h6">
                            Are you the scribe?
                        </Typography>
                    </Grid>
                    <Grid item xs={2} sm={6}>
                        <Switch
                            checked={this.state.isScribe}
                            onChange={this.handleScribeChange}
                        />
                    </Grid>
                </Grid>

                {this.state.isScribe ? (
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    select
                    id="graduationSemester"
                    label="Graduation Semester"
                    name="graduationSemester"
                    variant="outlined"
                    onChange={this.handleChange}
                >
                    <MenuItem key={"Fall"} value={"Fall"}> {"Fall"} </MenuItem>
                    <MenuItem key={"Spring"} value={"Spring"}> {"Spring"} </MenuItem>
                    <MenuItem key={"Summer"} value={"Summer"}> {"Summer"} </MenuItem>

                </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    select
                    id="graduationYear"
                    label="Graduation Year"
                    name="graduationYear"
                    variant="outlined"
                    onChange={this.handleChange}
                >
                    <MenuItem key={"2024"} value={"2024"}> {"2024"} </MenuItem>
                    <MenuItem key={"2025"} value={"2025"}> {"2025"} </MenuItem>
                    <MenuItem key={"2026"} value={"2026"}> {"2026"} </MenuItem>
                    <MenuItem key={"2027"} value={"2027"}> {"2027"} </MenuItem>
                    <MenuItem key={"2028"} value={"2028"}> {"2028"} </MenuItem>


                </TextField>
                </Grid>
                <Grid item xs={12}>
                    {this.state.requiredDates.map((date, index) => (
                        <Grid container key={date}>
                            <Grid item xs={10} sm={6}>
                                <Typography variant="h6">
                                    Are they available on {date}?
                                </Typography>
                            </Grid>
                            <Grid item xs={2} sm={6}>
                                <Switch
                                    checked={this.state.requiredDatesResponse[index]}
                                    onChange={this.handleDates}
                                    name={index}
                                />
                            </Grid>
                        </Grid>
                    ))}

                </Grid>
                <Grid item xs={12}>
                    {this.state.questions.map((question, index) => (
                        <div>
                            <Typography variant="h6">
                                {question}
                            </Typography>
                            <ReactQuill theme="snow" value={this.state.questionsResponse[index] || ''} onChange={(text) => this.handleQuestionChange(index, text)}/>
                        </div>
                    ))}
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                    <TextField label="Optional Question 1" value={this.state.optionalQuestionsChoices[0]}
                        onChange={(event) => this.chooseOptionalQuestion(0, event)}
                    >
                    </TextField>
                    </FormControl>
                    <ReactQuill theme="snow" value={this.state.optionalQuestionsResponse[0] || ''} onChange={(text) => this.handleOptionalQuestionResponse(0, text)}/>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                    <TextField label="Optional Question 2" value={this.state.optionalQuestionsChoices[1]}
                        onChange={(event) => this.chooseOptionalQuestion(1, event)}
                    >
                    </TextField>
                    </FormControl>
                    <ReactQuill theme="snow" value={this.state.optionalQuestionsResponse[1] || ''} onChange={(text) => this.handleOptionalQuestionResponse(1, text)}/>

                    </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                    <TextField label="Optional Question 3" value={this.state.optionalQuestionsChoices[2]}
                        onChange={(event) => this.chooseOptionalQuestion(2, event)}
                    >
                    </TextField>
                    </FormControl>
                    <ReactQuill theme="snow" value={this.state.optionalQuestionsResponse[2] || ''} onChange={(text) => this.handleOptionalQuestionResponse(2, text)}/>

                
                </Grid>
                </Grid>) : null }
                <Grid item xs={6}>

                    <h2>Brother: {JSON.parse(localStorage.getItem("user")).firstname} {JSON.parse(localStorage.getItem("user")).lastname}</h2>

                    <FormControl fullWidth>
                    </FormControl>
                    <ReactQuill theme="snow" value={this.state.optionalQuestionsResponse[2] || ''} onChange={(text) => this.handleOptionalQuestionResponse(2, text)}/>

                
                </Grid>

                <Grid item xs={2}>
                    <FormControlLabel
                        control={
                        <Checkbox
                        checked={this.state.brotherBid}
                        onChange={(event) => this.handleBrotherInput(event)}
                        name="Brother Yes or No"
                        color="primary"
                        />
                        }
                        label="Extend Bid?"
                        labelPlacement="start"
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControlLabel
                        control={
                        <Checkbox
                        checked={this.state.brotherBidVote}
                        onChange={(event) => this.handleBrotherBidVoteInput(event)}
                        name="Brother Bid Vote"
                        color="primary"
                        />
                        }
                        label="Will you be at Bid Vote?"
                        labelPlacement="start"
                    />
                </Grid>
                <Grid item xs={12}>
                    <ReactQuill theme="snow" value={this.state.brotherReview || ''} onChange={(text) => this.handleBrotherText(text)}/>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" fullWidth
                        disabled={((!this.state.brother || !this.state.brotherReview || !this.state.rusheeName) || 
                            (this.state.isScribe && 
                                (!this.state.graduationSemester || !this.state.graduationYear || this.state.questionsResponse.indexOf("") !== -1)))}
                        onClick={this.publishPIS}
                    >Submit PIS</Button>
                </Grid>
            </Grid>

        )
    }
}

export default withStyles(pisStyle)(PIS);
    