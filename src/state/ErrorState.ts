import Recoil from "recoil";
import type {Exception} from "../util/Exception";

export const ErrorState = Recoil.atom<Exception | null>({
    key: "CoilReactErrorState",
    default: null,
});
