const exec = require("child_process").exec;

const initGitRepo = (appDir) => {
	exec(
		`cd ${appDir} &&
		 git init && 
		 touch .gitignore`);
	return;
}

const addRemote = (appDir, url) => {
	exec(
		`cd ${appDir} &&
		 git remote add origin ${url} &&
		 git remote -v`);
	return;
}

module.exports = {
	"initGitRepo": initGitRepo
}