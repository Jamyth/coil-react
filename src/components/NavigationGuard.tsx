import React from "react";
import {Prompt} from "react-router";
import Recoil from "recoil";
import {NavigationPreventState} from "../state/NavigationPreventState";

interface Props {
    preventMessage: string;
}

export const NavigationGuard = React.memo(({preventMessage}: Props) => {
    const {isPrevented} = Recoil.useRecoilValue(NavigationPreventState);

    React.useEffect(() => {
        window.onbeforeunload = isPrevented ? () => preventMessage : null;
    }, [isPrevented, preventMessage]);

    return <Prompt message={preventMessage} when={isPrevented} />;
});
