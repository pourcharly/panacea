import React, { useEffect, useState, createContext, useContext } from "react";

export type Route = {
    path: string,
    redirectTo?: string,
    component?: React.FunctionComponent<any>,
    children?: Route[],
    canActivate?: boolean | ((appContext?: any) => boolean | string)
}
export type CompiledRoute = {
    route: Route,
    path: string,
    fullPath: string,
    pattern: RegExp,
}
export type RouterContextType = {
    activatedRoute?: Route,
    parameters?: any
}

const RouterContext = createContext<RouterContextType>({});
export const useRouter = () => useContext(RouterContext);
const EmptyContext = createContext<RouterContextType>({});

function compileRoutes(routes: Route[], parentPath = ''): CompiledRoute[] {
    return routes.reduce((compiledRoutes: CompiledRoute[], route: Route): CompiledRoute[] => {
        const path = route.path.replace(/(?:^\/+)|(?:\/+$)/g, '');

        const fullPath = [parentPath, path]
            .join('/')
            .replace(/\/+/g, '/')
            .replace(/\/$/g, '');

        const pattern = new RegExp(
            '^' +
            fullPath
                .replace(/\?/g, '\\?')
                .replace(/\//g, '/+')
                .replace(/^(\/)\+/g, '\\$1?')
                .replace(/:([^/?]+)/g, (m, paramName) => {
                    return `(?<${paramName}>[^/]+)`;
                })
            + '/*$'
        );

        return [
            ...compiledRoutes,
            ...(!!route.children ?
                compileRoutes(route.children, fullPath) :
                [{
                    route,
                    path,
                    fullPath,
                    pattern
                }]
            )
        ];
    }, [])
}

export let navigateTo: (path: string, replace?: boolean) => void;
const onPopState: (e: Event) => void = (e) => innerOnPopState(e);
let innerOnPopState:  (e: Event) => void = (e) => void 0;

window.addEventListener('popstate', onPopState);


function Router({ routes, AppContext, children }: { routes: Route[], AppContext?: React.Context<any>, children: any }) {
    const [ currentPath, setCurrentPath ] = useState<string>(document.location.pathname);
    const [ compiledRoutes, setCompiledRoutes ] = useState<CompiledRoute[]>([]);
    const [ activatedCompiledRoute, setActivatedCompiledRoute ] = useState<CompiledRoute | null>(null);
    const [ parameters, setParameters ] = useState({});

    if (!AppContext) {
        AppContext = EmptyContext;
    }

    const appState = useContext(AppContext);

    innerOnPopState = (e: Event) => {
        e.preventDefault();
        console.log(e);
        setCurrentPath(document.location.pathname);
    };

    navigateTo = (path, replace = false) => {
        console.log('navigate to', path);
        window.history[replace ? 'replaceState' : 'pushState']({}, '', path);
        setCurrentPath(path);
    };

    useEffect(() => {
        setCompiledRoutes(compileRoutes(routes));
    }, [ routes ]);

    useEffect(() => {
        if (!compiledRoutes.length) {
            return;
        }

        const activatedCompiledRoute = compiledRoutes.find((route: any) => {
            const pathMatched = route.pattern.test(currentPath);
            
            if (pathMatched && 'canActivate' in route.route) {
                const { canActivate } = route.route;
                const result = typeof canActivate === 'function' ? canActivate(appState) : !!canActivate;
                if (typeof result === 'string') {
                    navigateTo(result);
                }
                return !!result;
            }

            return pathMatched;
        });

        if (!activatedCompiledRoute) {
            console.error(`Router: No matching route for '${currentPath}'`);
        } else {
            setActivatedCompiledRoute(activatedCompiledRoute);
        }
    },  [ currentPath, compiledRoutes, appState ]);

    useEffect(() => {
        if (activatedCompiledRoute) {
            const { pattern } = activatedCompiledRoute;
            setParameters(currentPath.match(pattern)?.groups || {});
        }
    }, [ currentPath, activatedCompiledRoute ]);

    useEffect(() => {
        if (activatedCompiledRoute) {
            const { route: { redirectTo } } = activatedCompiledRoute;

            if (redirectTo) {
                navigateTo(redirectTo);
            }
        }
    }, [ activatedCompiledRoute ]);

    return (
        <RouterContext.Provider value={{ activatedRoute: activatedCompiledRoute?.route, parameters: parameters || {} }}>
            {children}
        </RouterContext.Provider>
    );
}

export default Router;
