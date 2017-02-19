import * as fs from "fs";
import * as parseArgs from "minimist";
import { EOL } from "os";
import * as path from "path";
import { GitIgnore } from "./gitignore";
import { Config } from "./models/config";
import { ICdpArgv } from "./models/icdpargv";

export default class Cdp {
    public configsPath = "configs.json";

    public main(args: string[]) {
        // parse argments
        const argv = parseArgs(args.slice(2), { boolean: true }) as ICdpArgv;

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

            argv._.forEach((arg) => {
                const filePath = path.normalize(arg).split(path.sep).join("/");
                // read file
                let body: any = fs.readFileSync(filePath, "utf-8");
                let format = "plain";

                try {
                    // try parse JSON
                    body = JSON.parse(body);
                    format = "json";
                } catch (e) {
                    // split new line if plain
                    body = body.split(/\r?\n/);
                }

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

            // gitignore option
            if (argv.gitignore) {
                new GitIgnore().merge(argv._);
            }

            // after delete option
            if (argv.afterdelete) {
                argv._.forEach((filePath) => { try { fs.unlinkSync(filePath); } catch (e) { console.log(filePath + " was already deleted."); }} );
            }

        // out process
        } else if (argv.out) {
            const configs: Config[] = JSON.parse(fs.readFileSync(this.configsPath, "utf-8"));

            configs.forEach((config) => {
                switch (config.format) {
                    case "plain":
                        fs.writeFileSync(config.path, config.body.join(EOL), {encoding: "utf-8"});
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
            console.log("mode:");
            console.log("--in [--afterdelete] [--gitignore] [filePath] Checkin for configs.json.");
            console.log("  --afterdelete                               Delete files after checkin.");
            console.log("  --gitignore                                 Add files to gitignore.");
            console.log("--out                                         Checkout from configs.json.");
        }
    }
}
