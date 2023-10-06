```
cryptogen generate --config=crypto-config.yaml: to generate crypto-config.yaml which is used to generate crypto material for the network based on the configuration (crypto-config.yaml)
configtxgen -profile TwoOrgsOrdererGenesis -channelID mychannel -outputBlock ./channel-artifacts/genesis.block: to generate configtx.yaml which is used to generate genesis block and channel configuration transaction
docker-compose: to start the network
cli: to interact with the network

openssl req -new -x509 -key ca-key.pem -out ca-cert.pem -days 365 -subj '/CN=ca.example.com/O=Org1/C=US' -addext 'keyUsage = keyCertSign, cRLSign': to generate ca-cert.pem based on ca-key.pem and configuration (days, subject, addext)

openssl ecparam -genkey -name prime256v1 -noout -out ca-key.pem: to generate ca-key.pem

fabric-ca-server start --config ./config/fabric-ca-server-config.yaml: to start fabric-ca-server

fabric-ca-server and docker-compose network are not connected, so we need to connect them by adding the following to docker-compose.yaml file under fabric-ca-server:
    networks:
      - basic

docker-compose -f docker-compose-ca.yaml up -d: to start fabric-ca-server

fabric-ca-client enroll -u http://admin:adminpw@localhost:7054: to enroll admin user

fabric-ca-client register --id.name peer0 --id.secret peer0pw --id.type peer --id.affiliation org1.department1: to register peer0

fabric-ca-client register --id.name peer1 --id.secret peer1pw --id.type peer --id.affiliation org1.department1: to register peer1

fabric-ca-client register --id.name user1 --id.secret user1pw --id.type client --id.affiliation org1.department1: to register user1

fabric-ca-client register --id.name org1admin --id.secret org1adminpw --id.type admin --id.affiliation org1.department1: to register org1admin

fabric-ca-client register --id.name orderer --id.secret ordererpw --id.type orderer --id.affiliation org1.department1: to register orderer

fabric-ca-client enroll -u http://peer0:peer0pw@localhost:7054: to enroll peer0

fabric-ca-client enroll -u http://peer1:peer1pw@localhost:7054: to enroll peer1

fabric-ca-client enroll -u http://user1:user1pw@localhost:7054: to enroll user1

fabric-ca-client enroll -u http://org1admin:org1adminpw@localhost:7054: to enroll org1admin

fabric-ca-client enroll -u http://orderer:ordererpw@localhost:7054: to enroll orderer
```