import { CanActivateCallable, CompiledRoute, Route } from "./Router.types";

export function compileRoutes(routes: Route[], parentPath = '', parentCanActivate?: CanActivateCallable): CompiledRoute[] {
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

        const canActivate: (CanActivateCallable | undefined) = !parentCanActivate ?
            route.canActivate :
            ((context: any) => {
                const result = parentCanActivate(context);

                if (result !== true) {
                    return result;
                }
                
                return result && (
                    !!route.canActivate ? route.canActivate(context) : true
                );
            }) as CanActivateCallable;

        return [
            ...compiledRoutes,
            ...(!!route.children ?
                compileRoutes(route.children, fullPath, route.canActivate) :
                [{
                    route,
                    path,
                    fullPath,
                    pattern,
                    canActivate
                }]
            )
        ];
    }, [])
}