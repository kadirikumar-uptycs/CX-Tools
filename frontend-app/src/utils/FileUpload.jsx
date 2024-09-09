import * as React from 'react';
import Button from '@mui/joy/Button';
import { styled } from '@mui/joy';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import { useSnackbar } from '../hooks/SnackBarProvider';

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

    const ParseInputFileData = async (event) => {
        const fileInput = event.currentTarget;
        const file = fileInput.files[0];

        return new Promise((resolve, reject) => {
            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        const fileName = file.name;
                        resolve({ data, fileName });
                    } catch (error) {
                        reject('Error while parsing, provide JSON file');
                    }
                };

                reader.readAsText(file);
            } else {
                reject('No file selected');
            }
        });
    }

    const handleInput = async (event) => {
        try {
            let response = await ParseInputFileData(event);
            let { data, fileName } = response;
            uploadHandler(data, fileName);
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