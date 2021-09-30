import Recoil from "recoil";

interface State {
    isPrevented: boolean;
}

const initialState: State = {
    isPrevented: false,
};

export const NavigationPreventState = Recoil.atom<State>({
    key: "NavigationPreventState",
    default: initialState,
});
