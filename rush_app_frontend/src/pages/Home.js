import { Component } from "react";
import homeStyle from '../styles/home'
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { authMiddleWare } from '../util/auth';
import RusheeCard from '../components/RusheeCard';
import PIS from '../components/PIS';
import Box from '@material-ui/core/Box';
import ControlPanel from '../components/ControlPanel';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import logo from "../static/white-logo.png"
import darkModeLogo from "../static/dark-mode-logo.png"
import lightbulb from "../static/lightbulb-on-off.gif"
import Typography from '@material-ui/core/Typography';
import firebaseAdmin from "../util/firebase"
import { withRouter } from 'react-router-dom';
import { Button } from "@material-ui/core";

function filterSearch(arr, query) {
    return arr.filter(function(rushee) {
        return rushee.name.toLowerCase().indexOf(query.toLowerCase()) === 0
    })
  }

  function filterClouds(arr, clouds) {
    return arr.filter(function(rushee) {
        var cloud;
        for (cloud of clouds) {
            if(cloud === rushee.cloud) {
                return true;
            }
        }

        return false;
    })
  }

  function sort(arr, sortValue) {
    if(sortValue === 'firstName') {
        return arr.sort(function(a,b) {
            if(a.name < b.name) { return -1;}
            if(a.name > b.name) { return 1;}
            return 0;
        })
    }
    if(sortValue === 'totalYes') {
        return arr.sort(function(a,b) {
            return b.totalYes - a.totalYes;
        })
    }
    if(sortValue === 'totalSurveys') {
        return arr.sort(function(a,b) {
            return b.totalSurveys - a.totalSurveys;
        })
    }
    if (sortValue === 'registrationTime') {
        return arr.sort(function(a,b) {
            return (new Date(a.createdAt) - new Date(b.createdAt));
        })
    }

    if (sortValue === "rusheeNumber") {
        return arr.sort(function(a,b) {
            return a.number - b.number;
        })
    }
    return arr;
  }
class Home extends Component {

    constructor(props) {
        super(props);
		this.state = {
			rushees: [],
			errors: [],
			uiLoading: true,
            pis: false,
            searchText: '',
            clouds: ['pc','in','mid','out','n/a'],
            sortValue: 'firstName',
            secret: false,
            constants: {},
            onExec: false,
            onBidcomm: false
            
		};

    }
    
    componentDidMount = () => {
        firebaseAdmin.auth().onAuthStateChanged((user) => {
            if (user) {        
              this.getRushees();
              this.getConstants();
            } else {
                console.log('here');
                this.props.history.push('/login')
                return;
            }
        });
    };

    getConstants = () => {
        authMiddleWare(this.props.history).then(() => {
            axios
            .get("/constants")
            .then((response) => {
                    this.setState({
                        constants: response.data.constants
                    }, () => {
                        this.getBrotherStatus();
                    });
                })
            }).catch((err) => {
                console.log(err);
                // TODO handle errors better
                this.props.history.push('/login')
            });
    }

    getBrotherStatus = () => {
        let user = firebaseAdmin.auth().currentUser;
        authMiddleWare(this.props.history).then(() => {
            axios
            .get("/brothers/query", {
                params: {
                    uid: user.uid
                }})
            .then((response) => {
                if (!response.data) {
                    this.props.history.push('/login');
                    return;
                }
                    this.setState({
                        onExec: this.state.constants.exec.includes(response.data.name),
                        onBidcomm: this.state.constants.bidcomm.includes(response.data.name)
                    });
                })
            }).catch((err) => {
                console.log(err);
                // TODO handle errors better
                this.props.history.push('/login')
            });
    }
    
    viewCards = () => {
        this.getRushees();
        this.setState(
            {
                pis: false,
            }
        )
    }

    searchField = (event) => {
        var secret = false;
        if(event.target.value === "BUSIK") {
            secret = true
        }
        this.setState({
            searchText: event.target.value,
            secret: secret
        })
    };

    selectClouds = (event, value) => {
        this.setState({
            clouds: value,
        })
    };

    selectSort = (event) => {
        this.setState({
            sortValue: event.target.value,
        })
    };

    viewPIS = () => {
        this.getRushees();
        this.setState(
            {
                pis: true,
            }
        )
    }
    getRushees = () => {
		authMiddleWare(this.props.history).then(() => {
        axios
        .get("/updateAll")
        .then(axios.
            get('/rushees')
            .then((response) => {
                this.setState({
                    rushees: response.data,
                    uiLoading: false,
                });
            }))
        }).catch((err) => {
            console.log(err);
            // TODO handle errors better
            this.props.history.push('/login')
        });
    }
    
    switchMode = () => {
        this.setState({
            secret: false,
        })
        this.props.switchMode();
    }

    
    goToExec = () => {
        this.props.history.push({
            pathname: '/exec',
            state: {
                constants: this.state.constants
            }
        });
    }


    goToMiro = () => {
        window.open('https://miro.com/welcomeonboard/cTVMSk9NUk1ESUh1dm56d01PUWNYbGNnOWVSR2dhNnZoU1A0MEFMblc5MzBZZmY1M2JOSkVwa0RHS3kwd0JNUHwzNDU4NzY0NTYwNDg2MjM3NjE4fDI=?share_link_id=22104380460');
    }
    

    render () {
        const { classes } = this.props;
        if(this.state.uiLoading) {
            return(
                <Backdrop className={classes.backdrop} open={this.state.uiLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )
        }
        return (
            <div>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <img src={this.props.mode ? logo : darkModeLogo} alt="logo" className={classes.logo} />
                    <Typography variant="h4" className={classes.title} >
                        Rush Portal
                    </Typography>
                    <Box pl={2}>
                        <Button variant="outlined" disabled={!this.state.onExec} onClick={this.goToExec}>Exec Page</Button>
                    </Box>
                    <Box pl={2}>
                        <Button variant="outlined" onClick={this.goToMiro}>Miro Button</Button>
                    </Box>
                    
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="lg">
                <Grid container spacing={2}>
                    <Box clone order={{ xs: 2, sm: 1 }}>
                        <Grid item sm={9}  className={classes.section}>
                            {this.state.secret ? 
                                <div className={classes.center}>
                                    <img src={lightbulb}  alt="lightbulb" className={classes.secret}/>
                                    <Button onClick={this.switchMode}>Cool kids embody BUSIK and only cool kids can use dark mode</Button>
                                </div>
                            : <div/>}
                            {
                                this.state.pis ? <PIS history={this.props.history} close={this.viewCards} rushees={this.state.rushees} getUpdatedRushees={this.getRushees.bind(this)}/> : 
                                <div>
                                    {sort(filterSearch(filterClouds(this.state.rushees, this.state.clouds), this.state.searchText), this.state.sortValue).map((rushee) => (
                                        <RusheeCard history={this.props.history} constants={this.state.constants} rushee={rushee} key={rushee.gtid} getUpdatedRushees={this.getRushees.bind(this)} onBidcomm={this.state.onBidcomm}/>
                                    ))}
                                </div>
                            }
                        </Grid>
                    </Box>
                    <Box clone order={{ xs: 1, sm: 2 }}>
                        <Grid item sm={3}  className={classes.section}>
                            <ControlPanel selectSort={this.selectSort} sortValue={this.state.sortValue} clouds={this.state.clouds} selectClouds={this.selectClouds} search={this.searchField} history={this.props.history} pis={this.viewPIS} cards={this.viewCards}></ControlPanel>
                        </Grid>
                    </Box>

                </Grid>
            </Container>
            </div>
        )
    }
}

export default withRouter(withStyles(homeStyle)(Home));
    