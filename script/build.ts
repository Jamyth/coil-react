import chalk from "chalk";
import {spawnSync} from "child_process";
import yargs from "yargs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const {version} = require("../package.json");

function spawn(command: string, args: string[], errorMessage: string) {
    const isWindows = process.platform === "win32";
    const result = spawnSync(isWindows ? command + ".cmd" : command, args, {stdio: "inherit"});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(chalk`{red.bold ${errorMessage}}`);
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(" ")}`);
        process.exit(1);
    }
}

function checkCodeStyle() {
    console.info(chalk`{green.bold [task]} {white.bold check code style}`);
    return spawn("prettier", ["--config", "config/prettier.json", "--list-different", "{src,test}/**/*.{ts,tsx}"], "check code style failed, please format above files");
}

function lint() {
    console.info(chalk`{green.bold [task]} {white.bold lint}`);
    return spawn("eslint", ["{src,test}/**/*.{ts,tsx}"], "lint failed, please fix");
}

function cleanup() {
    console.info(chalk`{green.bold [task]} {white.bold cleanup}`);
    return spawn("rm", ["-rf", "./dist"], "cannot remove dist folder");
}

function compile() {
    console.info(chalk`{green.bold [task]} {white.bold compile}`);
    return spawn("tsc", ["-p", "config/tsconfig.src.json"], "compile failed, please fix");
}

function build() {
    const isFastMode = "mode" in yargs.argv && yargs.argv.mode === "fast";

    if (!isFastMode) {
        checkCodeStyle();
        lint();
    }

    cleanup();
    compile();
}

build();
