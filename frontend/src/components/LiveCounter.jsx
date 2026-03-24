import { useEffect, useState } from "react";

/**
 * Premium Counter Increment layout which dials counts and bounces upon loads.
 */
export default function LiveCounter({ value, duration = 1.5 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value, 10);
        if (isNaN(end)) return;

        const totalFrames = Math.round(duration * 60); // 60fps average
        const increment = end / totalFrames;

        let frame = 0;
        const interval = setInterval(() => {
            frame++;
            const current = Math.round(increment * frame);
            
            if (frame >= totalFrames) {
                setCount(end);
                clearInterval(interval);
            } else {
                setCount(current);
            }
        }, 1000 / 60);

        return () => clearInterval(interval);
    }, [value, duration]);

    return <span>{count}</span>;
}
