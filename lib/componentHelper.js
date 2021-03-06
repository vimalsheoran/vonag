const fs = require("fs");
const format = require("esformatter").format;
const execSync = require("child_process").execSync;

const generateControllerSource = async(compName) => {
	const source = `const ${compName}Model = Models["${compName}"];

		module.exports = {

		}
	`;

	return format(source);
}

const generateRouterSource = async(compName) => {
	const source = `const ${compName}Controller = require("./${compName}.controller");

		module.exports = [

		]
	`;

	return format(source);
}

const generateModelSource = async(compName) => {
	const source = `module.exports = {
			datastore: "default", // required field
			primaryKey: "id" // required field
		}
	`

	return format(source);
}

module.exports = {

	"generateComponent": async(componentDir, componentName) => {

		console.log("Generating component...");
		
		execSync(
			`mkdir ${componentDir}`);
		
		const filePath = componentDir+"/"+componentName;

		const controllerSource = await generateControllerSource(
			componentName);
		const routerSource = await generateRouterSource(
			componentName);
		const modelSource = await generateModelSource(
			componentName);

		fs.writeFileSync(
			`${filePath}.controller.js`,
			controllerSource,
			"utf-8");

		fs.writeFileSync(
			`${filePath}.routes.js`,
			routerSource,
			"utf-8");

		fs.writeFileSync(
			`${filePath}.models.js`,
			modelSource,
			"utf-8");

		console.log(`Generated ${componentName}!`);

	}
}