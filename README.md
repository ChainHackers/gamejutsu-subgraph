# gamejutsu-subgraph
Game events issued by GameJutsu Arbiter

https://thegraph.com/hosted-service/subgraph/chainhackers/gamejutsu-subgraph

## Setup
```shell
yarn global add @graphprotocol/graph-cli
# cd gamejutsu-gubgraph
yarn install
```

## Build
```shell
graph codegen
graph build

```

## Deploy
```shell
graph auth --product hosted-service XXXXXXXXXXXXXXXXXXXXXXXX___FIXME
graph deploy --product hosted-service chainhackers/gamejutsu-subgraph 
```
