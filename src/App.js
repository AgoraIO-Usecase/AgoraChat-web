import "./App.css";

import { Switch, Route, Redirect, HashRouter } from "react-router-dom";
import { createHashHistory } from "history";
import Login from "./layout/login";
import Main from "./layout/main";
import Signup from "./layout/signup";

import initListen from "./utils/WebIMListen";
import Loading from "./components/common/loading";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Provider, UIKitProvider, eventHandler } from "agora-chat-uikit";
import { handleError } from "./handleError";
import customIcon from "./assets/custom.png";
const history = createHashHistory();

const AuthorizedComponent = (props) => {
	const Component = props.component;
	const webimAuth = sessionStorage.getItem("webim_auth");

	return webimAuth ? (
		<Switch>
			<Redirect to="/main" render={(props) => <Component {...props} />} />
		</Switch>
	) : (
		<Redirect to="/login" />
	);
};

function App() {
	const isFetching = useSelector((state) => state?.isFetching) || false;
	useEffect(() => {
		initListen();
		eventHandler.addEventHandler("chatroom", {
			onError: handleError,
			recallMessage: {
				error: () => {
					console.log("recallMessage error");
				}
			},
			sendMessage: {
				error: () => {
					console.log("sendMessage error");
				}
			},
			modifyMessage: {
				error: () => {
					console.log("modifyMessage error");
				}
			}
		})
	}, []);
	return (
		<div className="App">
			<Loading show={isFetching} />
			<UIKitProvider
				// onError={handleError}
				initConfig={{
					appKey: "41117440#383391"
				}}
			// reactionConfig={{
			// 	path: '/assets/',
			// 	map: {
			// 		'emoji_1': <img src={customIcon} alt={'emoji_1'} />,
			// 		'emoji_2': <img src={customIcon} alt={'emoji_2'} />,
			// 		'emoji_3': <img src={customIcon} alt={'emoji_3'} />,
			// 		'emoji_4': <img src={customIcon} alt={'emoji_4'} />
			// 	}
			// }}
			>
				<HashRouter basename="/" history={history}>
					<Switch>
						<Route exact path="/login" component={Login} />
						<Route exact path="/main" component={Main} />

						<Route exact path="/signup" component={Signup} />
						<Route
							path="/"
							render={() => (
								<AuthorizedComponent token={"11"} component={Main} />
							)}
						/>
					</Switch>
				</HashRouter>
			</UIKitProvider>
		</div>
	);
}

export default App;
