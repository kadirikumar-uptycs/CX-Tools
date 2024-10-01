import React from 'react';
import { Box, Typography } from '@mui/material';
import EChart from './EChart';
import tableHeadCells from './scheduledQueriesDetailsTableColumn.json';
import TableSortAndSelection from '../utils/TableSortAndSelection';

const ScheduledQueriesDetails = ({ scheduledQueriesDetails }) => {

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
        Object.values(scheduledQueriesDetails).map((value) => {
            try {
                rows.push(...value?.details);
            } catch (error) { }
            return null;
        });
        return rows;
    };

    const getChartOptions = (title, data, color) => {
        const seriesData = Object.entries(data);
        return {
            color: [color?.line],
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    const dataPoint = params[0];
                    const date = new Date(dataPoint.value[0]);
                    const count = dataPoint.value[1];
                    const details = dataPoint?.data?.details; // Access details from the data

                    const formatDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    const formatTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                    let tooltipHtml = `
                        <div style="
                            padding: 12px;
                            border-radius: 8px;
                            font-family: 'Arial', sans-serif;">
                            <div 
                                style="font-size: 13px;
                                    font-weight: bold;
                                    color: #0055ff;
                                    margin-bottom: 8px;
                                    border-bottom: 2px solid #0055ff;
                                    padding-bottom: 4px;
                                    text-align: center;">
                                ${formatDate}
                            </div>
                            <div 
                                style="font-size: 15px;
                                    color: #333;
                                    margin-bottom: 8px;
                                    text-align: center;">
                                <span style="font-size:17px;">⏰</span> ${formatTime}
                            </div>
                        <div style="
                          font-size: 17px;
                          font-weight: bold;
                          color: #ff3c00;
                          text-align: center;
                          margin-bottom: 3px;
                        ">
                          #️⃣ ${count}
                        </div>
                    `;

                    if (details) {
                        details.forEach(detail => {
                            const statusColor = detail.status === 'Completed' ? '#4caf50' : '#ff9800';
                            tooltipHtml += `
                                <div style="font-size: 14px; margin: 2px 0 2px 10px; display: flex; align-items: center;">
                                    <span style="
                                        max-width: 300px;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        text-overflow: ellipsis;
                                        display: inline-block;
                                    ">
                                        <strong>${detail.queryName}</strong>
                                    </span>   
                                    :</span> 
                                        <span style="
                                            color: ${statusColor};
                                            font-size: 12px;
                                            font-weight: bold;
                                            padding: 2px 6px;
                                            border-radius: 4px;
                                            border: 1px solid ${statusColor};
                                            margin-left: 8px;
                                        ">${detail.status}</span>
                                </div>
                            `;
                        });

                    }

                    tooltipHtml += '</div>';
                    return tooltipHtml;
                },
                backgroundColor: 'rgb(255, 255, 255, 0.9)',
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
                    data: seriesData.map(([key, value]) => ({
                        value: [Number(key), value?.count || 0],
                        details: value?.details || [],
                    })),
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
                <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2, marginTop: 3 }}>Scheduled Queries Details</Typography>
                <EChart options={getChartOptions('Scheduled Queries Details', scheduledQueriesDetails, randomColor)} />
            </Box>
            <TableSortAndSelection
                headCells={tableHeadCells}
                rows={getTableRows()}
                toolBarParams={{
                    title: 'Complete Scheduled Queries History',
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

export default ScheduledQueriesDetails;
