const exec = require("await-exec");

const initGitRepo = async (appDir) => {
	await exec(
		`cd ${appDir} &&
		 git init && 
		 touch .gitignore`);
	return;
}

const addRemote = async (appDir, url) => {
	await exec(
		`cd ${appDir} &&
		 git remote add origin ${url} &&
		 git remote -v`);
	return;
}

module.exports = {
	"initGitRepo": initGitRepo,
	"addRemote": addRemote
}