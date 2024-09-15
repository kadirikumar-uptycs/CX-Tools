import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-textile';
import 'prismjs/components/prism-bash';
import 'prismjs/themes/prism-okaidia.min.css';

const CodeTyping = ({ heading, language, code, speed }) => {
	const [displayedCode, setDisplayedCode] = useState({ index: -1, code: '' });
	const [isTyping, setIsTyping] = useState(true);
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

		const typeCode = async (index) => {
			if (index < code.length) {
				if (index === 0)
					setDisplayedCode({
						index: index,
						code: code?.charAt(index),
					})
				else
					setDisplayedCode((prev) => {
						if (prev?.index !== index)
							return {
								index: index,
								code: prev?.code + code?.charAt(index)
							}
						else return prev;
					});
				await delay(speed);
				typeCode(index + 1);
			} else {
				setIsTyping(false);
				setTimeout(() => {
					Prism.highlightAll();
				}, 10);
			}
		};
		typeCode(0);
	}, [code, speed]);

	const handleCopy = () => {
		navigator.clipboard.writeText(code).then(() => {
			setIsCopied(true);
			setTimeout(() => setIsCopied(false), 1500);
		});
	};

	return (
		<Box
			sx={{
				backgroundColor: '#282c34',
				borderRadius: '8px',
				padding: '20px',
				width: '100%',
				maxWidth: '800px',
				margin: '20px auto',
				boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
				position: 'relative',
			}}
		>
			<Typography
				variant="h6"
				sx={{
					color: '#ffffff',
					fontFamily: 'monospace',
					marginBottom: '10px',
				}}
			>
				{heading} ({language})
			</Typography>


			<Tooltip title={isCopied ? 'Copied!' : 'Copy code'}>
				<IconButton
					onClick={handleCopy}
					sx={{
						position: 'absolute',
						top: '15px',
						right: '15px',
						color: '#ffffff',
					}}
				>
					<ContentCopyIcon />
				</IconButton>
			</Tooltip>

			<pre style={{
				padding: '20px',
				whiteSpace: 'pre-line',
				scrollbarWidth: 'thin',
				maxWidth: '100%',
				overflowX: 'auto'
			}}
			>
				<code className={`language-${language}`}>
					{displayedCode?.code}
				</code>
				{isTyping && <span className="cursor"></span>}
			</pre>

			<style>{`
        .cursor {
          display: inline-block;
          width: 10px;
          background-color: #ffffff;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
		</Box>
	);
};

export default CodeTyping;