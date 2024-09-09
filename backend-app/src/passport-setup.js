const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const connectDB = require('./models/db');
const User = require('./models/user');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            await connectDB();
            let user = await User.findOne({ email: profile?.emails[0]?.value });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            if (!user.profileImage) {
                user.profileImage = profile?.photos[0]?.value;
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

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        await connectDB();
        const user = await User.findById(id);
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: 'User not found' });
        }
    } catch (err) {
        done(err, false, { message: err });
    }
});