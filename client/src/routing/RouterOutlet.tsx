
import { useRouter } from "./Router";

export default function RouterOutlet() {
    const { activatedRoute, parameters } = useRouter();

    
    return (<>
        { activatedRoute?.component && activatedRoute.component({ parameters }) }
    </>);
}