import React, { useEffect, useState, createContext, useContext } from "react";
import { compileRoutes } from "./Router.utils";
import { CompiledRoute, Route } from "./Router.types";
import { RouterContext } from './Router.context';


const EmptyContext = createContext({});

export let navigateTo: (path: string, replace?: boolean) => void;


function Router({ routes, AppContext, children }: { routes?: Route[], AppContext?: React.Context<any>, children: any }) {
    const [ currentPath, setCurrentPath ] = useState<string>(document.location.pathname);
    const [ compiledRoutes, setCompiledRoutes ] = useState<CompiledRoute[]>([]);
    const [ activatedCompiledRoute, setActivatedCompiledRoute ] = useState<CompiledRoute | null>(null);
    const [ parameters, setParameters ] = useState({});

    if (!AppContext) {
        AppContext = EmptyContext;
    }

    const context = useContext(AppContext);


    navigateTo = (path, replace = false) => {
        console.log('navigate to', path);
        window.history[replace ? 'replaceState' : 'pushState']({}, '', path);
        setCurrentPath(document.location.pathname);
    };

    // Handle popstate event
    useEffect(() => {
        const onPopState = (e: PopStateEvent) => {
            e.preventDefault();
            setCurrentPath(document.location.pathname);
        };

        window.addEventListener('popstate', onPopState);
        
        return () => {
            window.removeEventListener('popstate', onPopState);
        }
    }, []);

    // Compile routes
    useEffect(() => {
        if (!!routes) {
            setCompiledRoutes(compileRoutes(routes));
        }
    }, [ routes ]);

    // Find the activated route
    useEffect(() => {
        if (!compiledRoutes.length) {
            return;
        }

        let redirect = '';
        const activatedCompiledRoute = compiledRoutes.find((route: any) => {
            const pathMatched = route.pattern.test(currentPath);
            
            if (pathMatched && 'canActivate' in route) {
                const result = route.canActivate(context);

                if (typeof result === 'string') {
                    redirect = result.replace(/^\/?/, '/');
                }
                return !!result;
            }
            return pathMatched;
        });

        if (!activatedCompiledRoute) {
            console.error(`Router: No matching route for '${currentPath}'`);
        } else if (redirect) {
            navigateTo(redirect);
        } else {
            setActivatedCompiledRoute(activatedCompiledRoute);
        }
    },  [ currentPath, compiledRoutes, context ]);

    // Extract route params
    useEffect(() => {
        if (activatedCompiledRoute) {
            const { pattern } = activatedCompiledRoute;
            setParameters(currentPath.match(pattern)?.groups || {});
        }
    }, [ currentPath, activatedCompiledRoute ]);

    // If redirectTo option is set on the route
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
