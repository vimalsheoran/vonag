const exec = require("await-exec");

let vonagDir;

const initAppStructure = async(parentDirName) => {


	await exec(
		`mkdir ${parentDirName} && 
		cd ${parentDirName} &&
		mkdir components &&
		mkdir helpers &&
		mkdir tests &&
		mkdir settings &&
		touch app.js`, 
		{encoding: "utf-8"}
	);
	
	return process.cwd() + `/${parentDirName}`;
}

module.exports = {
	"initAppStructure": initAppStructure,
	"vonagDir": vonagDir
}