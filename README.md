# **Coil React**

A React Framework with build in routing service and state management.

## **Why Coil React** ?

In the past, when we are dealing with state management, the first thing comes to mind is `Redux`, perhaps it is a great tool when there is a large project, but it becomes an overkill to relatively small project, and it has quite `steep` learning curve, where you need to understand how a state is manipulated, what `reducer`, `action`, `store` are, and furthermore there are `thunk` and `saga`.

Why don't we use `Context API` from vanilla `React`? Yes, it is a great tool when splitting a large state into small, but it will end up with tones of `Context.Provider` or `Context.Consumer` somewhere in your outermost component.

That's why `Recoil.js` comes into play. With its easy-to-learn API and hooks, building small and strong state management application is not a problem anymore.

However, with the flexibility created by `React` and `Recoil`, thinking about the folder structure is another nightmare too, also, installing libraries like `react-router-dom` and other `core` libraries will make your `package.json` ugly.

Finally, `Coil-React` suggested a way in dealing with all problems mentioned above.

## **Feature**

### **Dynamic State Injection**

With `Dynamic State Injection`, we can see what part of state is relative to the current module we are doing. Also, we can split the state from a large piece of thing into small to achieve `separation of concern`.

### **Code Splitting**

`React` provided an API to `lazy-load` our components and provide a fallback UI, but currently it only supports `default export`, and we think that it is not good in `Developer Experience (DX)`, so we provided an function **`async()`** to support `named export`.

### **Clean Component**

In vanilla `React`, when we need to fetch data from the Internet, we need to have an `ajax` call in `React.useEffect` or `ComponentDidMount`. However, we think that this will somehow `pollute` the component because we will have our fetching function in the component, and a component should only be responsible to `display` the `UI`.

To make your component cleaner, we wrapped your module component with a function `injectLifeCycle`, where it will call your `didMount` and `didUpdate` function, while your actual component remain the same.

Besides, with combination of `React Hooks` and `Recoil`, we can declare an `action` or `state updater` outside `React Component`, which will make the component much cleaner.

## **Featuring Package Included**

-   React
-   React-Router-DOM
-   Recoil
-   Axios

## **Installation**

```bash
$ npm install coil-react
or
$ yarn add coil-react
```

## **Project Structure (Suggested)**

```
+ My Awesome Project
|   +- src
|   |   +- component (your re-usable components)
|   |   +- module (Page As Module)
|   |   |   +- your-module
|   |   |   |   +- Main (Component Folder)
|   |   |   |   |   +- index.tsx
|   |   |   |   +- type.ts (Module Typing)
|   |   |   |   +- index.ts (State & Action creator)
|   |   |   |   +- hooks.ts (Module related hooks)
|   |   +- util
|   |   +- index.ts
|   +- package.json
```

## **Usage**

> To Start using `coil-react`, in your entry js/ts file, namely `index.js`
>
> Import the followings:

**`MyAwesomeProject/src/index.ts`**

```ts
// Before
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(<App />, document.getElementById("my-app"));

// Now
import {startApp} from "coil-react";
import {useToast} from "@chakra-ui/react";
// We will cover that later
import {MainComponent as App} from "module/myFirstModule";

const useGlobalErrorHandler = () => {
    // You use other libraries' hooks here
    const toast = useToast();

    return (error: any) => {
        // Error Handler
        if (error instanceof Error) {
            toast({
                title: "Error Occurred",
            });
        }
    };
};

startApp({
    MainComponent: App,
    entryElement: document.getElementById("my-app"),
    // This could catch unhandledPromiseRejection and Error thrown.
    useError: useGlobalErrorHandler,
});
```

### **Creating your first module**

If you find yourself repeating the same action of creating new module, why don't you try using [`Coil React CLI`](https://github.com/Jamyth/coil-react-cli)

We are going to create a simple page which will have a click counter.

**`MyAwesomeProject/src/module/myFirstModule/type.ts`**

```ts
export interface State {
    count: number;
}
```

**`MyAwesomeProject/src/module/myFirstModule/index.ts`**

```ts
import Recoil from "recoil";
import {injectLifeCycle, useCoilState} from "coil-react";
import type {State} from "./type";
import {Main} from "./Main";

const initialState: State = {
    count: 0,
};

export const MyFirstModuleState = Recoil.atom({
    key: "MyFirstModuleState",
    default: initialState,
});

export const useMyFirstModuleAction = () => {
    const {getState, setState} = useCoilState(MyFirstModuleState);

    const add = () => {
        setState((state) => (state.count += 1));
    };

    return {
        add,
    };
};

export const MainComponent = injectLifeCycle(Main, useMyFirstModuleAction);
```

**`MyAwesomeProject/src/module/myFirstModule/hooks.ts`**

```ts
import Recoil from "recoil";
import {MyFirstModuleState} from "module/myFirstModule";
import type {State} from "./type";

export const useMyFirstModuleState = <T>(fn: (state: State) => T): T => {
    const state = Recoil.useRecoilValue(MyFirstModuleState);
    return fn(state);
};
```

**`MyAwesomeProject/src/module/myFirstModule/Main/index.tsx`**

