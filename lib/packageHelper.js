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
	const source = `
		const fastify = require('fastify')({
		    logger: true
		});
		const getAllRoutesMeta = require('./settings/routesHandler')
		    .getAllRoutesMeta;

		const start = async () => {

		    const routes = await getAllRoutesMeta();

		    routes.forEach((route, index) => {
		        fastify.route(route)
		    });

		    try {
		        await fastify.listen(3000)
		        fastify.log.info(\`Server listening on \$\{fastify.server.address().port\}\`)
		    } catch (err) {
		        fastify.log.error(err)
		        process.exit(1)
		    }
		}

		start();
	`;

	return format(source);
}

const generateModelHandler = async(appDir) => {
	const source = `
		const Config = require("./modelConfig");
		const fs = require("fs");
		const Waterline = require("waterline");

		const waterline = new Waterline();
		const componentPath = "${appDir}/components";

		const allComponents = fs.readdirSync(componentPath);

		global let Models = {};

		module.exports = {
			
			"registerAllModels": async() => {
				let modelList = [];
				for(let component of allComponents){
					let collection = require(
						\`\$\{componentPath\}/\$\{component\}/\$\{component\}.models\`);
					collection["identity"] = component;
					modelList.push(component);
					await waterline.registerModel(collection);
				}
				return modelList;
			}

			"initializeWaterline": async (modelList) => {
				await waterline.initialize(config, (err, ontology) => {
					for(let model of modelList){
						Models[\`\$\{model\}\`] = ontology
							.collections[\`\$\{model\}\`];
					}
				});
			}
		}
	`;

	return format(source);
}

const generateDefaultModelConfigs = async () => {
	const source = `
		let sailsDiskAdapter = require("sails-disk");

		module.exports = {
			adapters: {
				"disk": sailsDiskAdapter
			},

			datastores: {
				default: {
					adapter: "disk"
				}
			}
		}
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