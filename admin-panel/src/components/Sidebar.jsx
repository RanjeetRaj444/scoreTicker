import { Divider } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { HomeFilled, PlusCircleFilled } from "@ant-design/icons";

const Sidebar = () => {
	return (
		<div className="sm:w-[300px] w-[500px] p-5 bg-[--light-color] shadow-lg h-screen sticky top-0">
			<div className="icon_title flex gap-3 items-center ">
				<img
					src="https://pngimagesfree.com/wp-content/uploads/Cricket_player-clipart-png-images-1.png"
					alt="icon"
					className="w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] rounded-full bg-slate-400"
				/>
				<h1 className="text-2xl font-bold">Cricket Panel</h1>
			</div>

			<Divider />

			<div className="nav_options">
				<ul className="flex flex-col gap-2 mt-5">
					<Link to="/" className="text-lg ">
						<li className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 transition-all">
							<HomeFilled className="text-lg" />
							Home
						</li>
					</Link>
					<Link to="/create-match" className="text-lg ">
						<li className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 transition-all">
							<PlusCircleFilled className="text-lg" />
							Create Match
						</li>
					</Link>
					<Link to="/create-venue" className="text-lg ">
						<li className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 transition-all">
							<PlusCircleFilled className="text-lg" />
							Create Venue
						</li>
					</Link>
					<Link to="/create-player" className="text-lg ">
						<li className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 transition-all">
							<PlusCircleFilled className="text-lg" />
							Create Player
						</li>
					</Link>
				</ul>
			</div>
		</div>
	);
};

export default Sidebar;
