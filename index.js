var domify = require('domify')
  , agent = require('agent')
  , Emitter = require('emitter')
  , Dialog = require('dialog').Dialog
  , cookie = require('cookie')
  , facebook = require('facebook')


var login = module.exports = new Emitter();

login.show = function() {
  if (!login.token) {
    loginModal.overlay().show()
  }
}

login.logout = function() {
  login.token = undefined;
  form.username.value = '';
  form.password.value = '';
  saveSessionCookie();
  login.emit('logout');
}


var el = domify(require('./template'))[0];
var form = el.querySelector('form');
var loginWithFacebook = el.querySelector('[data-action="login-with-facebook"]');
var badCredentials = el.querySelector('.bad-credentials');
badCredentials.hidden = true;
var loginModal = new Dialog();
modalBody = loginModal.el.find('.body');
modalBody.html(el);


form.onsubmit = function(e) {
  e.preventDefault();
  var payload = {
    username: form.username.value,
    password: form.password.value
  }
  postPayload(payload);
}

loginWithFacebook.onclick = function(e) {
  FB.login(function(resp) {
    var token = FB.getAccessToken();
    var payload = {
      facebook_token: token,
    }
    postPayload(payload);
  });
}

function saveSessionCookie() {
  var domain = location.hostname.match(/(\.[^.]+\.[^.]+)$/)[1];
  cookie('indabaAccessToken', login.token, {
    maxage: 1000 * 60 * 60 * 24 * 365, // about a year
    path: '/',
    domain: domain
  });
}

function loadSessionCookie() {
  login.token = cookie('indabaAccessToken') || null;
  if (login.token) onToken();
}

function postPayload(payload) {
  badCredentials.hidden = true;
  agent.post('/login', payload, function(resp) {
    if (resp.status === 200) {
      login.token = resp.body.access_token
      onToken();
    }
    else if (resp.status === 401) {
      badCredentials.hidden = false;
    }
    else {
      console.error("unknown login response", resp.status, resp);
    }
  })
}

function onToken() {
  saveSessionCookie();
  loginModal.hide();
  login.emit('token');
}


// try to load your existing token
setTimeout(loadSessionCookie);

