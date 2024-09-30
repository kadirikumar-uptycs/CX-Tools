import React from 'react';
import { Box, Typography } from '@mui/material';
import EChart from './EChart';
import tableHeadCells from './restartDetailsTableColumn.json';
import TableSortAndSelection from '../utils/TableSortAndSelection';

const RestartDetails = ({ restartDetails }) => {

    const colorPairs = [
        { title: "#6A0DAD", line: "#00A86B" },
        { title: "#36454F", line: "#FFD700" },
        { title: "#228B22", line: "#00ff1e" },
        { title: "#800020", line: "#00b7ff" },
        { title: "#008B8B", line: "#F88379" },
    ];
    const randomColor = colorPairs[Math.floor(Math.random() * colorPairs.length)];

    const getTableRows = () => {
        let rows = [];
        Object.values(restartDetails).map((value) => {
            try {
                rows.push(...value?.details);
            } catch (error) { }
            return null;
        });
        return rows;
    }

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

    return (
        <Box sx={{ flexGrow: 1, width: '100%', height: '100%', overflowY: 'auto', padding: '20px', scrollbarWidth: 'thin' }}>
            <Box bgcolor="background.paper" padding={5} marginBottom={5}>
                <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2, marginTop: 3 }}>Sensor Restart Trend</Typography>
                <EChart options={getChartOptions('Sensor Restart Trend', restartDetails, randomColor)} />
            </Box>
            <TableSortAndSelection
                headCells={tableHeadCells}
                rows={getTableRows()}
                toolBarParams={{
                    title: 'Complete Event Log History',
                    styles: {
                        textAlign: 'center',
                        margin: '21px 0',
                        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                        fontWeight: 400,
                        fontSize: '1.5rem',
                        lineHeight: 1.334,
                        letterSpacing: 0,
                        marginBottom: '16px',
                        marginTop: '24px',
                    }
                }}
            />
        </Box>
    );
};

export default RestartDetails;