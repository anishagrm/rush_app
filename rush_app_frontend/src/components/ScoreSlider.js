import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import addSurveyStyle from '../styles/addSurveyStyle';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';


import 'react-quill/dist/quill.snow.css';

const marks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 2,
      label: '2',
    },
    {
      value: 3,
      label: '3',
    },
    {
      value: 4,
      label: '4',
    },
    {
      value: 5,
      label: '5',
    },
  ];

class ScoreSlider extends Component {

	render() {
		const { classes,  } = this.props;

    return (
        <Grid container alignItems="center" className={classes.sliders}>
            <Grid container justify="flex-start" alignItems="center" item xs={6}>
                <Checkbox
                        checked={this.props.defaultChecked}
                        color="primary"
                        className={classes.checkbox}
                        onChange={this.props.handleScoreCheck}
                        name = {this.props.scoreProperty+'Input'}
                    />
                <Typography className={classes.sliderLabel}>{this.props.score}</Typography>
            </Grid>
            <Grid container item xs={6} justify="flex-end">
                <Slider disabled={!this.props.defaultChecked} value={this.props.default} step={1} marks={marks} min={1} max={5} onChange={this.props.sliderHandler}/>
            </Grid>
        </Grid>
    );
		}
	}


export default withStyles(addSurveyStyle)(ScoreSlider);
