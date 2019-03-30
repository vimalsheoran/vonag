#!/usr/bin/env node

const builder = require("./lib/builder");
const exec = require("await-exec");
const fs = require("fs");
const gitHelper = require("./lib/gitHelper");
const menu = require("./lib/menu");
const packageHelper = require("./lib/packageHelper");

// Command line helpers here

const cmdArg	=	process.argv[1] // storing the calling command name
const optArg1	=	process.argv[2] // storing first option
const optArg2	=	process.argv[3] // storing second option
const paramArg	=	process.argv[4] // storing the parameter argument
let appDir; // store the location of the directory where the app is initialised

const showHelpForMake = () => {
	console.log("Usage: ");
	console.log("$ vonag make app <application name>");
}

if (!cmdArg.includes("vonag")){
	console.log("No tempering allowed.");
	process.exit(0);
}

if (optArg1 == "--help" ||
	optArg1 == "-h"){
	showHelpForMake();
	process.exit(0);
}

const run = async (optArg1, optArg2) => {

	if (optArg1 == "make"){

		switch (optArg2){

			case "app":
			if (!paramArg ||
				paramArg == ""){
				showHelpForMake();
				break;
			}
			console.log("Setting up scaffolds...");
			let appDir = await builder
				.initAppStructure(paramArg);
			console.log(`Generated application at ${appDir}`);

			let initGit = await menu.basicGitSetupPrompt();

			if (initGit.choice.toLowerCase() == "y" ||
				initGit.choice.toLowerCase() == "yes"){
				await gitHelper
					.initGitRepo(appDir);
				console.log("Successfully initialised a git repository!");

				let setGitRemote = await menu.gitRemoteSetupPrompt();

				if (setGitRemote.choice.toLowerCase() == "y" ||
					setGitRemote.choice.toLowerCase() == "yes"){
					let remoteUrl = await menu.getGitRemoteUrl();
					await gitHelper
						.addRemote(appDir, remoteUrl.url);				
				} else {
					console.log("Skipping...");
				}
			} else {
				console.log("Skipping...");
			}

			console.log("Entering package setup...");
			let packageOpts = await menu.packageInitOptions();
			if (packageOpts["keywords"] == ""){
				packageOpts["keywords"] = [];
			} else {
				let sanatizedKeywords = packageOpts["keywords"]
					.split(" ");
				packageOpts["keywords"] = sanatizedKeywords;

			}

			await packageHelper
				.initPackage(paramArg, appDir, packageOpts);

			console.log("Created package.json!");
			await packageHelper
				.installVonagDependencies(appDir);

			let userDeps = await menu.userDependenciesList();

			let val = await packageHelper
				.installUserDependencies(
					appDir,
					userDeps.dependencies.split(" "));
			break;

			case "component":
			
			if (!paramArg ||
				paramArg == ""){
				showHelpForMake();
				break;
			}

			try {
				
				let unparsedMeta = fs
					.readFileSync("package.json");
				let appMeta = JSON.parse(unparsedMeta);

				if (!appMeta["vonagApp"] ||
					!(appMeta["vonagApp"] == "true"))
					throw new Error();

				let componentDir = process.cwd() + "/components/" + `${paramArg}`;

				await exec(
					`mkdir ${componentDir} &&
					cd ${componentDir} &&
					touch ${paramArg}.controller.js &&
					touch ${paramArg}.routes.js &&
					touch ${paramArg}.models.js`);

			} catch(err){
				console.log("Invalid operation, Not inside a vonag application");
				break;
			}

			break;

			default:
			showHelpForMake();
			break;
		}
		
		return;

	} else {
		showHelpForMake();
		return;
	}
}

run(optArg1, optArg2);
