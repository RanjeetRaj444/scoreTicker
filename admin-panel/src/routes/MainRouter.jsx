import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CreateMatch from "../pages/CreateMatch";
import Home from "../pages/Home";
import NoRouteFound from "../pages/NoRouteFound";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreatePlayer from "../pages/CreatePlayer";
import CreateVenue from "../pages/CreateVenue";
import LiveMatch from "../pages/LiveMatch";

const MainRouter = () => (
	<Router>
		<div className="app flex ">
			<Sidebar />
			<div className="main-content flex-1">
				{/* <Navbar /> */}
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/match/live/:id" element={<LiveMatch />} />
					<Route path="/create-match" element={<CreateMatch />} />
					<Route path="/create-player" element={<CreatePlayer />} />
					<Route path="create-venue" element={<CreateVenue />} />
					<Route path="*" element={<NoRouteFound />} />
				</Routes>
			</div>
		</div>
	</Router>
);

export default MainRouter;
