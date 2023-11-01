import './App.css';
import Main from './layout/main'

import initListen from './utils/WebIMListen'
import Loading from './components/common/loading'
import { useSelector } from 'react-redux'

initListen()

function App(props) {
	const isFetching = useSelector(state => state?.isFetching) || false;
	return (
		<div className="App">
			<Loading show={isFetching} />
			<Main uid={props.uid}/>
		</div>
	);
}


export default App;

