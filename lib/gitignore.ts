import * as fs from "fs";
import { EOL } from "os";
import * as path from "path";

export class GitIgnore {
    private ignorePath = ".gitignore";

    constructor() {
        // create configs.json if exists
        try {
            fs.statSync(this.ignorePath);
        } catch (e) {
            fs.writeFileSync(this.ignorePath, "",  { encoding: "utf-8" });
        }
    }

    public merge(addIgnores: string[]) {
        // read .gitignore
        let ignores = fs.readFileSync(this.ignorePath, "utf-8").split(/\r?\n/);
        // merge
        addIgnores.forEach((i) => {
            const filePath = path.normalize(i).split(path.sep).join("/");
            if (ignores.filter((ignore) => ignore === filePath).length === 0) {
                ignores.push(filePath);
            }
        });
        // write .gitignore
        fs.writeFileSync(this.ignorePath, ignores.join(EOL), { encoding: "utf-8" });
    }
}
