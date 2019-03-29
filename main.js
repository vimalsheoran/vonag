#!/usr/bin/env node

const builder = require("./app_builder/builder");
const exec = require("child_process").exec;

// Command line helpers here

const cmdArg	=	process.argv[1] // storing the calling command name
const optArg1	=	process.argv[2] // storing first option
const optArg2	=	process.argv[3] // storing second option
const paramArg	=	process.argv[4] // storing the parameter argument

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
		const dirName = paramArg;
		console.log("Setting up scaffolds...");
		builder
			.initAppStructure(dirName)
			.then((appDir) => {
				console.log(appDir);
				console.log("Done!");
			});
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


