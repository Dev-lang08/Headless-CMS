import "./App.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

import EntityForm from "./createEntity";
import Home from "./home";
import Entity from "./entity";

function App() {
	return (
		<>
			<Router>
				<Routes>
					/
    				<Route
						exact
						path="/"
						element={<Home />}
					/>
					<Route
						exact
						path="/entity"
						element={<EntityForm />}
					/>

					<Route
						path="/entity/:entityName"
						element={<Entity />}
					/>
					
					<Route path="/entity/:entityName" element={<Entity />} />
					
					<Route
						path="*"
						element={<Navigate to="/" />}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;
