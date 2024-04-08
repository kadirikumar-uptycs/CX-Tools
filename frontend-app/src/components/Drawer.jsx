import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Button from '@mui/material/Button';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import './css/Drawer.css';

export default function DrawerComponent({ passChildStateSetter }) {

	let [drawer, setDrawer] = useState({
		open: false,
		content: {},
	});

	passChildStateSetter(setDrawer);

	function closeDrawer() {
		setDrawer({
			open: false,
			content: [],
		})
	}

	function ListView(list) {
		console.log(list);
		return (
			<ul>
				{list.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		);
	}
	

	return (
		<div>
			<React.Fragment>
				<Drawer
					anchor='bottom'
					open={drawer.open}
					onClose={closeDrawer}
				>
					<div className='nav-bar'>
						<span className='drawer-heading'>Error Occurred while transfering some resources</span>
					</div>

					<div className='table'>
						<div className="row row-heading">
							<div className="col">Resource Name</div>
							<div className="col">Error</div>
							<hr />
						</div>
						{drawer.content.errors?.map(row => (
							<div className="row" key={row?.name}>
								<div className="col">{row.name}</div>
								<div className="col col-2">
									{
										Array.isArray(row?.error) ?
										ListView(row?.error) : row?.error
									}
								</div>
								<hr />
							</div>
						))}
					</div>
					<div className='footer'>
						<div className='errorStats'>
							<ReportProblemIcon sx={{
								color: '#ec533e'
							}} />
							<span className='count'>{drawer.content.failed}</span>
							<span className='slash'>/</span>
							<span className='count'>{drawer.content.total}</span>
							<span className='status'>Failed</span>
						</div>
						<Tooltip title='Close'>
							<Button variant="contained" startIcon={<CloseFullscreenIcon />} onClick={closeDrawer} sx={{
								borderRadius: '0',
								height: '60px',
							}}>
								CLOSE
							</Button>
						</Tooltip>
					</div>
				</Drawer>
			</React.Fragment>
		</div>
	);
}