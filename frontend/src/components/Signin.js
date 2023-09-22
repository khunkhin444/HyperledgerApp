import React, { useState } from "react";

function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignin = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            setMessage("Signin successful!");
            // Potentially set the user token here or redirect to another page
        } else {
            setMessage(data.message || "Signin failed.");
        }
    };

    return (
        <section>
            <h2>Signin</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSignin}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Signin</button>
            </form>
        </section>
    );
}

export default Signin;
