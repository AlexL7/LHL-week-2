'use strict';

const repoOwnerData = process.argv;
const githubOwner = process.argv[2];
const githubUsername = process.argv[3];

const http = require('http');
const fs = require('fs');
const dir = './avatars';
const request = require('request');



function githubRequest(endpoint, callback) { //Requesting function to Github
    const githubRoot = "https://api.github.com";

    let requestData = {
        url: `${githubRoot}${endpoint}`,
        auth: {
            bearer: '2533ca353fc15a6fef11a0aecf34efbc007b6de3'
        },
        headers: {
            'User-Agent': 'request' // Github requires a user agent header.
        }
    };
    request.get(requestData, callback);
}

function getGithubContributors(owner, username, callback) { //Entering Arguments to access the correct API location
    githubRequest(`/repos/${owner}/${username}/contributors`, callback);
}

console.log(`Getting ${githubUsername} contributors.\n`);

getGithubContributors(githubOwner, githubUsername, function(error, response, body) {
    if (error) {
        console.log("Wrong: ", error);
        return;
    }

    const contributors = JSON.parse(body); //converting JSON file

    console.log("Starting to download files....")

    contributors.forEach(function(account) {
        downloadImagesByURL(account.avatar_url, `./avatars/${account.login}`); //loop between each url
    });
});


function downloadImagesByURL(url, filePath) { //Given url download it using pipe.
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    request(url).pipe(fs.createWriteStream(filePath));
}