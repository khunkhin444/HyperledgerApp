import React, { useState } from "react";

function FileOperation() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileDownload = async () => {
        // Logic for downloading a file
        // This might vary based on your backend structure
    };

    const handleFileSendBack = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch("/api/sendback", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setMessage("File sent back successfully!");
        } else {
            setMessage(data.message || "Failed to send back the file.");
        }
    };

    return (
        <section>
            <h2>File Operation</h2>
            {message && <p>{message}</p>}

            <div className="input-group">
                <label>Download File</label>
                <button onClick={handleFileDownload}>Download</button>
            </div>

            <div className="input-group">
                <label>Send Back File</label>
                <input 
                    type="file" 
                    onChange={e => setSelectedFile(e.target.files[0])} 
                    required 
                />
                <button onClick={handleFileSendBack}>Send Back</button>
            </div>
        </section>
    );
}

export default FileOperation;
