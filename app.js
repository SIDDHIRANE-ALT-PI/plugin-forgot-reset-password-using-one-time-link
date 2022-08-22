const { urlencoded } = require('body-parser');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.set('view engine', 'ejs');

let user = {
  id: 'lakdjfvbnkj2424t2',
  email: 'jhondoe@gmail.com',
  password: 'asjdnvkjasndva;wprihjgieprhjg324909'
};

const JWT_SECRET = 'Some Super Secret...'

app.get('/', (req, res) => {
  res.send('hello world!');
});


app.get('/forgot-password', (req, res, next) => {
  res.render('forgot-password');
});


app.post('/forgot-password', (req, res, next) => {
  const { email } = req.body;
  //res.send(email);

  // make sure user exist in database

  if (email !== user.email) {
    res.send('USer not registered')
    return;
  }


  //user exist and now create a one time link valid for 15minutes
  const secret = JWT_SECRET + user.password;
  const payload = {
    email: user.email,
    id: user.id
  }
  const token = jwt.sign(payload, secret, { expiresIn: '10s' })
  const link = `http://loaclhost:8000/reset-password/${user.id}/${token}`
  console.log(link)
  res.send('Password reset link has been sent to ur email...')
});



app.get('/reset-password/:id/:token', (req, res, next) => {
  const { id, token } = req.params;
  // check if this id exist in database
  if (id !== user.id) {
   // res.send('Invalid id...')
    return
  }

  // we have a valid id,and we have a valid user with this id
  const secret = JWT_SECRET + user.password
  try {
    const payload = jwt.verify(token, secret);
    res.render('reset-password', { email: user.email });
  }
  catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
  res.send(req.params);
});



app.post('/reset-password/:id/:token', (req, res, next) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;

  // check if this id exist in database
  // if (id !== user.id) {
  //   res, send('Invalid id...')
  //   return
  // }
  const secret = JWT_SECRET + user.password
  try {
    const payload = jwt.verify(token, secret);
    //validate password and password2 should match
    // we can simply find the user with the payload email and id and finally update with new password
    // always hash the password before saving
    user.password = password;

    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }

});

app.listen(8000, (req, res) => {
  console.log('http://localhost/8000 server is running on .');
})