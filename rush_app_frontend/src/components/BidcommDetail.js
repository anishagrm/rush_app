import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import bidcommDetailStyle from '../styles/bidcommDetails';
import Grid from '@material-ui/core/Grid';
import ReactQuill from 'react-quill';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class BidcommDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
            text: '',
            auth: false,
            loading: true
        };
        this.handleTextChange = this.handleTextChange.bind(this);

    };

    componentDidMount = () => {
		this.getBidcommDetail()
    };
    
    handleTextChange (text) {
        this.setState({ text: text });
    };

    getBidcommDetail = () => {

		authMiddleWare(this.props.history).then(() => {
		axios
			.get('/bidcomm', {
                params: {
                    "rusheeGTID": this.props.rushee.gtid,
                }
              })
			.then((response) => {
                if(response.data) {
                    var text = '';
                    if(response.data.bidcomm) {
                        text = response.data.bidcomm.text;
                    }
                    this.setState({
                        text: text,
                        auth: response.data.auth,
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

    publishBidcommNotes = (event) => {
        event.preventDefault();        
        this.setState({ loading: true });

		const bidcommNotes = {
			rusheeGTID: this.props.rushee.gtid,
			text: this.state.text,
        };
        
		authMiddleWare(this.props.history).then(() => {
		axios
			.post('/bidcomm', bidcommNotes)
			.then(() => {
				this.setState({
                    loading: false,
                });
                this.props.close();
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					loading: false
				});
            });
        });
    };

	render() {
        const { classes,  } = this.props;

        if(this.state.loading) {
            return(<LinearProgress />);
        }
        if((!this.state.auth && (!this.state.text || this.state.text === ''))) {
            return(
                <Grid container justify='flex-end' spacing={1}>
                    <Grid item xs={8}>
                        <Card className={classes.emptyCard}>
                            <Typography variant="h6"><i>No Bidcomm Notes Yet</i></Typography>
                        </Card>
                    </Grid>
                </Grid>
            );
        }

        if(this.state.auth) {
            return(
                <Grid container justify='flex-end' >
                    <Grid item xs={12} sm={8} className={classes.bidcommNotes}>
                        <ReactQuill onChange={this.handleTextChange} value={this.state.text || ''} readOnly={false} theme={"snow"}/>
                        <Button
                            color="primary"
                            className={classes.publishButton}
                            onClick={this.publishBidcommNotes}
                        >
                            Publish Bidcomm Notes
                        </Button>
                    </Grid>
                </Grid>
            )
        }
        return (
            <Grid container justify='flex-end' >
            <Grid item xs={12} sm={8} className={classes.bidcommNotes}>
                <Card>
                <ReactQuill value={this.state.text || ''} readOnly={true} theme={"bubble"}/>
                </Card>
            </Grid>
        </Grid>
        )
	}
}

export default withStyles(bidcommDetailStyle)(BidcommDetail);
