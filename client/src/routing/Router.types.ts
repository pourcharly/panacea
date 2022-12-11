import { ComponentType } from "react"

export type CanActivateCallable = ((appContext?: any) => boolean | string);

export type Route = {
    path: string,
    redirectTo?: string,
    component?: ComponentType<RouterContextType>,
    children?: Route[],
    canActivate?: CanActivateCallable,
}

export type CompiledRoute = {
    route: Route,
    path: string,
    fullPath: string,
    pattern: RegExp,
    canActivate?: CanActivateCallable,
}

export type RouterContextType = {
    activatedRoute?: Route,
    parameters?: any,
}