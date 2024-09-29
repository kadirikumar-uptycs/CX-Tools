import React from 'react';
import { Box } from '@mui/material';
import ButtonOutlined from '../utils/ButtonOutlined';
import ButtonSolid from '../utils/ButtonSolid';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import SettingsBackupRestoreRoundedIcon from '@mui/icons-material/SettingsBackupRestoreRounded';



const ActionButtons = ({handleClear}) => {
    
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '5px',
                marginBottom: '29px',
                padding: '0 10px',
                paddingRight: '70px',

            }}
        >
            <Box sx={{ display: 'flex', gap: 5 }}>
                <ButtonSolid
                    text="Download"
                    icon={<DownloadRoundedIcon />}
                />
                <ButtonOutlined
                    text="View"
                    icon={<VisibilityRoundedIcon />}
                />
            </Box>
            <ButtonSolid
                text="Clear"
                icon={<SettingsBackupRestoreRoundedIcon />}
                onClick={handleClear}
            />
        </Box>
    );
};

export default ActionButtons;