```tsx
import React from "react";
import {useMyFirstModuleState} from "module/myFirstModule/hooks";
import {useMyFirstModuleAction} from "module/myFirstModule";

export const Main = React.memo(() => {
    const count = useMyFirstModuleState((state) => state.count);

    const {add} = useMyFirstModuleAction();

    return (
        <div>
            <span>count: {count}</span>
            <button onClick={add}>Add</button>
        </div>
    );
});
```

### **Take a step further to lifecycle and History API**

What if there is module that will fire an AJAX call to server while the module(page) loads ?

> For simplicity, we will start from `module/` instead of full path

> **Before diving into actual code**, let's take a look at the `History API`

### **History**

In `Coil-React`, we have a hook call `useHistory`.

Basically this hooks is the same as what `react-router-dom`'s does, but we added a powerful function that help us deal with state between history.

```ts
import {useHistory} from "coil-react";

// Introducing history.pushHistory

// by doing this, we can extract the state using location.state

const usage1 = () => {
    const state = 100;
    history.pushHistory(state);
};

const usage2 = () => {
    const tab = "overview";
    const state = 100;
    history.pushHistory(`/my-page/${tab}`, "keep-state");
    history.pushHistory(`/my-page/${tab}`, state);
};
```

### **Lifecycle Method**

In `Coil-React`, we have two `lifecycle` methods,

-   `onMount`
-   `onRouteMatched`

```ts
import {injectLifeCycle} from "coil-react";
import {Main} from "./my/component";

// onMount
const useStateAction = () => {
    const onMount = () => {
        console.info("Component Did Mount!");
    };

    return {
        onMount,
    };
};

export const MainComponent = injectLifeCycle(Main, useStateAction);
```

```ts
import {injectLifeCycle, useHistory} from "coil-react";
import {Main} from "./my/component";
import type {Location} from "history";

type Tab = "overview" | "detail";

interface RouteParam {
    // This must be the same as where you declare <Route path='path/:tab' component={MainComponent} />
    tab: Tab;
}

interface State {
    id: number;
}

// onRouteMatched
const useStateAction = () => {
    const history = useHistory<State>();

    // This lifecycle will be fired every time the history is updated
    const onRouteMatched = (routeParam: RouteParam, location: Location<Readonly<State> | undefined>) => {
        const tab = routeParam.tab;

        // As mention before, we can extract the history state from location.state
        const myState = location.state;

        // You may do some data fetching here
    };

    const changeTab = (tab: Tab) => {
        history.pushHistory(`/my-page/${tab}`, "keep-state");
    };

    const pushStateToHistory = () => {
        const state: State = {
            id: 1234,
        };
        history.pushHistory(state);
    };

    return {
        onRouteMatched,
    };
};

export const MainComponent = injectLifeCycle<RouteParam, State>(Main, useStateAction);
```

### **Combine together**

**`module/dataFetching/type.ts`**

```ts
export interface State {
    filter: MyFilter;
    data: MyData | null;
}

export interface MyFilter {
    id: string | null;
}

export interface MyData {
    id: number;
    name: string;
    age: number;
}
```

**`module/dataFetching/index.ts`**

```ts
import Recoil from "recoil";
import {injectLifeCycle, useCoilState, useHistory} from "coil-react";
import type {State, MyFilter} from "./type";
import {Main} from "./Main";
import type {Location} from "history";

const initialFilter: MyFilter = {
    id: null,
};

const initialState: State = {
    filter: initialFilter,
    data: null,
};

export const DataFetchingState = Recoil.atom({
    key: "DataFetchingState",
    default: initialState,
});

export const useDataFetchingAction = () => {
    const {getState, setState} = useCoilState(DataFetchingState);
    const history = useHistory<MyFilter>();

    // Lifecycle Method 2
    // We don't use routeParameter here
    const onRouteMatched = (routeParameter: any, location: Location<Readonly<MyFilter> | undefined>) => {
        // This will fire after page load / history update
        const filter = location.state ?? initialFilter;
        setState((state) => (state.filter = filter));
        fetchData();
    };

    const pushFilterToHistory = (id: 1234) => {
        // By pushing the filter to history, it will trigger an update to call onRouteMatched, so we can extract that from location, to do the fetch data again
        history.pushHistory({id});
    };

    // This function should consider private, so we do not return it
    const fetchData = async () => {
        const filter = getState().filter;
        const data = await MyAJAXCall.function(filter);
        setState((state) => (state.data = data));
    };

    return {
        onRouteMatched,
        pushFilterToHistory,
    };
};

export const MainComponent = injectLifeCycle<any, MyFilter>(Main, useDataFetchingAction);
```

**`module/dataFetching/Main/index.tsx`**

```tsx
import React from "react";
import {useDataFetchingState} from "../hooks";
import {useDataFetchingAction} from "module/dataFetching";

export const Main = React.memo(() => {
    const name = useDataFetchingState((state) => state.data?.name || "");
    const age = useDataFetchingState((state) => state.data?.age || 0);
    const id = useDataFetchingState((state) => state.data?.id || 0);

    const {pushFilterToHistory} = useDatFetchingAction();

    return (
        <div>
            id: {id}
            name: {name}
            age: {age}
            Friends:
            <span onClick={() => pushFilterToHistory(1234)}>Jamyth</span>
        </div>
    );
});
```
