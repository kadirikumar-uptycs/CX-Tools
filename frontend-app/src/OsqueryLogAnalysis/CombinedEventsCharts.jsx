import React from 'react';
import { Box, Typography } from '@mui/material';
import tableHeadCells from './eventDetailsTableColumn.json';
import TableSortAndSelection from '../utils/TableSortAndSelection';
import EChart from './EChart';

const CombinedEventsCharts = ({ eventDetails }) => {
    const hasEvents = eventDetails && typeof eventDetails === 'object' && Object.keys(eventDetails).length > 0;
    const eventsArray = hasEvents ? Object.entries(eventDetails) : [];

    const colors = [
        "#6A0DAD",
        "#00A86B",
        "#36454F",
        "#FFD700",
        "#228B22",
        "#00ff1e",
        "#800020",
        "#00b7ff",
        "#008B8B",
        "#F88379"
    ];

    const getTableRows = () => {
        let rows = [];
        eventsArray.map(([_, value]) => {
            if (typeof value === 'object') {
                Object.values(value).map(eventDetailsAtTime => {
                    rows.push(...eventDetailsAtTime?.details);
                    return null;
                })
            }
            return null;
        });
        return rows;
    }

    const getStackedLineChartOptions = () => {
        const series = eventsArray.map(([eventName, eventData], index) => ({
            name: eventName,
            type: 'line',
            smooth: true,
            data: Object.entries(eventData).map(([key, value]) => [Number(key), value?.count || 0]),
            areaStyle: {
                opacity: 0.2,
            },
            lineStyle: {
                width: 2,
                color: colors[index % colors.length],
            },
            seriesIndex: index,
        }));

        return {
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    let tooltipHtml = '';
                    let values = [];

                    params.forEach((param, index) => {
                        const date = new Date(param.value[0]);
                        const count = param.value[1];

                        const seriesNameColor = param?.componentSubType === 'bar' ? param.color : colors[param?.componentIndex % colors.length];

                        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                        if (!index) {
                            tooltipHtml += `
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
                                        ${formattedDate}
                                    </div>
                                    <div 
                                        style="font-size: 15px;
                                               color: #333;
                                               margin-bottom: 8px;
                                               text-align: center;">
                                        <span style="font-size:17px;">⏰</span> ${formattedTime}
                                    </div>`;
                        }

                        values.push({
                            seriesNameColor,
                            arrowColor: param?.color,
                            seriesName: param?.seriesName,
                            count,
                        });
                    });

                    values.sort((a, b) => b.count - a.count);

                    values.forEach(item => {
                        tooltipHtml += `
                            <div style="
                                font-size: 17px;
                                font-weight: bold;
                                color: #ff3c00;">
                                <span style="color:${item.seriesNameColor}; margin-right:5px;">
                                    <span style="color: ${item.arrowColor};">➸</span>&nbsp;&nbsp; 
                                    ${item.seriesName}:&nbsp;</span> 
                                ${item.count}
                            </div>`;
                    });
                    tooltipHtml += '</div>';
                    return tooltipHtml;
                },

                backgroundColor: 'rgb(255, 255, 255, 0.9)',
                borderWidth: 0,
            },
            toolbox: {
                show: true,
                right: '3%',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                    },
                    dataView: {
                        readOnly: false,
                    },
                    magicType: {
                        type: ['line', 'bar', 'stack'],
                    },
                    restore: {},
                    saveAsImage: {},
                },
            },
            xAxis: {
                type: 'time',
                name: 'Event Time',
                nameLocation: 'middle',
                nameGap: 47,
                axisLabel: {
                    formatter: value => {
                        const date = new Date(value);
                        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                    },
                },
            },
            yAxis: {
                name: 'Count',
                type: 'value',
                nameGap: 60,
                nameLocation: 'middle',
            },
            series: series,
        };
    };

    return (
        <Box sx={{ flexGrow: 1, width: '100%', height: '100%', overflowY: 'auto', padding: '100px 20px', scrollbarWidth: 'thin'}}>
            <Box bgcolor="background.paper" padding={5} marginBottom={5}>
                <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2, marginTop: 3 }}>Minute-by-Minute Event Count</Typography>
                <EChart options={getStackedLineChartOptions()} />
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

export default CombinedEventsCharts;