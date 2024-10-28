import React, { useState } from 'react';
import {
    Box,
    Typography,
    Popper,
    Paper,
    ClickAwayListener,
    InputBase,
    Fade,
    Chip,
    Stack,
    CircularProgress,
    IconButton,
    InputAdornment,
    alpha,
} from '@mui/material';
import {
    Star as StarIcon,
    ForkRight as ForkIcon,
    ExpandMore as ExpandMoreIcon,
    Search as SearchIcon,
    Check as CheckIcon,
} from '@mui/icons-material';

const RepositoryList = ({ repositories, loading, onSelect, selectedRepo = null }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelect = (repo) => {
        onSelect(repo);
        handleClose();
    };

    const filteredRepos = repositories?.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
            <Box
                onClick={handleClick}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: alpha('#fff', 0.9),
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                    },
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        {selectedRepo ? (
                            <>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                    {selectedRepo.name}
                                </Typography>
                                {selectedRepo.private && (
                                    <Chip
                                        label="Private"
                                        size="small"
                                        sx={{
                                            height: 20,
                                            bgcolor: 'grey.100',
                                            color: 'text.secondary',
                                        }}
                                    />
                                )}
                            </>
                        ) : (
                            <Typography color="text.secondary">
                                Select a repository
                            </Typography>
                        )}
                    </Stack>
                    <IconButton
                        size="small"
                        sx={{
                            transform: `rotate(${open ? 180 : 0}deg)`,
                            transition: 'transform 0.2s',
                        }}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </Stack>
            </Box>

            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                transition
                style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <Paper
                            elevation={4}
                            sx={{
                                mt: 1,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                maxHeight: 400,
                                overflow: 'hidden',
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                                        <InputBase
                                            fullWidth
                                            placeholder="Search repositories..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" sx={{ fontSize: 20 }} />
                                                </InputAdornment>
                                            }
                                            sx={{
                                                fontSize: '0.875rem',
                                                '& input': { p: 0.5 },
                                            }}
                                        />
                                    </Box>

                                    {loading ? (
                                        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : (
                                        <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
                                            {filteredRepos?.map((repo) => (
                                                <Box
                                                    key={repo.id}
                                                    onClick={() => handleSelect(repo)}
                                                    sx={{
                                                        p: 2,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            bgcolor: 'action.hover',
                                                        },
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        borderBottom: '1px solid',
                                                        borderColor: 'divider',
                                                        '&:last-child': {
                                                            borderBottom: 'none',
                                                        },
                                                    }}
                                                >
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Typography
                                                                variant="subtitle2"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    color: 'text.primary',
                                                                }}
                                                                noWrap
                                                            >
                                                                {repo.name}
                                                            </Typography>
                                                            {repo.private && (
                                                                <Chip
                                                                    label="Private"
                                                                    size="small"
                                                                    sx={{
                                                                        height: 20,
                                                                        bgcolor: 'grey.100',
                                                                        color: 'text.secondary',
                                                                    }}
                                                                />
                                                            )}
                                                        </Stack>
                                                        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {repo.stargazers_count.toLocaleString()}
                                                                </Typography>
                                                            </Stack>
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <ForkIcon sx={{ fontSize: 14, color: 'info.main' }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {repo.forks_count.toLocaleString()}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Box>
                                                    {selectedRepo?.id === repo.id && (
                                                        <CheckIcon color="primary" sx={{ ml: 2 }} />
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Box>
    );
};

export default RepositoryList;