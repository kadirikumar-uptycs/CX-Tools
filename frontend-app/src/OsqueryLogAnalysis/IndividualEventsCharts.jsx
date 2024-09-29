import React, { useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Paper } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import EChart from './EChart';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { GridView, ViewList, Fullscreen, FullscreenExit } from '@mui/icons-material';

function shuffle(array) {
	let currentIndex = array.length;
	while (currentIndex !== 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
	return array;
}

const IndividualEventsCharts = ({ eventDetails }) => {
	const [layout, setLayout] = useState('grid');
	const [fullscreenChart, setFullscreenChart] = useState(null);
	const [activeTab, setActiveTab] = useState(0);

	const hasEvents = eventDetails && typeof eventDetails === 'object' && Object.keys(eventDetails).length > 0;
	const eventsArray = hasEvents ? Object.entries(eventDetails) : [];
	const colorPairs = [
		{ title: "#6A0DAD", line: "#00A86B" },
		{ title: "#36454F", line: "#FFD700" },
		{ title: "#228B22", line: "#00ff1e" },
		{ title: "#800020", line: "#00b7ff" },
		{ title: "#008B8B", line: "#F88379" },
	];
	const colors = shuffle(colorPairs);

	const getChartOptions = (title, data, color) => {
		const seriesData = Object.entries(data);
		return {
			color: [color?.line],
			tooltip: {
				trigger: 'axis',
				formatter: params => {
					const date = new Date(params[0].value[0]);
					const count = params[0].value[1];

					const formatDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
					const formatTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

					return `
					  <div style="
						padding: 12px;
						border-radius: 8px;
						font-family: 'Arial', sans-serif;
					  ">
						<div style="
						  font-size: 13px;
						  font-weight: bold;
						  color: #0055ff;
						  margin-bottom: 8px;
						  border-bottom: 2px solid #0055ff;
						  padding-bottom: 4px;
						">${formatDate}</div>
						<div style="
						  font-size: 15px;
						  color: #f1f1f1;
						  margin-bottom: 8px;
						">
						  <span style="color: #009688; font-size: 16px;"><span style="font-size:17px;">⏰</span></span> ${formatTime}
						</div>
						<div style="
						  font-size: 17px;
						  font-weight: bold;
						  color: #ff3c00;
						">
						  #️⃣ ${count}
						</div>
					  </div>
					`;
				},
				backgroundColor: 'rgb(0, 0, 0, 0.7);',
				borderWidth: 0,
			},
			toolbox: {
				show: true,
				top: '5%',
				right: '11%',
				feature: {
					dataZoom: {
						yAxisIndex: 'none',
					},
					dataView: {
						readOnly: false,
					},
					magicType: {
						type: ['line', 'bar'],
					},
					restore: {},
					saveAsImage: {},
				},
			},
			xAxis: {
				name: 'Event Time',
				type: 'time',
				nameLocation: 'middle',
				nameGap: 47,
				nameTextStyle: {
					fontWeight: '900',
					fontSize: '13px',
					color: '#707070',
				},
				axisLabel: {
					formatter: value => {
						const date = new Date(value);
						const hours = String(date.getHours()).padStart(2, '0');
						const minutes = String(date.getMinutes()).padStart(2, '0');
						return `${hours}:${minutes}`;
					},
				},
			},
			yAxis: {
				name: 'Count',
				type: 'value',
				nameGap: 69,
				nameLocation: "middle",
				nameTextStyle: {
					fontWeight: '900',
					fontSize: '13px',
					color: '#707070',
				}
			},
			grid: {
				left: '15%',
			},
			series: [
				{
					name: title,
					type: 'line',
					smooth: true,
					data: seriesData?.map(([key, value]) => ([Number(key), value?.count || 0])),
					areaStyle: {
						opacity: 0.1,
					},
					lineStyle: {
						width: 2,
					},
				},
			],
		};
	};

	const handleLayoutChange = (event, newLayout) => {
		if (newLayout !== null) {
			setLayout(newLayout);
		}
	};

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const toggleFullscreen = (chart) => {
		setFullscreenChart(fullscreenChart === chart ? null : chart);
	};

	const renderGridLayout = () => (
		<Grid container spacing={3}>
			{eventsArray.map(([eventName, eventData], index) => (
				<Grid item xs={12} md={6} key={index}>
					<Card elevation={3} sx={{ height: '100%', transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 6 } }}>
						<CardContent>
							<Typography variant="h6" sx={{ textAlign: 'center', verticalAlign: 'middle' }} gutterBottom>{eventName}</Typography>
							<Box position="relative">
								<EChart options={getChartOptions(eventName, eventData, colors[index % colors.length])} />
								<ToggleButton
									value="fullscreen"
									selected={fullscreenChart === index}
									onChange={() => toggleFullscreen(index)}
									sx={{ position: 'absolute', top: -43, right: 0 }}
								>
									{fullscreenChart === index ? <FullscreenExit /> : <Fullscreen />}
								</ToggleButton>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);

	const renderTabLayout = () => (
		<Box>
			<Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
				{eventsArray.map(([eventName], index) => (
					<Tab label={eventName} key={index} />
				))}
			</Tabs>
			<Box mt={2}>
				{eventsArray.map(([eventName, eventData], index) => (
					activeTab === index && (
						<Paper
							elevation={3}
							key={index}
							sx={{
								height: '100%',
								padding: 2,
								transition: 'box-shadow 0.3s',
								'&:hover': { boxShadow: 6 }
							}}
						>
							<Typography variant="h6" sx={{ textAlign: 'center', verticalAlign: 'middle' }} gutterBottom>{eventName}</Typography>
							<Box position="relative" height="calc(100% - 40px)">
								<EChart options={getChartOptions(eventName, eventData, colors[index % colors.length])} />
								<ToggleButton
									value="fullscreen"
									selected={fullscreenChart === index}
									onChange={() => toggleFullscreen(index)}
									sx={{ position: 'absolute', top: 8, right: 8 }}
								>
									<Fullscreen />
								</ToggleButton>
							</Box>
						</Paper>
					)
				))}
			</Box>
		</Box>
	);


	const renderFullscreenChart = () => (
		<Box
			position="fixed"
			top={0}
			left={0}
			right={0}
			bottom={0}
			bgcolor="background.paper"
			zIndex={1000}
			p={2}
		>
			<Typography variant="h6" sx={{ textAlign: 'center', verticalAlign: 'middle' }} gutterBottom>{eventsArray[fullscreenChart][0] || ''}</Typography>
			<ToggleButton
				value="fullscreen"
				selected={true}
				onChange={() => toggleFullscreen(null)}
				sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1001 }}
			>
				<FullscreenExit />
			</ToggleButton>
			<Box height="100%">
				<EChart options={getChartOptions(...eventsArray[fullscreenChart], colors[fullscreenChart % colors.length])} />
			</Box>
		</Box>
	);

	return (
		<Box sx={{ flexGrow: 1, width: '100%', height: '100%', overflowY: 'auto', padding: '20px', scrollbarWidth: 'thin' }}>
			<Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
				<ToggleButtonGroup value={layout} exclusive onChange={handleLayoutChange}>
					<ToggleButton value="grid">
						<GridView />
					</ToggleButton>
					<ToggleButton value="tabs">
						<ViewList />
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			{layout === 'grid' ? renderGridLayout() : renderTabLayout()}
			{fullscreenChart !== null && renderFullscreenChart()}
		</Box>
	);
};

export default IndividualEventsCharts;