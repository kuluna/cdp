import * as fs from "fs";

class Config {
    constructor(public path: string, public format: string, public body: any) {}
}

// var configs = fs.readFileSync("configs.json", "utf-8");
// console.log(configs);

if (process.argv[2] === "-i" && process.argv[3]) { // in process
    const filePath = process.argv[3];
    // read file
    let body = fs.readFileSync(filePath, "utf-8");
    let format = "plain";

    // try parse JSON
    try {
        body = JSON.parse(body);
        format = "json";
    } catch (e) {}

    // read config.json
    try {
        fs.statSync("configs.json");
    } catch (e) {
        fs.writeFileSync("configs.json", "[]",  { encoding: "utf-8" });
    }

    const configs: Config[] = JSON.parse(fs.readFileSync("configs.json", "utf-8"));
    // join configs.json
    const config = new Config(filePath, format, body);
    const find = configs.map((value, index) => {
        return { i: index, v: value };
    }).filter((m) => m.v.path === config.path);
    if (find.length > 0) {
        // update config
        configs[find[0].i] = config;
    } else {
        configs.push(config);
    }
    // write configs.json
    fs.writeFileSync("configs.json", JSON.stringify(configs, null, 2), { encoding: "utf-8" });

} else if (process.argv[2] === "-o") { // out process
    const configs: Config[] = JSON.parse(fs.readFileSync("configs.json", "utf-8"));

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
    console.log("cdp mode path");
    console.log("mode");
    console.log("-i checkin configs.json");
    console.log("-o checkout configs.json");
}
