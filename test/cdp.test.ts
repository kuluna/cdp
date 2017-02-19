import * as assert from "assert";
import * as fs from "fs";
import Cdp from "../lib/cdp";
import { Config } from "../lib/models/config";

const cdp = new Cdp();

describe("Cdp", () => {
    beforeEach(() => {
         deleteAll(["configs.json"]);
    });
    after(() => {
        deleteAll(["configs.json"]);
    });

    it("read testjson.json", () => {
        const filePath = "test/testjson.json";
        const args = ["node", "cdp", filePath, "--in"];
        cdp.main(args);

        // check file exist
        fs.statSync(cdp.configsPath);
        // check structure
        const configs: Config[] = JSON.parse(fs.readFileSync(cdp.configsPath, "utf-8"));
        assert.ok(configs.length > 0, "but empty.");
        const config = configs[0];
        assert.equal(config.format, "json", "but wrong format.");
        assert.equal(config.path, filePath, "but wrong path.");
        assert.ok(config.body, "but empty body.");
    });

    it("write testjson.json", () => {
        // before create
        const filePath = "test/testjson.json";
        const originalPath = "test/testjson_rename.json";
        let args = ["node", "cdp", filePath, "--in"];
        cdp.main(args);
        fs.renameSync(filePath, originalPath);

        try {
            args = ["node", "cdp", "--out"];
            cdp.main(args);

            // check file exist
            fs.statSync(filePath);
            // check structure
            const original = JSON.parse(fs.readFileSync(originalPath, "utf-8"));
            const generate = JSON.parse(fs.readFileSync(originalPath, "utf-8"));
            assert.deepStrictEqual(generate, original, "but not equal body.");
        } finally {
            // undo rename
            fs.renameSync(originalPath, filePath);
        }
    });

    it("read plain text", () => {
        const filePath = "test/testtext.txt";
        const args = ["node", "cdp", filePath, "--in"];
        cdp.main(args);

        // check file exist
        fs.statSync(cdp.configsPath);
        // check structure
        const configs: Config[] = JSON.parse(fs.readFileSync(cdp.configsPath, "utf-8"));
        assert.ok(configs.length > 0, "but empty.");
        const config = configs[0];
        assert.equal(config.format, "plain", "but wrong format.");
        assert.equal(config.path, filePath, "but wrong path.");
        assert.ok(config.body, "but empty body.");
    });

    it("write plain text", () => {
        // before create
        const filePath = "test/testtext.txt";
        const originalPath = "test/testtext_rename.txt";
        let args = ["node", "cdp", filePath, "--in"];
        cdp.main(args);
        fs.renameSync(filePath, originalPath);

        try {
            args = ["node", "cdp", "--out"];
            cdp.main(args);

            // check file exist
            fs.statSync(filePath);
            // check structure
            const original = fs.readFileSync(originalPath, "utf-8");
            const generate = fs.readFileSync(originalPath, "utf-8");
            assert.deepStrictEqual(generate, original, "but not equal body.");
        } finally {
            // undo rename
            fs.renameSync(originalPath, filePath);
        }
    });
});

function deleteAll(filePaths: string[]) {
    filePaths.forEach((filePath) => {
        try { fs.unlinkSync(filePath); } catch (e) { console.log(filePath + " was already deleted."); }
    });
}
