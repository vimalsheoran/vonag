const exec = require("child_process").exec;
const fs = require("fs");

let packageConfig = {
	"name": "",
	"version": "",
	"description": "",
	"main": "", // entrypoint
	"scripts": {
		"test": "", // test command
	},
	"author": "",
	"license": "",
	"keywords": [],
	"vonagApp": "true"
};

module.exports = {

	"initPackage": async(appName, appDir, usrConfigs) => {
		usrConfigs["name"] = appName;
		usrConfigs["main"] = "app.js";
		let package = {
			...packageConfig, 
			...usrConfigs
		};
		try {
			await fs.writeFile(
				`${appDir}/package.json`, 
				JSON.stringify(package), 
				"utf8", function (err){
					if(err){
						throw err;
					}
					return;
				});
		} catch (err){
			console.log(err);
			console.log("Unable to create package.json!");
		}
	},

	"installVonagDependencies": async(appDir) => {
		exec(
			`cd ${appDir} &&
			npm install &&
			npm install fastify`);
		return;
	},

	"installUserDependencies": async(appDir, depList) => {
		
		for(let dep of depList){
			await exec(
				`cd ${appDir} && npm install ${dep} --save`, 
				function(err, stdout, stderr){
					console.log(stderr);
				});
		}
		return;
	}
}