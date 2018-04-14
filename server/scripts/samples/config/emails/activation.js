module.exports = {
    title: 'Account Activation',
    body: (link) => `<h1>Account Activation</h1>
<p>Thank you for signing up! Before you can login, you will need to activate your account.
To activate your account, click the link below, or copy paste it into your browser's address bar.</p>

<p>Activation Link: <a href="${link}">${link}</a></p>

<p>Welcome!</br>
The Dapper Team</p>`,
};
