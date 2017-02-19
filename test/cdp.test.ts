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

    it("--in --gitignore", () => {
        fs.renameSync(".gitignore", ".gitignore.rename");

        try {
            const filePath = "test/testjson.json";
            cdp.main(generateArgs("--in", ["--gitignore"], [filePath]));

            // found
            const ignores = fs.readFileSync(".gitignore", "utf-8").split(/\r?\n/);
            const found = ignores.filter((ignore) => ignore === filePath).length > 0;
            assert.equal(found, true, "but not added .gitignore.");
        } finally {
            fs.renameSync(".gitignore.rename", ".gitignore");
        }
    });

    it ("--in --afterdelete", () => {
        const filePath = "test/testjson.json";
        const originalPath = "test/testjson_rename.json";
        fs.renameSync(filePath, originalPath);

        try {
            cdp.main(generateArgs("--in", ["--afterdelete"], [filePath]));

            // file deleted
            fs.statSync(filePath);
            assert.ok(false, "but file not delete.");
        } catch (e) {
            // correct file not found
            assert.ok(true);
        } finally {
            fs.renameSync(originalPath, filePath);
        }
    });
});

function generateArgs(mode: string, options: string[], files: string[]): string[] {
    return ["node", "cdp", mode].concat(options).concat(files);
}

function deleteAll(filePaths: string[]) {
    filePaths.forEach((filePath) => {
        try { fs.unlinkSync(filePath); } catch (e) { console.log(filePath + " was already deleted."); }
    });
}
