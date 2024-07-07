const bcrypt = require("bcrypt");
const User = require("../models/User");
const messageCreator = require("../utils/messageCreator");
const {
  sesClient,
  SendEmailCommand,
  VerifyEmailIdentityCommand,
} = require("../services/emailService");

const { generateToken, verifyToken } = require("../utils/jwt");

exports.current = async (req, res, next) => {
  try {
    const { email, id } = req.query;
    const user = await User.findOne({
      email: email,
    });
    const token = generateToken({ id });
    if (user) {
      const userId = user._id;
      console.log("user in run");
      res.status(200).json({ valid: true, userId, token });
    } else {
      const newUser = new User({ email });
      const userId = newUser._id;
      await newUser.save();
      console.log("user up run");
      res.json({ valid: true, userId, token });
    }
    console.log("user not in and up work");
  } catch (error) {
    console.log("user error block  run");
    //res.json({ valid: false, mess: "issue" });
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const details = req.body;
  try {
    const user = await User.findOne({
      username: details.username,
    });
    if (user && (await bcrypt.compare(details.password, user.password))) {
      const token = generateToken(
        { userId: user._id },
        {
          expiresIn: "1m",
        }
      );

      const verificationLink = `http://localhost:3000/api/verify-mfa?token=${token}&userId=${user._id}`;

      const messageData = messageCreator(
        `Please click this link to log in to your account ${verificationLink}`,
        (email = user.email)
      );

      const command = new SendEmailCommand(messageData);
      sesClient
        .send(command)
        .then(() => {
          res.status(200).json({
            valid: true,
            userId: user._id,
            token,
            message: "Please check the mfa link in your email",
          });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.json({ valid: false, message: "Please fill correct details" });
    }
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  const details = req.body;
  try {
    const user = await User.findOne({ username: details.username });
    if (!user) {
      const hashedPass = await bcrypt.hash(details.password, 10);

      const token = generateToken(
        { username: details.username },
        {
          expiresIn: 30,
        }
      );

      const otp = token.slice(-6);
      const messageData = messageCreator(
        `Use otp below\n\notp: ${otp}`,
        (email = details.email)
      );

      const command = new SendEmailCommand(messageData);

      sesClient
        .send(command)
        .then(() => {
          res.status(200).json({
            valid: true,
            username: details.username,
            email: details.email,
            password: hashedPass,
            token,
            message: "Please check the otp in your lsinked email",
          });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } else {
      res.json({
        valid: false,
        message: "Username already exists, please choose another username",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.forget = async (req, res, next) => {
  const { email, username } = req.body;

  try {
    const user = await User.findOne({ username: username, email: email });
    if (user) {
      const token = generateToken(
        { userId: user._id },
        {
          expiresIn: "1m",
        }
      );

      const verificationLink = `http://localhost:3000/api/verify-email?token=${token}&userId=${user._id}`;
      const messageData = messageCreator(
        `Please click this link to reset your password ${verificationLink}`,
        email
      );

      const command = new SendEmailCommand(messageData);
      sesClient
        .send(command)
        .then(() => {
          res.status(200).json({
            valid: true,
            userId: user._id,
            token,
            message: "Please click the verification link in your email",
          });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: error.message + " error in sending request" });
        });
    } else {
      res.json({
        valid: false,
        message: "Please fill correct details",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  const { token, userId } = req.query;
  const verified = verifyToken(token);
  if (verified === false) {
    res.redirect(`http://localhost:3000/timeout`);
  } else {
    res.redirect(`http://localhost:3000/reset?token=${token}&userId=${userId}`);
  }
};

exports.verifyMFA = async (req, res, next) => {
  try {
    const { token, userId } = req.query;
    const verified = verifyToken(token);
    if (verified === false) {
      res.redirect(`http://localhost:3000/timeout`);
    } else {
      const tokenz = generateToken({ userId });
      res.redirect(`http://localhost:3000?token=${tokenz}&userId=${userId}`);
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const { token, userId } = req.query;
    const verified = verifyToken(token);
    if (verified === false) {
      res.json({ valid: false });
    } else {
      const user = await User.findById(userId);
      if (user) {
        const tokenz = generateToken({ userId });
        res.json({ valid: true, token: tokenz });
      } else {
        res.json({ valid: false });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyEmailPost = async (req, res, next) => {
  const { email } = req.body;

  try {
    await sesClient
      .send(new VerifyEmailIdentityCommand({ EmailAddress: email }))
      .then(() => {
        res.json({
          message: "Please check the verification link in your email",
        });
      })
      .catch((error) => {
        res.json({
          message: "Please fill correct email: " + error.message,
        });
      });
  } catch (error) {
    res.json({
      message: "Please fill correct email: " + error.message,
    });
  }
};

exports.verifyMfaPost = async (req, res, next) => {
  const { token, username, password, email, otp } = req.body;
  try {
    const verified = verifyToken(token);
    if (verified === false) {
      res.json({
        valid: false,
        message:
          otp === token.slice(-6)
            ? "otp expired, please generate new otp"
            : "please enter correct otp",
      });
    } else {
      if (otp === token.slice(-6)) {
        const newUser = new User({
          username: username,
          email: email,
          password: password,
        });
        await newUser.save();
        const tokenz = generateToken({ userId: newUser._id });
        res.json({
          valid: true,
          token: tokenz,
          user: newUser.username,
          userId: newUser._id,
          message: "otp verified successfully",
        });
      } else {
        res.json({ valid: false, message: "please fill correct otp" });
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.reset = async (req, res, next) => {
  const { password, userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      const hashedPass = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(userId, {
        password: hashedPass,
      });
      res.json({ valid: true, message: "password reset successfully" });
    } else {
      res.json({
        valid: false,
        message: "Please use verification link to reset password",
      });
    }
  } catch (error) {
    next(error);
  }
};
