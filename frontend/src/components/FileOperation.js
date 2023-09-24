import React, { useState } from "react";

function FileOperation() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileDownload = async () => {
        try {
            const response = await fetch("http://localhost:3001/files/downloadFile");
    
            // Check if the request was successful
            if (!response.ok) {
                const data = await response.json();
                setMessage(data.message || "Failed to download the file.");
                return;
            }
    
            // Extracting the blob and filename from the response
            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloaded_file';
    
            // Create an anchor element and trigger download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
    
            setMessage("File downloaded successfully!");
    
        } catch (error) {
            setMessage(`An error occurred: ${error}`);
        }
    };
    

    const handleFileSendBack = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch("http://localhost:3001/files/sendBackFile", {
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
