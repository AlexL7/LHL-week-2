'use strict';

const repoOwnerData = process.argv;

let http =  require('http');
let fs = require('fs');

let dir = './avatars';
//repos/:owner/:repo/contributors

let request = require('request');



function githubRequest(endpoint, callback){
  const githubRoot = "https://api.github.com";

   let requestData = {
    url: `${githubRoot}${endpoint}`,
    auth: {
      bearer: '2533ca353fc15a6fef11a0aecf34efbc007b6de3'
    },
    headers: {
      'User-Agent': 'request' // Github requires a user agent header. You can put anything here.
    }
  };
  request.get(requestData, callback);
}

function getGithubContributors(owner, username, callback){
  githubRequest(`/repos/${owner}/${username}/contributors`,callback);
}

const  githubOwner = process.argv[2];
const  githubUsername = process.argv[3];

console.log(`Getting ${githubUsername} contributors.\n`);

getGithubContributors(githubOwner,githubUsername,function(error, response, body){
  if(error){
    console.log("Wrong: ", error);
    return;
  }
  const contributors = JSON.parse(body);

  console.log("Starting to download files....")

  contributors.forEach(function(account){
      downloadImagesByURL(account.avatar_url,`./avatars/${account.login}`);
      });
  });


function downloadImagesByURL(url,filePath){
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  request(url).pipe(fs.createWriteStream(filePath));
};




