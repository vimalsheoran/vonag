#!/usr/bin/env node

const builder = require("./app_builder/builder");
const exec = require("child_process").exec;
const gitHelper = require("./app_builder/gitHelper");
const readLine = require("readline");

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

if (optArg1 == "make"){

	switch (optArg2){

		case "app":
		console.log("Setting up scaffolds...");
		builder
			.initAppStructure(paramArg)
			.then(async(appDir) => {
				console.log(
					`Generated application structure at ${appDir}`);
				return appDir;})
			.then(async(appDir) => {
				console.log("Do you want to initialize a git repo? y/n");
				let choice = readLine().toLowerCase();
				if (choice == "y" ||
					choice == "yes"){
					gitHelper
						.initGitRepo(appDir)
						.then(() => {
							console.log("Do you want to add a remote repository? y/n");
							choice = readLine().toLowerCase();
							if (choice == "y" ||
								choice == "yes"){
								console.log("Add your remote url: ");
								let url = readLine();
								gitHelper
									.addRemote(
										appDir,
										url);
								return;
							}
						})
				}
				return appDir;
			})


		break;

		case "api":
		console.log("Feature in progress, come back when it's ready");
		break;

		default:
		showHelpForMake();
		break;
	}

} else {
	showHelpForMake();
}