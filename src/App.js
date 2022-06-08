import './App.css';

import {
	Switch,
	Route,
	Redirect,
	HashRouter
} from "react-router-dom";
import { createHashHistory } from 'history'
import Login from './layout/login'
import Main from './layout/main'
import Signup from './layout/signup'

import initListen from './utils/WebIMListen'
import Loading from './components/common/loading'
import { useSelector } from 'react-redux'

const history = createHashHistory()
initListen()

const AuthorizedComponent = (props) => {
	const Component = props.component;
	const webimAuth = sessionStorage.getItem('webim_auth')

	return webimAuth ? (
		<Switch>
			<Redirect to="/main" render={props => <Component {...props} />} />
		</Switch>
	) : <Redirect to="/login" />
}

function App() {
	const isFetching = useSelector(state => state?.isFetching) || false
	return (
		<div className="App">
			<Loading show={isFetching} />
			<HashRouter basename='/' history={history}>
				<Switch>
					<Route exact path="/login" component={Login} />
					<Route exact path="/main" component={Main} />
					<Route exact path="/signup" component={Signup} />
					<Route path="/" render={() => <AuthorizedComponent token={'11'} component={Main} />} />
				</Switch>
			</HashRouter>
		</div>
	);
}

export default App;

