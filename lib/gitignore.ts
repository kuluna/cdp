import * as fs from "fs";
import { EOL } from "os";
import * as path from "path";

export class GitIgnore {
    constructor() {
        // create configs.json if exists
        try {
            fs.statSync(".gitignore");
        } catch (e) {
            fs.writeFileSync(".gitignore", "",  { encoding: "utf-8" });
        }
    }

    public merge(addIgnores: string[]) {
        // read .gitignore
        let ignores = fs.readFileSync(".gitignore", "utf-8").split(/\r?\n/);
        // merge
        addIgnores.forEach((i) => {
            const filePath = path.normalize(i).split(path.sep).join("/");
            if (ignores.filter((ignore) => ignore === filePath).length === 0) {
                ignores.push(filePath);
            }
        });
        // write .gitignore
        fs.writeFileSync(".gitignore", ignores.join(EOL), { encoding: "utf-8" });
    }
}
