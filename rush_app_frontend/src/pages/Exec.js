import { Button, Toolbar, Typography, AppBar, Box, Container, FormGroup, Select } from '@material-ui/core';
import React, { Component, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import logo from "../static/white-logo.png"
import { authMiddleWare } from '../util/auth';
import axios from 'axios';
import * as XLSX from 'xlsx';



class Exec extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rushees: [],
            PISVisible: props.location.state.constants.showAllPIS,
            surveyVisible: props.location.state.constants.showAllSurveys,
            hideSaveVisibilityButton: true,
            selectedRusheeGTID: "",
            selectedCloud: "",
        };
    }

    componentDidMount() {
        authMiddleWare(this.props.history).then(() => {
            axios
            .get('/rushees')
            .then((response) => {
                this.setState({
                    rushees: response.data.sort((a, b) => {return a.name.localeCompare(b.name)}),
                });
            })
            .catch((err) => {
                console.log(err);
            });
        });
    }

    
    downloadCSV = () => {
        authMiddleWare(this.props.history).then(() => {
            axios
            .get('/export')
            .then((response) => {
                let rushees = response.data.rushees;
                let surveys = response.data.surveys;
                let pises = response.data.pises;
                let attendance = response.data.attendance;

                
                const workbook = XLSX.utils.book_new();
                const PISSheet = XLSX.utils.json_to_sheet(pises);
                const surveySheet = XLSX.utils.json_to_sheet(surveys);
                const rusheeSheet = XLSX.utils.json_to_sheet(rushees);
                const attendanceSheet = XLSX.utils.json_to_sheet(attendance);
                XLSX.utils.book_append_sheet(workbook, PISSheet, "PISes");
                XLSX.utils.book_append_sheet(workbook, surveySheet, "Surveys");
                XLSX.utils.book_append_sheet(workbook, rusheeSheet, "Rushees");
                XLSX.utils.book_append_sheet(workbook, attendanceSheet, "Attendance");
                XLSX.writeFile(workbook, "RushAppDatabase.xlsx");


            })
            .catch((err) => {
                console.log(err);
            });
        });
    }

    

    backHome = () => {
        this.props.history.push('/');
    }

	handlePISToggle = (event) => {
        this.setState({
            PISVisible: event.target.checked,
            hideSaveVisibilityButton: false
        });
    }

    handleSurveyToggle = (event) => {
        this.setState({
            surveyVisible: event.target.checked,
            hideSaveVisibilityButton: false
        });
    }

    handleVisibilitySave = () => {
        let constants = {
            showAllPIS: this.state.PISVisible,
            showAllSurveys: this.state.surveyVisible,
            bidcomm: this.props.location.state.constants.bidcomm,
            exec: this.props.location.state.constants.exec
        }
        authMiddleWare(this.props.history).then(() => {
            axios
            .post('/constants', {
                constants: constants
            })
            .then(() => {
                this.props.history.push('/');
            })
            .catch((err) => {
                console.log(err);
            })
        });    
    }

    handleUpdateCloud = () => {
        let cloudData = {
            cloud: this.state.selectedCloud,
            gtid: this.state.selectedRusheeGTID
        }
        authMiddleWare(this.props.history).then(() => {
            axios
            .post('/cloud', cloudData)
            .then(() => {
                this.setState({
                    selectedRusheeGTID: null,
                    selectedCloud: ""
                });
                alert("Cloud updated!");
            })
            .catch((err) => {
                console.log(err);
            })
        });
    }

    render() {
        const { classes } = this.props;
        const clouds = ["in", "mid", "out", "pc", "n/a"];
        return (
            <Grid container direction="column" alignItems="center" justify='center'>
                <AppBar position="static" >
                <Toolbar>
                <img src={logo} alt="logo" style={{height: 40, paddingRight: 10}} />
                        <Typography variant="h4"  >
                        Exec Page
                        </Typography>
                        <Box pl={2}>
                            <Button variant="outlined" onClick={this.backHome}>Back Home</Button>
                        </Box>
                        
                </Toolbar>
                </AppBar>
                <Box mt={8}>
                    <Typography variant='h4'>
                        Actions
                    </Typography>
                </Box>

                <Box pt={4}>
                        <Button variant="outlined" onClick={this.downloadCSV}>Download Rushee Info</Button>
                </Box>    
                    
                <Box pt={4} >
                        <FormGroup>
                            <FormControlLabel control={<Switch checked={this.state.surveyVisible} />} onChange={this.handleSurveyToggle} label={this.state.surveyVisible ? "All surveys are currently visible" : "All surveys are currently hidden"} />
                            <FormControlLabel control={<Switch checked={this.state.PISVisible} />} onChange={this.handlePISToggle} label={this.state.PISVisible ? "All PIS reviews are currently visible" : "All PIS reviews are currently hidden"} />
                            
                        </FormGroup>

                        <Box pl={10} pt={2}>
                                <Button variant='outlined' onClick={this.handleVisibilitySave} disabled={this.state.hideSaveVisibilityButton}>Save and Return</Button>
                            </Box>
                        
                </Box> 

                    <Box pt={6}>
                        <FormGroup row={true}>

                        
                            <FormControlLabel label="Move rushee " labelPlacement='start' control={
                                <Select value={this.state.selectedRusheeGTID} style={{paddingLeft:10}} onChange={(event) => {this.setState({selectedRusheeGTID: event.target.value})}}>
                                    {this.state.rushees.map((rushee) => (
                                        <MenuItem key={rushee.gtid} value={rushee.gtid}>{rushee.name}</MenuItem>
                                    ))}
                                </Select>
                            }
                            
                            />

                            <FormControlLabel label="to cloud " labelPlacement='start' style={{paddingRight:10}} control={
                                <Select value={this.state.selectedCloud} style={{paddingLeft:10, paddingRight:10}} onChange={(event) => {this.setState({selectedCloud: event.target.value})}}>
                                    {clouds.map((cloud) => (
                                        <MenuItem key={cloud} value={cloud}>{cloud}</MenuItem>
                                    ))}
                                </Select>
                            }

                            />
                            <Box pl={2}>
                                <Button variant='outlined' onClick={this.handleUpdateCloud} disabled={this.state.selectedRusheeGTID == null || this.state.selectedCloud == ""}>Update Rushee Cloud</Button>
                            </Box>
                            
                        </FormGroup>

                        
                        
                        
                    </Box>
            
            </Grid>
        );
    }
}

export default Exec;