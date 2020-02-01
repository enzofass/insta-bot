require('dotenv').config();
const ig = require('./instagram');

(async () => {
	await ig.initialize();

	await ig.login(process.env.INSTA_USER, process.env.INSTA_PASS);

	await ig.showPosts();

	// await ig.searchTags('beefjerky');

	await ig.likePosts(['jerky', 'biltong']);

	debugger;
})();
