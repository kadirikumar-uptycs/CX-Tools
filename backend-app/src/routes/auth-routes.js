require('dotenv').config();
const express = require('express');
const passport = require('passport');


const router = express.Router();

router.delete('/logout', (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                return res.status(500).send({ message: err });
            }
        });
        return res.status(200).send('Logged Out Successfully!!!');
    } catch (err) {
        return res.status(500).send({ message: err });
    }
});

router.get('/google', passport.authenticate('google', {
    prompt: ['select_account'],
    scope: ['openid', 'email', 'profile']
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/unauthorized',
    failureMessage: true
}), (_, res) => {
    res.redirect(`${process.env.UI_BASE_URL}/`);
});

router.get('/unauthorized', (req, res) => {
    const errorMessage = req.session.messages ? req?.session?.messages[0] : null;
    req.session.messages = [];
    return res.status(401).send(errorMessage || 'You are not authorized to access this website.');
});

router.get('/github',
    passport.authenticate('github', {
        session: false,
        scope: ['repo', 'user'],
        prompt: ['select_account'],
    })
);

router.get('/github/callback', 
    passport.authenticate('github', {
        failureRedirect: '/auth/githubFailure',
        failureMessage: true
    }),
    async (_, res) => {
        try {
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>GitHub Authorization</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f8f9fa;
                        }
                        .status-container {
                            text-align: center;
                            padding: 2rem;
                            background-color: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            max-width: 400px;
                            width: 90%;
                        }
                        .success-icon {
                            color: #28a745;
                            font-size: 48px;
                            margin-bottom: 1rem;
                        }
                        .timer {
                            margin-top: 1rem;
                            color: #6c757d;
                            font-size: 0.9rem;
                        }
                        .message {
                            color: #212529;
                            margin: 1rem 0;
                            line-height: 1.5;
                        }
                    </style>
                </head>
                <body>
                    <div class="status-container">
                        <div class="success-icon">✓</div>
                        <h2>Authorization Successful</h2>
                        <p class="message">GitHub access has been granted successfully.</p>
                        <p class="timer">Window closing in <span id="countdown">3</span> seconds</p>
                    </div>

                    <script>
                        let timeLeft = 3;
                        const countdownElement = document.getElementById('countdown');
                        
                        const countdown = setInterval(() => {
                            timeLeft--;
                            countdownElement.textContent = timeLeft;
                            
                            if (timeLeft <= 0) {
                                clearInterval(countdown);
                                window.close();
                            }
                        }, 1000);
                    </script>
                </body>
                </html>
            `);
        } catch (error) {
            return res.redirect('/auth/githubFailure');
        }
    }
);

router.get('/githubFailure', (req, res) => {
    const errorMessage = req?.session?.messages && Array.isArray(req?.session?.messages) 
        ? req?.session?.messages[0] 
        : 'Failed while granting access to GitHub.';
    
    req.session.messages = [];
    
    return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>GitHub Authorization Failed</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f8f9fa;
                }
                .status-container {
                    text-align: center;
                    padding: 2rem;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    max-width: 400px;
                    width: 90%;
                }
                .error-icon {
                    color: #dc3545;
                    font-size: 48px;
                    margin-bottom: 1rem;
                }
                .timer {
                    margin-top: 1rem;
                    color: #6c757d;
                    font-size: 0.9rem;
                }
                .message {
                    color: #dc3545;
                    margin: 1rem 0;
                    line-height: 1.5;
                }
                .retry-button {
                    display: inline-block;
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }
                .retry-button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="status-container">
                <div class="error-icon">×</div>
                <h2>Authorization Failed</h2>
                <p class="message">${errorMessage}</p>
                <p class="timer">Window closing in <span id="countdown">5</span> seconds</p>
            </div>

            <script>
                let timeLeft = 5;
                const countdownElement = document.getElementById('countdown');
                
                const countdown = setInterval(() => {
                    timeLeft--;
                    countdownElement.textContent = timeLeft;
                    
                    if (timeLeft <= 0) {
                        clearInterval(countdown);
                        window.close();
                    }
                }, 1000);
            </script>
        </body>
        </html>
    `);
});

module.exports = router;