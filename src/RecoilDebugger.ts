import {useEffect} from "react";
import type {Loadable, RecoilValue} from "recoil";
import {useRecoilSnapshot} from "recoil";
import type {Action as ReduxAction, Reducer as ReduxReducer, Store as ReduxStore} from "redux";
import {createStore} from "redux";

/**
 * A recoil observer component that dispatches an action containing the recoil state update
 * event to a dummy redux store, such that the recoil state to mirrored to redux store,
 * and can be viewed inside redux devtools extension during debugging. However,
 * time traveling / other redux devtools feature does not work.
 *
 * Mount this just below <RecoilRoot /> to get it working.
 */
let RecoilDebugObserver = () => null;

type State = {[recoilKey: string]: any};
type PayloadAction = ReduxAction & {
    payload: {node: RecoilValue<unknown>; loadable: Loadable<unknown>};
};
type Reducer = ReduxReducer<State, PayloadAction>;
type Store = ReduxStore<State, PayloadAction>;

const reduxDevtoolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

if (process.env.NODE_ENV !== "production" && reduxDevtoolsExtension) {
    const reducer: Reducer = (state = {}, {type, payload}) => {
        if (String(type).startsWith("[recoil]")) {
            return {...state, [payload.node.key]: payload.loadable};
        } else {
            return state;
        }
    };

    const store: Store = createStore(
        reducer,
        reduxDevtoolsExtension({
            name: "recoil debug observer",
            maxAge: 100,
        })
    );

    RecoilDebugObserver = () => {
        const snapshot = useRecoilSnapshot();
        useEffect(() => {
            for (const node of snapshot.getNodes_UNSTABLE({isModified: true})) {
                const loadable: Loadable<unknown> = snapshot.getLoadable(node);
                const action: PayloadAction = {
                    type: `[recoil] ${node.key}/${loadable.state}`,
                    payload: {node, loadable},
                };
                (store as Store).dispatch(action);
            }
        }, [snapshot]);
        return null;
    };
}

export {RecoilDebugObserver};
