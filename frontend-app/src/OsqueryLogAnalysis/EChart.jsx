import React from 'react';
import ReactECharts from 'echarts-for-react';

const EChart = ({ options }) => {

    return (
        <ReactECharts
            option={options}
            style={{
                minHeight: '61vh',
            }}
        />
    );
};

export default EChart;