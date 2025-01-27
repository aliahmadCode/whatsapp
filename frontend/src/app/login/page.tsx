"use client";

import { useEffect, useState } from "react";

export default function Login() {
    const [usertoken, setUsertoken] = useState<string>("");

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");

        console.log(token);
    }, []);

    return (
        <>
            <div>
            </div>
        </>
    );
}
