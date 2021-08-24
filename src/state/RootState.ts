import Recoil from "recoil";

interface State {
    loading: {
        default: boolean;
        [key: string]: boolean;
    };
}

const initialState: State = {
    loading: {
        default: false,
    },
};

export const CoilReactRootState = Recoil.atom<State>({
    key: "CoilReactRootState",
    default: initialState,
});
