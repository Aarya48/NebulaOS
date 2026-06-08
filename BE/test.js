const fs = require('fs');

async function test() {
  const FormData = require('form-data');
  const form = new FormData();
  form.append('reset', 'true');

  // We need a valid token. Let's just bypass auth for a moment in a test endpoint, or grab a token?
  // Actually, I can just use curl or fetch here, but I don't have a token.
}
