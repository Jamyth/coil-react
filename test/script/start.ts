import {WebpackRunner} from "@iamyth/webpack-runner";
import path from "path";

new WebpackRunner({
    port: 8080,
    projectDirectory: path.join(__dirname, ".."),
}).run();
