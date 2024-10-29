const Credentials = require('../models/credentials');
const axios = require('axios');


const getAccessToken = async (userId) => {
    const creds = await Credentials.findOne({ userId });
    return creds?.github?.accessToken;
}

const noAccessToken = (_, res) => res.status(500).send({ status: 'error', message: 'Access token has not been generated.' });

const checkStatus = async (req, res) => {
    const userId = req?.user?._id;
    let accessToken = await getAccessToken(userId);
    if (!accessToken) return noAccessToken(req, res);
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        return res.status(200).send(response?.data);
    } catch (error) {
        if (error?.response) {
            return res.status(error?.response?.status).send({
                status: 'failed',
                message: error?.response?.data?.message || 'Invalid or expired token',
            });
        } else {
            return res.status(500).send({ status: 'error', message: 'Internal Server Error' });
        }
    }
}


const fetchRepos = async (req, res) => {
    const userId = req?.user?._id;
    let accessToken = await getAccessToken(userId);
    if (!accessToken) return noAccessToken(req, res);
    try {
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return res.send(response?.data);
    } catch (error) {
        return res.status(500).send({ message: error?.response?.data?.message || 'Failed to fetch repositories' });
    }
};

const createRepo = async (req, res) => {
    const { repoName } = req.body;
    const userId = req?.user?._id;
    let accessToken = await getAccessToken(userId);
    if (!accessToken) return noAccessToken(req, res);
    try {
        const response = await axios.post('https://api.github.com/user/repos', {
            name: repoName,
            private: true
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return res.send(response?.data);
    } catch (error) {
        return res.status(500).send({ message: error?.response?.data?.message || 'Failed to create repository' });
    }
};

const fetchBranches = async (req, res) => {
    const { owner, repoName } = req.params;
    const userId = req?.user?._id;
    let accessToken = await getAccessToken(userId);
    if (!accessToken) return noAccessToken(req, res);
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/branches`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return res.send(response?.data);
    } catch (error) {
       return res.status(500).send({ message: error?.response?.data?.message || `Failed to fetch branches for ${repoName}` });
    }
};

// Route to create a new branch
const createBranch = async (req, res) => {
    const { owner, repoName } = req.params;
    const { branchName, sourceBranch } = req.body;
    const userId = req?.user?._id;
    let accessToken = await getAccessToken(userId);
    if (!accessToken) return noAccessToken(req, res);

    try {
        const refResponse = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/${sourceBranch}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const sourceSha = refResponse.data.object.sha;

        await axios.post(`https://api.github.com/repos/${owner}/${repoName}/git/refs`, {
            ref: `refs/heads/${branchName}`,
            sha: sourceSha
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        res.send({ message: 'Branch created successfully' });
    } catch (error) {
        res.status(500).send({ message: error?.response?.data?.message || 'Failed to create branch' });
    }
};

// Route to push code to a branch
const pushCode = async (req, res) => {
    const { owner, repoName, branch } = req.params;
    const { configData, configName } = req.body;
    const userId = req?.user?._id;
    let accessToken = await getAccessToken(userId);
    if (!accessToken) return noAccessToken(req, res);

    try {
        // Convert config data to a formatted JSON string
        const fileContent = JSON.stringify(configData, null, 2);
        const filePath = `${configName}.json`;
        
        // Get reference to the branch
        const refResponse = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/${branch}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const branchSha = refResponse.data.object.sha;

        // Get the current commit
        const commitResponse = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/git/commits/${branchSha}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const treeSha = commitResponse.data.tree.sha;

        // Create a blob with the file content
        const blobResponse = await axios.post(`https://api.github.com/repos/${owner}/${repoName}/git/blobs`, {
            content: fileContent,
            encoding: 'utf-8'
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const blobSha = blobResponse.data.sha;

        // Create a new tree with the updated file
        const newTreeResponse = await axios.post(`https://api.github.com/repos/${owner}/${repoName}/git/trees`, {
            base_tree: treeSha,
            tree: [{
                path: filePath,
                mode: '100644',
                type: 'blob',
                sha: blobSha
            }]
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const newTreeSha = newTreeResponse.data.sha;

        // Create a new commit
        const commitMessage = `Updated ${configName} by CX-Tools`;
        const newCommitResponse = await axios.post(`https://api.github.com/repos/${owner}/${repoName}/git/commits`, {
            message: commitMessage,
            tree: newTreeSha,
            parents: [branchSha]
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const newCommitSha = newCommitResponse.data.sha;

        // Update the branch reference
        await axios.patch(`https://api.github.com/repos/${owner}/${repoName}/git/refs/heads/${branch}`, {
            sha: newCommitSha
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        res.status(200).send({ 
            message: 'Configuration backed up successfully',
            filePath,
            commitSha: newCommitSha
        });
    } catch (error) {
        console.error('Error pushing to GitHub:', error?.response?.data || error?.message);
        res.status(500).send({ 
            message: error?.response?.data?.message || 'Failed to backup configuration',
            error: error?.response?.data || error.message
        });
    }
};


module.exports = {
    checkStatus,
    fetchRepos,
    createRepo,
    fetchBranches,
    createBranch,
    pushCode,
}