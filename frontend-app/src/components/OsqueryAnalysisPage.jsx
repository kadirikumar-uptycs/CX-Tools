import React, { useEffect } from 'react';

const OsqueryAnalysisPage = () => {
    useEffect(() => {
        document.title = 'Osquery Log Analysis';
    }, []);
    return (
        <div>
            Osquery Analysis Tool
        </div>
    );
}

export default OsqueryAnalysisPage;
