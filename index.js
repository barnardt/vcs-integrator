//#region Imports
const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const config = require('./config/config.js');
//#endregion

//#region Class definitions
// Constructor function for a Commit object
class Commit {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

// Constructor function for Repo object
class Repo {
  constructor(name, creationDate, lastUpdatedDate, description, commits) {
    this.name = name;
    this.creationDate = creationDate;
    this.lastUpdatedDate = lastUpdatedDate;
    this.description = description;
    this.commits = commits;
  }
}

// Constructor function for User object
class User {
  constructor(userName, bio, profilePic, repos) {
    this.userName = userName;
    this.bio = bio;
    this.profilePic = profilePic;
    this.repos = repos;
  }
}
//#endregion

//#region Utils
// Function to perform a GET request
const performGetRequest = async (url) => {
  let output;
  await fetch(url)
      .then(response => response.json())
      .then(result => {
        output = result;
      })
      .catch(err => console.log(err));
  return output;
}
//#endregion

//#region GitHub utils
// Function to GET user details from GitHub
const getUserFromGitHub = async (userName) => {
  const url = config.GITHUB_URL + userName;
  const userData = await performGetRequest(url);
  return userData;
}

// Function to get a user's repos details from GitHub
const getReposFromGitHub = async (userData) => {
  const reposUrl = userData.repos_url + '?sort=created&direction=desc';
  const reposData = await performGetRequest(reposUrl);
  return reposData;
}

// Function to get commits data for a specific repo from Github
const getCommitsFromGitHub = async (repoData) => {
  let commitsUrl = repoData.commits_url
  commitsUrl = commitsUrl.substring(0, commitsUrl.length-6);
  const commitsData = await performGetRequest(commitsUrl);
  return commitsData;
}

// Function to populate a User instance with GitHub info
const createGitHubUser = async (userName) => {
  // Get user
  const userData = await getUserFromGitHub(userName);
  if (userData.message && userData.message === 'Not Found') {
    return null;
  }
  // Create user instance
  let currentUser = new User(
    userName,
    userData.bio,
    userData.avatar_url,
    [],
  );
  // Get repos
  const reposData = await getReposFromGitHub(userData);
  const numberOfRepos = reposData.length > 5 ? 5 : reposData.length;
  for (let i = 0; i < numberOfRepos; i++) {
    const repoData = reposData[i];
    let newRepo = new Repo(
      repoData.name,
      repoData.created_at,
      repoData.updated_at,
      repoData.description,
      [],
    );
    // Get commits for this repo
    const commitsData = await getCommitsFromGitHub(repoData);

    const numberOfCommits = commitsData.length > 5 ? 5 : commitsData.length;
    for (let i = 0; i < numberOfCommits; i++) {
      let commitData = commitsData[i];
      let newCommit = new Commit(
        commitData.commit.committer.date,
        commitData.commit.message,
      );
      // Add commit objects to repo
      newRepo.commits.push(newCommit);
    }
    // Add repos to user
    currentUser.repos.push(newRepo);
  }
  // Return completed user object
  return currentUser;
}
//#endregion

//#region GitLab utils
// Function to GET user details from GitLab
const getUserFromGitLab = async (userName) => {
  const url = config.GITLAB_URL + 'users?username=' + userName;
  const userData = await performGetRequest(url);
  return userData;
}

// Function to GET a user's projects from GitLab
const getProjectsFromGitLab = async (userData) => {
  const id = userData.id;
  const url = config.GITLAB_URL + `users/${id}/projects`;
  const projectsData = await performGetRequest(url);
  return projectsData;
}

// Function to GET commits for a given project from GitLab
const getCommitsFromGitLab = async (projectData) => {
  const id = projectData.id;
  const url = config.GITLAB_URL + `projects/${id}/repository/commits`;
  const commitsData = await performGetRequest(url);
  return commitsData;
}

// Function to populate a User instance with GitHub info
const createGitLabUser = async (userName) => {
  // Get user
  const usersData = await getUserFromGitLab(userName);
  if (usersData.length === 0) {
    return null;
  }
  const userData = usersData[0];
  // Create user instance
  let currentUser = new User(
    userName,
    '[Bio not publicly available]',
    userData.avatar_url,
    [],
  );
  // Get repos
  const reposData = await getProjectsFromGitLab(userData);
  const numberOfRepos = reposData.length > 5 ? 5 : reposData.length;
  for (let i = 0; i < numberOfRepos; i++) {
    const repoData = reposData[i];
    let newRepo = new Repo(
      repoData.name,
      repoData.created_at,
      repoData.last_activity_at,
      repoData.description,
      [],
    );
    // Get commits for this repo
    const commitsData = await getCommitsFromGitLab(repoData);

    const numberOfCommits = commitsData.length > 5 ? 5 : commitsData.length;
    for (let i = 0; i < numberOfCommits; i++) {
      let commitData = commitsData[i];
      let newCommit = new Commit(
        commitData.committed_date,
        commitData.message,
      );
      // Add commit objects to repo
      newRepo.commits.push(newCommit);
    }
    // Add repos to user
    currentUser.repos.push(newRepo);
  }
  // Return completed user object
  return currentUser;
}
//#region 

//#region App
// Declare express app
const app = express();

// Use middleware
app.use(express.json());
app.use(helmet());

// Handle API request for a given username
app.get('/api', async (req, resp) => {
  const userName = req.query.username;
  const gitHubUser = await createGitHubUser(userName);
  const gitLabUser = await createGitLabUser(userName);
  resp.send(JSON.stringify(
    [gitHubUser, gitLabUser]
  ));
});

// Listen on server
app.listen(config.PORT, () => console.log('Listening engaged'));

//#endregion

