import React, { useState } from "react";

function SendFile() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [office, setOffice] = useState("");
    const [message, setMessage] = useState("");

    const handleFileSend = async (e) => {
        e.preventDefault();

        if (!selectedFile || !recipient || !office) {
            setMessage("Please fill in all fields and select a file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('recipient', recipient);
        formData.append('office', office);

        const response = await fetch("http://localhost:3001/files/sendFile", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setMessage("File sent successfully!");
        } else {
            setMessage(data.message || "Failed to send the file.");
        }
    };

    return (
        <section>
            <h2>Send File</h2>
            {message && <p>{message}</p>}

            <form onSubmit={handleFileSend}>
                <div className="input-group">
                    <label htmlFor="recipient">Send To (Username/ID):</label>
                    <input 
                        type="text"
                        id="recipient"
                        value={recipient}
                        onChange={e => setRecipient(e.target.value)}
                        required 
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="office">From Office:</label>
                    <input 
                        type="text" 
                        id="office"
                        value={office}
                        onChange={e => setOffice(e.target.value)}
                        required 
                    />
                </div>

                <div className="input-group">
                    <label>Select File:</label>
                    <input 
                        type="file" 
                        onChange={e => setSelectedFile(e.target.files[0])} 
                        required 
                    />
                </div>
                
                <button type="submit">Send File</button>
            </form>
        </section>
    );
}

export default SendFile;
