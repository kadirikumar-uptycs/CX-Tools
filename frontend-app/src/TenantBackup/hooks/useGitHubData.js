import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from '../../hooks/SnackBarProvider';
import config from '../../config';

export const useGitHubData = () => {
    const [repositories, setRepositories] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const openSnackBar = useSnackbar();

    const fetchRepositories = async () => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.get(
                `${config.SERVER_BASE_ADDRESS}/github/repos`,
                { withCredentials: true }
            );
            setRepositories(response.data);
            openSnackBar('Repositories fetched successfully', 'success');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to fetch repositories');
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async (owner, repoName) => {
        setError(null);
        setLoading(true);
        try {
            const response = await axios.get(
                `${config.SERVER_BASE_ADDRESS}/github/repos/${owner}/${repoName}/branches`,
                { withCredentials: true }
            );
            openSnackBar('Branches fetched successfully', 'success');
            setBranches(response.data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to fetch branches');
        } finally {
            setLoading(false);
        }
    };

    const createBranch = async (owner, repoName, branchName) => {
        openSnackBar(`Creating New Branch ${branchName}`);
        try {
            await axios.post(
                `${config.SERVER_BASE_ADDRESS}/github/repos/${owner}/${repoName}/branches`,
                { branchName },
                { withCredentials: true }
            );
            openSnackBar('New Branch created successfully', 'success');
            await fetchBranches(repoName);
        } catch (err) {
            openSnackBar('Failed to create branch', 'danger');
            setError(err?.response?.data?.message || 'Failed to create branch');
        }
    };

    return {
        repositories,
        branches,
        loading,
        error,
        fetchRepositories,
        fetchBranches,
        createBranch,
    };
};