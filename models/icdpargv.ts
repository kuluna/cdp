import parseArgs = require("minimist");

export interface ICdpArgv extends parseArgs.ParsedArgs {
    in: boolean;
    out: boolean;
}
