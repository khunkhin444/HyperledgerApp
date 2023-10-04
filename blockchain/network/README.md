```
cryptogen generate --config=crypto-config.yaml: to generate crypto-config.yaml which is used to generate crypto material for the network based on the configuration (crypto-config.yaml)
configtxgen -profile TwoOrgsOrdererGenesis -channelID mychannel -outputBlock ./channel-artifacts/genesis.block: to generate configtx.yaml which is used to generate genesis block and channel configuration transaction
docker-compose: to start the network
cli: to interact with the network
```