import parseArgs = require("minimist");

export interface ICdpArgv extends parseArgs.ParsedArgs {
    in: boolean;
    gitignore: boolean;
    afterdelete: boolean;

    out: boolean;
}
