"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const child_process_1 = require("child_process");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");
function spawn(command, args, errorMessage) {
    const isWindows = process.platform === "win32";
    const result = child_process_1.spawnSync(isWindows ? command + ".cmd" : command, args, { stdio: "inherit" });
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(chalk_1.default `{red.bold ${errorMessage}}`);
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(" ")}`);
        process.exit(1);
    }
}
function checkCodeStyle() {
    console.info(chalk_1.default `{green.bold [task]} {white.bold check code style}`);
    return spawn("prettier", ["--config", "config/prettier.json", "--list-different", "{src,test}/**/*.{ts,tsx}"], "check code style failed, please format above files");
}
function lint() {
    console.info(chalk_1.default `{green.bold [task]} {white.bold lint}`);
    return spawn("eslint", ["{src,test}/**/*.{ts,tsx}"], "lint failed, please fix");
}
function cleanup() {
    console.info(chalk_1.default `{green.bold [task]} {white.bold cleanup}`);
    return spawn("rm", ["-rf", "./dist"], "cannot remove dist folder");
}
function compile() {
    console.info(chalk_1.default `{green.bold [task]} {white.bold compile}`);
    return spawn("tsc", ["-p", "config/tsconfig.json"], "compile failed, please fix");
}
function commit() {
    console.info(chalk_1.default `{green.bold [task]} {white.bold commit to git}`);
    spawn("git", ["add", "."], "cannot add changes to git tree");
    return spawn("git", ["commit", "-m", `[SYSTEM]: ${version}: build package`], "cannot commit changes");
}
function push() {
    console.info(chalk_1.default `{green.bold [task]} {white.bold push to github}`);
    spawn("git", ["pull", "--rebase", "--autostash"], "cannot pull changes from upstream");
    return spawn("git", ["push", "-u", "origin", "master"], "cannot push to github");
}
function build() {
    const isFastMode = yargs_1.default.argv.mode === "fast";
    if (!isFastMode) {
        checkCodeStyle();
        lint();
    }
    cleanup();
    compile();
    commit();
    push();
}
build();
//# sourceMappingURL=build.js.map