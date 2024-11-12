import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Login from './pages/Login';
import Exec from './pages/Exec';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Registration from './pages/Registration';
import CssBaseline from "@material-ui/core/CssBaseline";
import PasswordReset from './pages/PasswordReset';
import Attendance from './pages/Attendance';

// allows to change global theme easily
const theme = createMuiTheme({
	typography: {
		fontFamily: [
		'Raleway',
		'Arial',
		].join(','),
	},
	palette: {
		primary: {
			main: '#3A5382',
			dark: '#545454',
			contrastText: '#F9F6E5',
			settings: '#FFFFFF'
		},
		secondary: {
			main: '#3A5382'
		},
		background: {

			default: "#F1F2EB"
		  }
  }
});


const darkModeTheme = createMuiTheme({
	typography: {
		fontFamily: [
		  'Raleway',
		  'Arial',
		].join(','),

	},
	palette: {
		type: "dark",
		primary: {
			main: '#181818', // 22303C
			dark: '#282828',
			contrastText: '#5DACD9',
			settings: '#5DACD9'
		},
		secondary: {
			main: '#5DACD9'
		},
		background: {
			default: "#121212"
		  },
		text: {
			primary: "#ffffff",
			secondary: "#AAAAAA"
	  }
  }
});

function App() {

	const [darkMode, switchDarkMode] = useState(false);

	function switchMode() {
		switchDarkMode(!darkMode);
	}
	return (
		<MuiThemeProvider theme={darkMode ? darkModeTheme : theme}>
			<CssBaseline />

			<Router>
				<div>
					<Switch>
						<Route exact path="/" render={(props) => <Home {...props} mode={!darkMode} switchMode={switchMode}/>} />
						<Route exact path="/exec" component={withRouter(Exec)} />
						<Route exact path="/login" component={withRouter(Login)} />
						<Route exact path="/signup" component={withRouter(Signup)} />
						<Route exact path="/registration" component={withRouter(Registration)} />
						<Route exact path="/passwordReset" component={withRouter(PasswordReset)} />
						<Route exact path="/attendance" component={withRouter(Attendance)} />
					</Switch>
				</div>
			</Router>
		</MuiThemeProvider>
	);
}

export default App;
