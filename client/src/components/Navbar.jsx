import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="flex justify-between items-center p-6 bg-black text-white ">
			<h1 className="text-3xl font-bold">Cricket Live</h1>
			<ul className="flex space-x-4">
				<Link to={"/"}>
					<li>Home</li>
				</Link>
				<li>Live Matches</li>
				<li>Contact</li>
			</ul>
		</nav>
	);
};

export default Navbar;
