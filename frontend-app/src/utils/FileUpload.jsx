import * as React from 'react';
import Button from '@mui/joy/Button';
import { styled } from '@mui/joy';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import { useSnackbar } from '../hooks/SnackBarProvider';
import parseInputFileData from './parseJsonFileInput';
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function InputFileUpload({ label, uploadHandler }) {

    const openSnackbar = useSnackbar();

    const handleInput = async (event) => {
        try {
            const fileInput = event?.currentTarget;
            const file = fileInput?.files[0];
            let response = await parseInputFileData(file);
            let { data, fileName } = response;
            let jsonData = JSON.parse(data);
            uploadHandler(jsonData, fileName);
        } catch (err) {
            console.log(err);
            openSnackbar(err?.message || `${err}`, 'danger');
        } finally {
            event.target.value = null;
        }
    }

    return (
        <div className='flex-center' style={{
            flexDirection: 'column'
        }}>
            <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="neutral"
                startDecorator={<BackupOutlinedIcon />}
            >
                Upload API Keys
                <VisuallyHiddenInput type="file" accept=".json" onInput={handleInput} />
            </Button>
            <div className="file-name" style={{ color: "#AAAAAA", paddingTop: '10px' }}>{label}</div>
        </div>
    );
}