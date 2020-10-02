const nodemailer = require('nodemailer');
// CORS Handling
const headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		type: 'OAuth2',
		user: '<YOUR_EMAIL_ID>', // eg: name@gmail.com
		clientId: '<YOUR_CLIENT_ID>',
		clientSecret: '<YOUR_CLIENT_SECRET>',
		refreshToken: '<YOUR_REFRESH_TOKEN>',
		accessToken: '<YOUR_ACCESS_TOKEN>'
	}
});


exports.handler = function (event, context, callback) {
	// body params from POST request
	const { message = '' } = event;

	// respond to OPTIONS method with a response header -> todo find a better way to identify OPTIONS call
	if (!message) {
		const response = {
			statusCode: 200,
			headers,
			body: 'OK'
		};
		callback(null, response);
		return;
	}

	const html = ` <h3>Message</h3>
			<p style="border: 1px solid goldenrod;padding: 2% 5%;">${message}</p>
			`;

	const mailOptions = {
		from: '<YOUR_EMAIL_ID>',
		to: '<SENDER_EMAIL>',
		subject: 'Test',
		html
	};


	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			const response = {
				statusCode: 500,
				headers,
				body: JSON.stringify({
					error: error.message,
				}),
			};
			callback(null, response);
			return;
		}
		const response = {
			statusCode: 200,
			headers,
			body: JSON.stringify({
				message: `Email processed succesfully!`
			}),
		};
		callback(null, response);
	});
}
