var domify = require('domify')
  , agent = require('agent')

var form = domify(require('./template'))[0];
document.body.appendChild(form);

form.onsubmit = function(e) {
  e.preventDefault();
  var payload = {
    username: form.username.value,
    password: form.password.value
  }
  agent.post('/login', payload, function(resp) {
    if (resp.status === 200) {
      console.log("TOKEN!", resp.body.access_token)
    }
    else {
      console.log("login failed")
    }
  })
}
