const inquirer = require("inquirer");

module.exports = {

	"basicGitSetupPrompt": () => {
		const question = [
			{
				name: "choice",
				type: "input",
				message: "Do you want to initialize git? y/n: ",
				validate: function (value){
					if (value.length){
						if (value.toLowerCase() == "y" ||
							value.toLowerCase() == "yes" ||
							value.toLowerCase() == "n" ||
							value.toLowerCase() == "no"){
							return true;
						}
					} else {
						return false;
					}

				}
			}
		]

		return inquirer.prompt(question);
	},

	"gitRemoteSetupPrompt": () => {
		
		const question = [{
			name: "choice",
			type: "input",
			message: "Do you want to add remote? y/n: ",
			validate: function (value){
				if (value.length){
					if (value.toLowerCase() == "y" ||
						value.toLowerCase() == "yes" ||
						value.toLowerCase() == "n" ||
						value.toLowerCase() == "no"){
						return true;
					}
				} else {
					return false;
				}

			}
		}]

		return inquirer.prompt(question);
	},

	"getGitRemoteUrl": () => {

		const question = [{
			name: "url",
			type: "input",
			message: "Enter your remote URL: ",
			validate: function (value){
				if(value.length){
					return true;
				} else {
					return false;
				}
			}
		}]

		return inquirer.prompt(question);
	}
}