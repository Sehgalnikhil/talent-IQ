import { useState, useEffect } from "react";

/**
 * Premium Decoding text component giving a "hacker type-out" 
 * loading animation before revealing actual static weights.
 */
export default function DecodingText({ text, speed = 30 }) {
    const [displayText, setDisplayText] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()";

    useEffect(() => {
        if (!text) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i > text.length) {
                clearInterval(interval);
                return;
            }
            setDisplayText(() => {
                const head = text.slice(0, i);
                const randomPart = chars[Math.floor(Math.random() * chars.length)];
                return head + (i < text.length ? randomPart : "");
            });
            i++;
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);

    return <span>{displayText}</span>;
}
