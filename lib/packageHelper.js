const exec = require("await-exec");
const fs = require("fs");
const format = require("esformatter").format;

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

const generateRouteSettings = async(appDir) => {
	const source = `
		const fs = require("fs");
		const componentPath = "${appDir}/components";

		module.exports = {

			"getAllRoutesMeta": async() => {
				let allRouteMeta = [];
				let components = fs
					.readdirSync(componentPath);
				for(let component of components){
					let componentRouteMeta = require(
						\`\$\{componentPath\}/\$\{component\}/\$\{component\}.routes\`);
					allRouteMeta = allRouteMeta
						.concat(componentRouteMeta);
				}
				return allRouteMeta;
			}

		}
	`;

	return format(source);
}

const generateAppJs = async() => {
	const source = `const express = require("express");
	const app = express();
	const router = express.Router();
	const getAllRoutesMeta = require('./settings/routesHandler')
	  .getAllRoutesMeta;
	const modelsHandler = require("./settings/modelHandler");
	const waterline = require("./settings/modelHandler").waterline;
	const Config = require("./settings/modelConfig");
	const util = require("util");

	const initializeWaterline = util.promisify(
	  waterline.initialize);

	const start = async () => {

	  let models = await modelsHandler.registerAllModels();
	  global.Models = (await initializeWaterline(Config)).collections;
	  const routes = await getAllRoutesMeta();

	  routes.forEach((route) => {
	    let method = (route.method).toLowerCase();
	    router[method](route.url, route.handler);
	  });

	  try {
	    await app.use(router);
	    app.listen(3000, function(){
	      console.log("Awesome");
	    });
	  } catch (err) {
	    console.log(err);
	    process.exit(1)
	  }
	}

	start();
	`;

	return format(source);
}

const generateModelHandler = async(appDir) => {
	const source = `const Config = require("./modelConfig");
		const fs = require("fs");
		const Waterline = require("waterline");

		const waterline = new Waterline();
		const componentPath = "${appDir}/components";

		const allComponents = fs.readdirSync(componentPath);

		module.exports = {

			"registerAllModels": async() => {
				let modelList = [];
				for (let component of allComponents) {
					let attrSet = require(
						\`\$\{componentPath\}/\$\{component\}/\$\{component\}.models\`);
					attrSet["identity"] = component;
					let collection = Waterline.Collection
						.extend(attrSet);
					modelList.push(component);
					await waterline.registerModel(collection);
				}
				
				return modelList;
			},

			"waterline": waterline
		};
	`;

	return format(source);
}

const generateDefaultModelConfigs = async () => {
	const source = `let sailsDiskAdapter = require("sails-disk");

		module.exports = {
			adapters: {
				"disk": sailsDiskAdapter
			},

			datastores: {
				default: {
					adapter: "disk"
				}
			}
		};
	`;

	return format(source);
}



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
		console.log("Installing vonag dependencies...")
		await exec(
			`cd ${appDir} &&
			npm install &&
			npm install fastify waterline sails-disk`);
		return;
	},

	"installUserDependencies": async(appDir, depList) => {
		console.log("Installing your dependencies...");
		if (depList != undefined ||
			depList != "" ||
			depList.length != 0){
			for(let dep of depList){
				await exec(
					`cd ${appDir} && npm install ${dep} --save`, 
					function(err, stdout, stderr){
						console.log(stderr);
					});
			}
		}
		console.log("Done!");
		return;
	},

	"generateApp": async(appDir) => {
		console.log("Generating application and settings...")
		const routesHandlerPath = `${appDir}/settings/routesHandler.js`;
		const appFilePath = `${appDir}/app.js`;

		const routesHandlerSource = await generateRouteSettings(
			appDir);
		const appJsSource = await generateAppJs();
		const modelsHandlerSource = await generateModelHandler(
			appDir);
		const defaultModelConfigs = await generateDefaultModelConfigs();

		fs.writeFileSync(
			`${appDir}/settings/routesHandler.js`,
			routesHandlerSource,
			"utf-8");

		fs.writeFileSync(
			`${appDir}/app.js`,
			appJsSource,
			"utf-8");

		fs.writeFileSync(
			`${appDir}/settings/modelHandler.js`,
			modelsHandlerSource,
			"utf-8");

		fs.writeFileSync(
			`${appDir}/settings/modelConfig.js`,
			defaultModelConfigs,
			"utf-8");

		console.log("Done!");
	}
}