import { React, useRef, useEffect } from "react";
import gsap from "gsap";

function Loader() {
    const logoRef = useRef(null);

    useEffect(() => {
        const t1 = gsap.timeline({ repeat: -1 });

        t1.fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power1.inOut' });
    }, []);

    return (
        <div className="loader">
            <img src="/assets/images/humangle-logo-full-colour-rgb.png" ref={logoRef} alt="logo" />
        </div>
    );
}

export function LoaderSmall() {
    const logoRef = useRef();

    useEffect(() => {
        const t1 = gsap.timeline({ repeat: -1 });

        t1.fromTo(logoRef.current, { opacity: 0, rotation: 0 }, { opacity: 0.9, duration: 2, rotation: 360, ease: "elastic" });
    }, []);

    return (
        <div className="loader-small">
            <img src="/assets/images/humangle-logo-full-colour-rgb.png" ref={logoRef} alt="logo" />
        </div>
    );
}

export default Loader;
