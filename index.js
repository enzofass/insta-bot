require('dotenv').config();
const ig = require('./instagram');

const run = async () => {
	console.log('Function called');
	await ig.initialize();

	await ig.login(process.env.INSTA_USER, process.env.INSTA_PASS);

	await ig.showPosts();

	// await ig.searchTags('beefjerky');

	await ig.likePosts(['beefjerky', 'jerky', 'biltong']);

	await ig.closeBrowser();

	await delay(6);
	run();
};

// return await for better async stack trace support in case of errors.
const delay = async hrs =>
	await new Promise(resolve => {
		let hrs2ms = hrs * 3600000;
		setTimeout(resolve, hrs2ms);
	});

run();
