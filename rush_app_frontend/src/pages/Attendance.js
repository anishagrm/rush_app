//shradha was here
import { Button, Toolbar, Typography, AppBar, Box, Container } from '@material-ui/core';
import React, { Component, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import logo from "../static/white-logo.png"
import { authMiddleWare } from '../util/auth';
import axios from 'axios';

const nights = ["O1", "O2", "C"];

class Attendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            night: "",
            attendanceList: [],
            GTIDText: "",
            rusheeDict: {}
        };
    }

    handleNight = (event) => {
        this.setState({
            night: event.target.value
        }, this.updateState);
        
    }

    updateState = () => {
        this.getRushees();
        this.getAttendance();
    }

    handleText = (event) => {
        this.setState({
            GTIDText: parseInt(event.target.value)
        });
    }

    showHome = () => {
            axios
            .get("/updateAll")
            .then(this.props.history.push('/registration'))
            .catch((err) => {
                console.log(err);
                // TODO handle errors better
                this.props.history.push('/login')
            })    
        }

    getAttendance = () => {
        
            axios.get('/attendance', {
                params: {
                    "night": this.state.night
                }
            })
                  .then((response) => {
                    if(response.data) {
                        this.setState({
                            attendanceList: response.data.attendance,
                        });
                        
                    }
                })
                  .catch((err) => {
                    console.log(err);
                    // TODO handle errors better
                    this.props.history.push('/login')
                });
    }

    handleSubmit = (event) => {
        const attendanceData = {
            night: this.state.night,
            GTID: this.state.GTIDText,
            add: true,
            timeAdded: new Date().toLocaleString()
        };
        this.updateAttendance(attendanceData);
        this.state.GTIDText = "";
    }

    getRushees = () => {
            axios
                .get('/rushees')
                .then((response) => {
                    var rushees = response.data;
                    var dict = {}
                    for (var rushee of rushees) {
                        dict[rushee.gtid] = rushee.name
                    }
                    this.setState({
                        rusheeDict: dict
                    });

                })
                .catch((err) => {
                    console.log(err);
                    // TODO handle errors better
                    this.props.history.push('/login')
                });
    }

    updateAttendance = (attendanceData) => {
        axios
        .get('/rushees')
        .then((response) => {
            var rushees = response.data;
            var dict = {}
            for (var rushee of rushees) {
                dict[rushee.gtid] = rushee.name
            }
            this.setState({
                rusheeDict: dict
            });

        }).then( () => {
            axios
                .put('/attendance', attendanceData)
                .then((response) => {
                    if (response.data) {
                        this.setState({attendanceList: response.data.attendance});
                    }
                })
                .catch((err) => {
                    console.log(attendanceData);
                    console.log(err);
                    // TODO handle errors better
                    this.props.history.push('/login')
                });
        });
            

    }

    

    render() {
        return (
            <div>
            <Grid container rowSpacing={10} direction='column' alignItems="center" justifyContent="center">
                <AppBar position="static">
                    <Toolbar>
                        <img src={logo} alt="logo" style={{height: 40, paddingRight: 10}} />
                        <Typography variant="h4"  >
                        Rush Portal
                        </Typography>
                        <Box pl={2}>
                            <Button variant="outlined" onClick={this.showHome}>Back to Home</Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box mt={15}>
                    <Grid container spacing={10} alignItems="center" justifyContent="center">
                        <FormControlLabel labelPlacement="start"
                            control={
                            <Select
                                value={this.state.night}
                                onChange={this.handleNight}
                            >
                                {nights.map((name) => (
                                    <MenuItem key={name} value={name}>
                                    {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        }label="Night:  "/>
                    
                        <Box pl={4}>
                            <TextField label="GTID#" variant="standard" value={this.state.GTIDText} onChange={this.handleText}/>
                        </Box>
                        <Box pl={4}>
                            <Button variant='outlined' onClick={this.handleSubmit}>Submit</Button>
                        </Box>
                    </Grid>
                </Box>
                 {/* <Box pt={6}>
                    {this.state.attendanceList.map((rushee) => (
                        <Grid pb={4} columns={5}>
                            <Button variant='outlined' key={rushee.GTID} value={rushee.GTID} >{rushee.GTID + " - " + this.state.rusheeDict[rushee.GTID]}</Button>
                        </Grid>
                    ))}
                </Box> */}
                <Box pt={6}> </Box>
                <Grid container spacing={{ xs: 2, md: 7}} columns={{ xs: 4, sm: 8, md: 6 }} align="center" justify="center" paddingTop="500px">
                    {this.state.attendanceList.map((rushee) => (
                        <Grid item xs={2} sm={4} md={3} key={rushee} paddingTop="100px">
                            <Button pb={1} variant='outlined' key={rushee.GTID} value={rushee.GTID} >{rushee.GTID + " - " + this.state.rusheeDict[rushee.GTID]}</Button>
                            <Box pt={2}> </Box>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            </div>
        );
    }
}

export default Attendance;