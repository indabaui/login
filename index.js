var domify = require('domify')
  , agent = require('agent')
  , Dialog = require('dialog').Dialog
  , cookie = require('cookie')
  , facebook = require('facebook')

var el = domify(require('./template'))[0];

var loginModal = new Dialog();
modalBody = loginModal.el.find('.body');
modalBody.html(el);

var form = el.querySelector('form');
var loginWithFacebook = el.querySelector('[data-action="login-with-facebook"]');

// try to load your existing token
loadSessionCookie();

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

exports.show = function() {
  loginModal.overlay().show()
}

function saveSessionCookie() {
  var domain = location.hostname.match(/(\.[^.]+\.[^.]+)$/)[1];
  cookie('indabaAccessToken', exports.token, {
    maxage: 1000 * 60 * 60 * 24 * 365, // about a year
    path: '/',
    domain: domain
  });
}

function loadSessionCookie() {
  exports.token = cookie('indabaAccessToken') || null;
  if (exports.token) onToken();
}

function postPayload(payload) {
  agent.post('/login', payload, function(resp) {
    if (resp.status === 200) {
      exports.token = resp.body.access_token
      onToken();
    }
    else {
      console.log("login failed")
    }
  })
}

function onToken() {
  saveSessionCookie();
  loginModal.hide();
  console.log("onToken!", exports.token)
}
