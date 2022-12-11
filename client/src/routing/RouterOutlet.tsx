import { useRouter } from "./Router.context";

export default function RouterOutlet() {
    const { activatedRoute, parameters } = useRouter();
    const Component = activatedRoute?.component;

    
    return (<>
        { Component && <Component parameters={parameters}/> }
    </>);
}