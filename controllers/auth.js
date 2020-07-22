const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const e = require('express');

const transporter = nodemailer.createTransport(sendgridTransport({
auth: {
  api_key: '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'
}
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMsg: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationError: []
    
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMsg: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationError: []
    
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMsg: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword
      },
      validationError: errors.array()
      
    });
  }
    bcrypt.hash(password, 12)
  .then(hashedPassword => {
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] }
    });
    return user.save();
  })
  .then(result => {
    res.redirect('/login');
    return transporter.sendMail({
      to: email,
      from: 'mazab3384@gmail.com',
      subject: 'Signup Succeded',
      html: '<h1> you succesfully signed up! </h1>'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMsg: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationError: errors.array()
    });
  }

  User.findOne({email: email})
    .then(user => {
      if (!user){
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMsg: 'Invalid Email or Password',
        oldInput: {
          email: email,
          password: password
        },
        validationError: []
      });
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
          console.log(err);
           res.redirect('/');
          });
        }
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMsg: 'Invalid Email or Password',
          oldInput: {
            email: email,
            password: password
          },
          validationError: []
        });
      })
      .catch(err => {
        console.log(err);
        res.redirect('/login')
      })

    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMsg: message
    
  });
}

exports.postReset = (req, res, next) =>{
  crypto.randomBytes(32, (err, buffer) =>{
    console.log(err);
    if (err){
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
    .then(user => {
      if (!user){
        req.flash('error', 'User does not exists');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpir = Date.now() + 3600000;
      return user.save();
    })
    .then(result => {
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from: 'mazab3384@gmail.com',
        subject: 'Password Reset',
        html: `
          <p>You requested a password reset</p>
          <p>click on this <a href="http://localhost:3000/reset/${token}">Link</a> to reset your password</p>
        `
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });

  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpir: {$gt: Date.now()}})
  .then(user => {
    let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null;
  }
  res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'New Password',
    errorMsg: message,
    userId: user._id.toString(),
    passwordToken: token
  });
})
.catch(err => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  next(error);
});
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  let resetUser;

  User.findOne({resetToken: token, resetTokenExpir: {$gt: Date.now()}, _id: userId })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpir = undefined;
    return resetUser.save() 
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  });
};