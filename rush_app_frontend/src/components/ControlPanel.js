import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import controlPanelStyle from '../styles/controlPanel.js';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import firebaseAdmin from "../util/firebase";
import Select from '@material-ui/core/Select';
import { FormControl } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';

class ControlPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {
            anchorEl: null,
            loading: false,
            brotherImage: '',
        };

	};

    componentDidMount = () => {
        this.getBrother();
        
    };

    getBrother = () => {
		authMiddleWare(this.props.history).then(() => {
		axios
			.get('/brothers/')
			.then((response) => {
                if(response.data) {
                    this.setState({
                        brotherImage: response.data.imageUrl,
                        loading: false
                    });
                } else {
                    this.setState({
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
	logoutHandler = () => {
        firebaseAdmin.auth().signOut();
		this.props.history.push('/login');
    };
    
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    
    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleImageChange = (event) => {
        console.log('here1');

        let form_data = new FormData();
        form_data.append('image', event.target.files[0]);
        this.setState({ loading : true});
		authMiddleWare(this.props.history).then(() => {
            axios
                .post('/brothers/image', form_data, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                })
                .then(() => {
                    this.setState({
                        loading: false,
                        imageError: ''
                    });
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        this.props.history.push('/login');
                    }
                    console.log(error);
                    this.setState({
                        loading: false,
                        imageError: 'Error in posting the data'
                    });
                });
        });
        this.handleClose();
    };
    
	render() {
        const { classes,  } = this.props;
        console.log(this.props.switchMode);
        return (
        <div>
          <Card >
            <div className={classes.top}>
                <div className={classes.settingContainer}>
                    <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={this.handleClick}
                        >
                            <MoreVertIcon className={classes.settings}/>
                    </IconButton>

                    <Menu
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}>
                        <MenuItem>
                            <Button component="label" size="small" color="primary">
                                Upload Image
                                <input type="file" onChange={this.handleImageChange} style={{display : "none"}} />
                            </Button>
                        </MenuItem>
                        <MenuItem >
                            <Button onClick={this.logoutHandler} component="label" size="small" color="primary">
                                Logout
                            </Button>
                        </MenuItem>
                    </Menu>
                </div>
                <div className={classes.profile}>
                    <Avatar src={this.state.brotherImage} className={classes.propic}></Avatar>
                </div>
            </div>
            <CardContent className={classes.panel}>

                <Paper className={classes.search}>
                    <InputBase
                        className={classes.input}
                        placeholder="Search Rushees"
                        onChange={this.props.search}
                    />
                    <IconButton className={classes.iconButton} aria-label="search">
                        <SearchIcon className={classes.icon} />
                    </IconButton>
                </Paper>

                <div className={classes.clouds}>
                    <ToggleButtonGroup
                        value={this.props.clouds}
                        onChange={this.props.selectClouds}
                        name="cloud" 
                        id="date-select"
                        className={classes.tbutton}
                        color="secondary"
                    >
                        <ToggleButton color="secondary" size='small' className={classes.tbutton} value="pc">PC</ToggleButton>
                        <ToggleButton color="secondary" size='small' className={classes.tbutton} value="in">IN</ToggleButton>
                        <ToggleButton color="secondary" size='small' className={classes.tbutton} value="mid">MID</ToggleButton>
                        <ToggleButton color="secondary" size='small' className={classes.tbutton} value="out">OUT</ToggleButton>
                        <ToggleButton color="secondary" size='small' className={classes.tbutton} value="n/a">N/A</ToggleButton>

                    </ToggleButtonGroup>
                </div>
                <FormControl fullWidth className={classes.sort} >
                    <InputLabel color="secondary">Sort By:</InputLabel>
                    <Select  value={this.props.sortValue} onChange={this.props.selectSort}>
                        <MenuItem value={'firstName'}>First Name</MenuItem>
                        <MenuItem value={'rusheeNumber'}>Rushee Number</MenuItem>
                        <MenuItem value={'registrationTime'}>Registration Time</MenuItem>
                        <MenuItem value={'totalYes'}>Number of Yes</MenuItem>
                        <MenuItem value={'totalSurveys'}>Total Surveys</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={this.props.cards} variant="outlined" color="secondary" className={classes.buttons} fullWidth>
                    View Rushees
                </Button>
                <Button onClick={this.props.pis} variant="outlined" color="secondary" className={classes.buttons} fullWidth>
                    Submit PIS
                </Button>

            </CardContent>

          </Card>
        </div>
        );
		}
	}


export default withStyles(controlPanelStyle)(ControlPanel);
