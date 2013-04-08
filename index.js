var domify = require('domify')
  , agent = require('agent')
  , Dialog = require('dialog').Dialog


var form = domify(require('./template'))[0];
var loginModal = new Dialog();
modalBody = loginModal.el.find('.body');
modalBody.html(form);

form.onsubmit = function(e) {
  e.preventDefault();
  var payload = {
    username: form.username.value,
    password: form.password.value
  }
  agent.post('/login', payload, function(resp) {
    if (resp.status === 200) {
      exports.token = resp.body.access_token
      console.log("TOKEN!", exports.token)
      loginModal.hide();
    }
    else {
      console.log("login failed")
    }
  })
}

exports.show = function() {
  loginModal.overlay().show()
}
