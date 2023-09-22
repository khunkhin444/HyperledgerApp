package main

import (
    "encoding/json"
    "fmt"
    "github.com/hyperledger/fabric-chaincode-go/shim"
    pb "github.com/hyperledger/fabric-protos-go/peer"
)

type FileTransactionChaincode struct {
}

type FileMetadata struct {
    Filename   string `json:"filename"`
    FileHash   string `json:"filehash"`
    Sender     string `json:"sender"`
    Receiver   string `json:"receiver"`
    Timestamp  string `json:"timestamp"`
    Status     string `json:"status"` // Example: "sent", "received"
}

func (t *FileTransactionChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
    return shim.Success(nil)
}

func (t *FileTransactionChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
    function, args := stub.GetFunctionAndParameters()

    switch function {
    case "sendFile":
        return t.sendFile(stub, args)
    case "receiveFile":
        return t.receiveFile(stub, args)
    case "getFileMetadata":
        return t.getFileMetadata(stub, args)
    default:
        return shim.Error("Invalid function name. Available functions: 'sendFile', 'receiveFile', 'getFileMetadata'")
    }
}

func (t *FileTransactionChaincode) sendFile(stub shim.ChaincodeStubInterface, args []string) pb.Response {
    // Basic argument validation
    if len(args) != 5 {
        return shim.Error("Incorrect number of arguments. Expecting 5 (Filename, FileHash, Sender, Receiver, Timestamp)")
    }

    fileMetadata := FileMetadata{
        Filename:   args[0],
        FileHash:   args[1],
        Sender:     args[2],
        Receiver:   args[3],
        Timestamp:  args[4],
        Status:     "sent",
    }

    fileMetadataBytes, err := json.Marshal(fileMetadata)
    if err != nil {
        return shim.Error(fmt.Sprintf("Error marshaling FileMetadata object: %s", err))
    }

    err = stub.PutState(args[0], fileMetadataBytes) // Using filename as the key
    if err != nil {
        return shim.Error(fmt.Sprintf("Failed to set FileMetadata: %s", err))
    }

    return shim.Success(nil)
}

func (t *FileTransactionChaincode) receiveFile(stub shim.ChaincodeStubInterface, args []string) pb.Response {
    // For simplicity, let's assume we just update the status of a file based on its filename
    if len(args) != 1 {
        return shim.Error("Incorrect number of arguments. Expecting 1 (Filename)")
    }

    fileMetadataBytes, err := stub.GetState(args[0])
    if err != nil || fileMetadataBytes == nil {
        return shim.Error("File not found")
    }

    var fileMetadata FileMetadata
    err = json.Unmarshal(fileMetadataBytes, &fileMetadata)
    if err != nil {
        return shim.Error(fmt.Sprintf("Error unmarshaling FileMetadata object: %s", err))
    }

    fileMetadata.Status = "received"

    updatedFileMetadataBytes, err := json.Marshal(fileMetadata)
    if err != nil {
        return shim.Error(fmt.Sprintf("Error marshaling updated FileMetadata object: %s", err))
    }

    err = stub.PutState(args[0], updatedFileMetadataBytes)
    if err != nil {
        return shim.Error(fmt.Sprintf("Failed to update FileMetadata: %s", err))
    }

    return shim.Success(nil)
}

func (t *FileTransactionChaincode) getFileMetadata(stub shim.ChaincodeStubInterface, args []string) pb.Response {
    if len(args) != 1 {
        return shim.Error("Incorrect number of arguments. Expecting 1 (Filename)")
    }

    fileMetadataBytes, err := stub.GetState(args[0])
    if err != nil || fileMetadataBytes == nil {
        return shim.Error("File not found")
    }

    return shim.Success(fileMetadataBytes)
}

func main() {
    err := shim.Start(new(FileTransactionChaincode))
    if err != nil {
        fmt.Printf("Error starting FileTransaction chaincode: %s", err)
    }
}
