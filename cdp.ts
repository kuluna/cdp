import * as fs from "fs";
import * as parseArgs from "minimist";
import { Config } from "./models/config";
import { ICdpArgv } from "./models/icdpargv";

export default class Cdp {
    public configsPath = "configs.json";

    public main(args: string[]) {
        // parse argments
        const argv = parseArgs(args.slice(2)) as ICdpArgv;

        // in process
        if (argv.in && argv._.length > 0) {
            // create configs.json if exists
            try {
                fs.statSync(this.configsPath);
            } catch (e) {
                fs.writeFileSync(this.configsPath, "[]",  { encoding: "utf-8" });
            }
            // read config.json
            const configs: Config[] = JSON.parse(fs.readFileSync(this.configsPath, "utf-8"));

            argv._.forEach((filePath) => {
                // read file
                let body: any = fs.readFileSync(filePath, "utf-8");
                let format = "plain";

                // try parse JSON
                try {
                    body = JSON.parse(body);
                    format = "json";
                } catch (e) {}

                // join configs.json
                const config = new Config(filePath, format, body);
                const find = configs.map((value, index) => {
                    return { i: index, v: value };
                }).filter((m) => m.v.path === config.path);
                if (find.length > 0) {
                    // update config
                    configs[find[0].i] = config;
                } else {
                    // insert config
                    configs.push(config);
                }
            });

            // write configs.json
            fs.writeFileSync(this.configsPath, JSON.stringify(configs, null, 2), { encoding: "utf-8" });

        // out process
        } else if (argv.out) {
            const configs: Config[] = JSON.parse(fs.readFileSync(this.configsPath, "utf-8"));

            configs.forEach((config) => {
                switch (config.format) {
                    case "plain":
                        fs.writeFileSync(config.path, config.body, {encoding: "utf-8"});
                        break;
                    case "json":
                        fs.writeFileSync(config.path, JSON.stringify(config.body, null, 2), {encoding: "utf-8"});
                        break;
                    default:
                        break;
                }
            });

        } else {
            // show cdp Help
            console.log("Usage: cdp mode\n");
            console.log("mode");
            console.log("[filePath] --in checkin for configs.json");
            console.log("--out checkout from configs.json");
        }
    }
}

// entry point
new Cdp().main(process.argv);
