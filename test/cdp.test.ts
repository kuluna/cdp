import * as assert from "assert";
import * as fs from "fs";
import Cdp from "../cdp";
import { Config } from "../models/config";

const cdp = new Cdp();

describe("Cdp", () => {
    beforeEach(() => {
         try { fs.unlinkSync("configs.json"); } catch (e) { console.log("configs.json was already deleted."); }
    });

    it("read testjson.json", () => {
        const args = ["node", "cdp", "test/testjson.json", "--in"];
        cdp.main(args);

        // check file exist
        fs.statSync("configs.json");
        // check structure
        const configs: Config[] = JSON.parse(fs.readFileSync(cdp.configsPath, "utf-8"));
        assert.ok(configs.length > 0, "but empty.");
        const config = configs[0];
        assert.equal(config.format, "json", "but wrong format.");
        assert.equal(config.path, "test/testjson.json", "but wrong path.");
        assert.ok(config.body, "but empty body.");
    });

    it("write testjson.json", () => {
        // before create
        let args = ["node", "cdp", "test/testjson.json", "--in"];
        cdp.main(args);
        fs.renameSync("test/testjson.json", "test/testjson_rename.json");

        try {
            args = ["node", "cdp", "--out"];
            cdp.main(args);

            // check file exist
            fs.statSync("test/testjson.json");
            // check structure
            const original = JSON.parse(fs.readFileSync("test/testjson_rename.json", "utf-8"));
            const generate = JSON.parse(fs.readFileSync("test/testjson.json", "utf-8"));
            assert.deepStrictEqual(generate, original, "but not equal body.");
        } finally {
            // undo rename
            fs.renameSync("test/testjson_rename.json", "test/testjson.json");
        }
    });
});
