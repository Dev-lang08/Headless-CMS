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
import EntityView from "./viewEntites";

function App() {
	return (
		<>
			<Router>
				<Routes>
					/
    				<Route
						exact
						path="/Home"
						element={<Home />}
					/>
					<Route
						exact
						path="/entity"
						element={<EntityForm />}
					/>

					<Route
						export
						path="/viewEntity"
						element={<EntityView />}
					/>

					<Route
						path="/entity/:entityName"
						element={<Entity />}
					/>
					
					<Route path="/entity/:entityName" element={<Entity />} />
					
					<Route
						path="*"
						element={<Navigate to="/Home" />}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;
