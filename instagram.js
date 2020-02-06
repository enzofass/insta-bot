const puppeteer = require('puppeteer');

const BASE_URL = 'http://instagram.com/';
const TAG_URL = tag => `https://www.instagram.com/explore/tags/${tag}/`;

const instagram = {
	browser: null,
	page: null,

	initialize: async () => {
		console.log('init');
		instagram.browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			headless: false
		});

		instagram.page = await instagram.browser.newPage();
	},

	login: async (username, password) => {
		await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

		let loginButton = await instagram.page.$x(
			'//a[contains(text(), "Log in")]'
		);

		/* Click on the login button */
		await loginButton[0].click();

		await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });

		await instagram.page.waitFor(5000);

		/* Writing username and password */
		await instagram.page.type('input[name="username"]', username, {
			delay: 50
		});
		await instagram.page.type('input[name="password"]', password, {
			delay: 50
		});

		/* Click login button */
		loginButton = await instagram.page.$x(
			'//div[contains(text(), "Log In")]/ancestor::button'
		);
		await loginButton[0].click();

		await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });
	},
	showPosts: async () => {
		/* Do not allow notifications */
		let notNowBtn = await instagram.page.$x(
			'//button[contains(text(), "Not Now")]'
		);
		await notNowBtn[0].click();

		/* Show posts */
		let newPostBtn = await instagram.page.$x(
			'//div[contains(text(), "New Posts")]'
		);
		await newPostBtn[0].click();
		await instagram.page.waitFor(10000);
	},
	/* Fill in search field */
	// searchTags: async searchText => {
	// 	await instagram.page.type('input[placeholder="Search"]', searchText, {
	// 		delay: 50
	// 	});

	// 	await instagram.page
	// 		.waitForXPath(`//span[contains(text(), "#${searchText}")]/ancestor::a`, {
	// 			visible: true
	// 		})
	// 		.then(() => {
	// 			instagram.page.keyboard.press(String.fromCharCode(13));
	// 		});
	// 	await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });
	// },
	/* Like images on page */
	likePosts: async (tags = []) => {
		for (let tag of tags) {
			/* Go to the tag page */
			await instagram.page.goto(TAG_URL(tag), { waitUntil: 'networkidle2' });
			await instagram.page.waitFor(1000);

			let posts = await instagram.page.$$(
				'article > div:nth-child(3) img[decoding="auto"]'
			);

			for (let i = 0; i < 3; i++) {
				let post = posts[i];

				/* Click on the post */
				await post.click();

				/* Wait for modal to show */

				await instagram.page.waitFor('body[style="overflow: hidden;"]');
				await instagram.page.waitFor(2000);

				let isLikeable = await instagram.page.$('svg[aria-label="Like"]');

				if (isLikeable) {
					await instagram.page.click('svg[aria-label="Like"]');
				}
				await instagram.page.waitFor(3000);
				/* Close modal */
				let closeModalBtn = await instagram.page.$$(
					'button > svg[aria-label="Close"]'
				);
				await closeModalBtn[0].click();
				await instagram.page.waitFor(1000);
			}
			await instagram.page.waitFor(5000);
		}
	},
	closeBrowser: async () => {
		await instagram.page.waitFor(5000);
		console.log('closing browser');
		await instagram.browser.close();
	}
};

module.exports = instagram;
