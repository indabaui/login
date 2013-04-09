var domify = require('domify')
  , agent = require('agent')
  , Dialog = require('dialog').Dialog
  , cookie = require('cookie')

var form = domify(require('./template'))[0];
var loginModal = new Dialog();
modalBody = loginModal.el.find('.body');
modalBody.html(form);

// try to load your existing token
loadSessionCookie();

form.onsubmit = function(e) {
  e.preventDefault();
  var payload = {
    username: form.username.value,
    password: form.password.value
  }
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

function onToken() {
  saveSessionCookie();
  loginModal.hide();
  console.log("onToken!", exports.token)
}
