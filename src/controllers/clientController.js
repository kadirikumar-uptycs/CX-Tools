// controllers for client requests

const homePage = (req, res) => {
    res.render('../views/home', req.session.user);
}

const loginPage = (_, res) => {
    res.render('../views/login');
}

const migrateFlagProfiles = (_, res) => {
    res.render('../views/migrateFlagProfiles');
}

const usersPage = (_, res) => {
    res.render('../views/users');
}


module.exports = {
    homePage,
    loginPage,
    migrateFlagProfiles,
    usersPage,
};