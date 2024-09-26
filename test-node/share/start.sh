#!/bin/bash

set -e

CURRENT_USER=$(whoami)
BIN_DIR="/home/${CURRENT_USER}/bin"
if ! echo "$PATH" | tr ':' '\n' | grep -q "$BIN_DIR"; then
    export PATH="$PATH:$BIN_DIR"
fi

DENOM="vcity"

CHAIN="vcitychain"
CHAINID="$CHAIN"_20230825-1

CHAIND="evmosd"

BUILD_DIR=$(pwd)
SHARE_DIR=$BUILD_DIR/share
DATA_DIR=$BUILD_DIR/.vcity
CONF_DIR=$DATA_DIR/config
CONFIG=$CONF_DIR/config.toml
GENESIS=$CONF_DIR/genesis.json
TEMP_GENESIS=$CONF_DIR/tmp_genesis.json

APP_CONFIG=$CONF_DIR/app.toml

if [[ ! -d $DATA_DIR ]]; then
    echo "Init $CHAIN with moniker=$MONIKER and chain-id=$CHAINID"
    $CHAIND init "$MONIKER" --chain-id "$CHAINID" --home "$DATA_DIR"
    cp $SHARE_DIR/genesis.json $GENESIS
fi

sed -i 's/prometheus = false/prometheus = true/g' $CONFIG
sed -i 's/enable-indexer = false/enable-indexer = true/g' $APP_CONFIG
perl -i -0pe 's/# Enable defines if the API server should be enabled.\nenable = false/# Enable defines if the API server should be enabled.\nenable = true/' $APP_CONFIG
sed -i.bak "s/aevmos/$DENOM/g" $APP_CONFIG

# make sure the localhost IP is 0.0.0.0
sed -i 's/pprof_laddr = "localhost:6060"/pprof_laddr = "0.0.0.0:6060"/g' "$CONFIG"
sed -i 's/127.0.0.1/0.0.0.0/g' "$APP_CONFIG"
sed -i 's/localhost/0.0.0.0/g' "$APP_CONFIG"
sed -i 's/api = "[^"]*"/api = "web3,eth,debug,personal,net"/' "$APP_CONFIG"
sed -i 's/enabled-unsafe-cors = false/enabled-unsafe-cors = true/' "$APP_CONFIG"
sed -i 's/swagger = false/swagger = true/g' "$APP_CONFIG"
sed -i.bak '/[grpc-web]/,/^\s*$/{/enable = false/s/enable = false/enable = true/}' "$APP_CONFIG"
sed -i "s/^seeds = .*/seeds = "\"c709a70a86ff41d9eddcaf055da4cbe032abf6e8@207.81.171.181:26656\""/" $CONFIG

# pruning settings
# if pruning is defined
if [[ -z "${pruning}" ]]; then 
    pruning="--pruning=nothing"
else
    pruning=""
    sed -i 's/pruning = "default"/pruning = "custom"/g' "$APP_CONFIG"
    sed -i 's/pruning-keep-recent = "0"/pruning-keep-recent = "5"/g' "$APP_CONFIG"
    sed -i 's/pruning-interval = "0"/pruning-interval = "10"/g' "$APP_CONFIG"
fi

echo "running $CHAIN with extra flags $EXTRA_FLAGS"
echo "starting $CHAIN node in background ..."
echo "./"$CHAIND" start "$pruning" --rpc.unsafe --keyring-backend test --home "$DATA_DIR" "$EXTRA_FLAGS" >"$DATA_DIR"/node.log"
$CHAIND start --rpc.unsafe \
--json-rpc.enable true --api.enable \
--keyring-backend test --home $DATA_DIR --chain-id $CHAINID $EXTRA_FLAGS \
--api.enabled-unsafe-cors true \
--api.enable true