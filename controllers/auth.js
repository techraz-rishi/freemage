const googleAuth = require('../utils/google-auth.js');
const generateToken = require('../utils/generate-token-by-id.js');
const User = require('../model/user.js');

exports.login = async (req, res) => {
  try {
    const code = req.body.code;
    const r = await googleAuth.getIdToken(code);
    const profile = await googleAuth.getPayload(r);

    let user = await User.findOne({ googleId: profile.sub });

    if (!user) {
      user = new User({
        googleId: profile.sub,
        name: profile.name,
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        profilePic: profile.picture
      });
      await user.save();
    }

    const token = generateToken(user.id);

    res.send({ user, token });
  } catch (e) {
    console.log(e);
    if (e.code === 'ETIMEDOUT') {
      return res.status(500).send();
    }
    res.status(401).send();
  }
};
