import React, { useState } from "react";

function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3001/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Signin successful!");
                // Potentially set the user token here or redirect to another page
            } else {
                setMessage(data.message || "Signin failed.");
            }
        } catch (error) {
            setMessage("Network error or server is down.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Signin</h2>
            {message && <p>{message}</p>}
            {loading && <p>Loading...</p>}
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
                <button type="submit" disabled={loading}>Signin</button>
            </form>
        </section>
    );
}

export default Signin;