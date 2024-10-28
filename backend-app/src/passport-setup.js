const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const connectDB = require('./models/db');
const User = require('./models/user');
const Credentials = require('./models/credentials');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            await connectDB();
            const email = profile?.emails[0]?.value;
            if (!email) {
                return done(null, false, { message: 'Email not provided' });
            }
            let user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            if (user?.profileImage !== profile?.photos[0]?.value) {
                try {
                    await User.findByIdAndUpdate(user?.id, {
                        $set: {
                            profileImage: profile?.photos[0]?.value,
                        }
                    });
                } catch (err) { }
            }
            done(null, user);
        } catch (err) {
            done(err, false, { message: err });
        }
    }));


passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['repo', 'user'],
    passReqToCallback: true
},
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            await connectDB();

            if (!req.user) {
                return done(null, false, { message: 'Session Expired!! Please Login First.' });
            }

            const user = await User.findById(req.user._id);
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }

            await Credentials.findOneAndUpdate(
                { userId: user._id },
                {
                    $set: {
                        github: {
                            id: profile.id,
                            username: profile.username,
                            profileImage: profile?.photos[0]?.value,
                            accessToken: accessToken,
                        }
                    }
                },
                { upsert: true, new: true }
            );

            return done(null, user);
        } catch (err) {
            done(err, false, { message: err.message });
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        await connectDB();
        const user = await User.findById(id);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        done(null, user);
    } catch (err) {
        done(err, false, { message: err?.message || err });
    }
});