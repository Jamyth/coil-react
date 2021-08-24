import React from "react";
import Recoil from "recoil";

export let getLoadable: <T>(recoilValue: Recoil.RecoilValue<T>) => Recoil.Loadable<T> = null as any;

export let set: <T>(value: Recoil.RecoilState<T>, valOrUpdator: ((val: T) => T) | T) => void = null as any;

export const RecoilLoader = React.memo(() => {
    Recoil.useRecoilTransactionObserver_UNSTABLE(({snapshot}) => {
        getLoadable = snapshot.getLoadable;
    });

    Recoil.useRecoilCallback(({set: recoilSet}) => {
        set = recoilSet;
        return () => {};
    })();

    return null;
});
