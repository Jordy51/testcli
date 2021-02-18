const yaml = require("js-yaml");
const yargs = require("yargs");
const fs = require("fs");
const handlebars = require("handlebars");

function nameCombiner(data, main_data, str = "") {
	if (typeof data === "object" && data !== null) {
		Object.keys(data).forEach((entries) => {
			return nameCombiner(data[entries], main_data, str + entries);
		});
	} else {
		if (!(str in main_data["data"])) {
			main_data["data"][str] = data;
		}
	}
}

yargs.command({
	command: "testcli",
	describe: "input file",
	builder: {
		i: {
			describe: "Input data file",
			demandOption: true,
			type: "string",
		},
		t: {
			describe: "Template file",
			demandOption: true,
			type: "string",
		},
	},
	handler(argv) {
		try {
			const templateData = yaml.load(fs.readFileSync(argv.i, "utf-8"));
			nameCombiner(templateData["data"], templateData);
			let compile = handlebars.compile(fs.readFileSync(argv.t, "utf-8"));
			let render = compile(templateData["data"], (compat = true));
			fs.writeFileSync("./result.yml", render, "utf-8");
		} catch (e) {
			console.log(e);
			console.log("Template Data is not correct !!");
		}
	},
});

yargs.parse();
