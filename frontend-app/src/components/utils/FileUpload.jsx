import React, { useRef } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export default function FileUpload({ label, fileInputHandler, acceptedFormat }) {

	let fileNameRef = useRef(null);

	return (
		<div className="file-upload">
			<Button
				component="label"
				variant="contained"
				startIcon={<CloudUploadIcon />}
			>
				{label}
				<VisuallyHiddenInput
					type="file"
					accept={acceptedFormat}
					onInput={(event) => {
						if (fileNameRef?.current?.innerText)
							fileNameRef.current.innerText = event?.currentTarget?.files[0] | 'No File Choosen';
						fileInputHandler(event);
					}}
				/>
			</Button>
			<div
				className="file-name"
				id="file-name-source"
				style={{ color: "#AAAAAA" }}
				ref={fileNameRef}
			>No File Choosen
			</div>
		</div>
	)
}