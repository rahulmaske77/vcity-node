#!/bin/bash
set -e

BIN_DIR="/home/user/bin"
if ! echo "$PATH" | tr ':' '\n' | grep -q "$BIN_DIR"; then
    export PATH="$PATH:$BIN_DIR"
fi

DENOM="vcity"

CHAIN="vcitychain"
CHAINID="$CHAIN"_2023825-1

CHAIND="evmosd"

MONIKER="vcitynode1"

KEY="vcitynode1"
MNEMONIC="peace common sight paddle today shrug skull earth genius bullet crunch shove unhappy wealth adjust lunar access prize file sun foster outside ten when"

BUILD_DIR=$(pwd)/build
DATA_DIR=$BUILD_DIR/vcity
CONF_DIR=$DATA_DIR/config
CONFIG=$CONF_DIR/config.toml
GENESIS=$CONF_DIR/genesis.json
TEMP_GENESIS=$CONF_DIR/tmp_genesis.json

mkdir -p "$DATA_DIR"

echo "Create and add vcitynode1 keys"
echo "$MNEMONIC" | $CHAIND keys add "$KEY" --home "$DATA_DIR" --chain-id "$CHAINID" --keyring-backend test --recover
echo "Init $CHAIN with moniker=$MONIKER and chain-id=$CHAINID"
$CHAIND init "$MONIKER" --chain-id "$CHAINID" --home "$DATA_DIR"

echo "Prepare genesis..."
cp ./genesis.json $GENESIS

echo "- Run validate-genesis to ensure everything worked and that the genesis file is setup correctly"
$CHAIND validate-genesis --home $DATA_DIR

$CHAIND tx staking create-validator \
    --amount=50000000000000000000$DENOM \
    --pubkey=$($CHAIND tendermint show-validator --home "$DATA_DIR" --keyring-backend test) \
    --moniker="$MONIKER" \
    --chain-id="$CHAINID" \
    --commission-rate="0.10" \
    --commission-max-rate="0.20" \
    --commission-max-change-rate="0.01" \
    --min-self-delegation="1000000" \
    --gas="2000000" \
    --gas-prices="0.025$DENOM" \
    --from=$KEY \
    --node tcp://192.167.10.2:26657 \
    --keyring-backend test \
    --home "$DATA_DIR"