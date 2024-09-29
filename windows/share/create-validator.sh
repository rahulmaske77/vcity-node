#!/bin/bash

set -e

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <mnemonic>"
  exit 1
fi

BIN_DIR="/home/user/bin"
CHAIND="$BIN_DIR/evmosd"
DATA_DIR="/home/user/.vcity"
CHAINID="vcitychain_20230825-1"
DENOM_UNIT="uvcity"
PASSWORD="12345678"
PRIVATE_KEY=$1

echo $PASSWORD | $CHAIND keys unsafe-import-eth-key validator $PRIVATE_KEY --home $DATA_DIR --keyring-backend test
# echo $CHAIND tendermint show-address --home $DATA_DIR

$CHAIND tx staking create-validator \
  --amount=100000000000000000000$DENOM_UNIT \
  --pubkey=$($CHAIND tendermint show-validator --home $DATA_DIR --chain-id $CHAINID) \
  --moniker="vcity-validator" \
  --chain-id=$CHAINID \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1" \
  --from=validator \
  --gas=auto \
  --gas-prices="10$DENOM_UNIT" \
  --keyring-backend=test \
  --home=$DATA_DIR \
  --yes

$CHAIND query staking validators --home $DATA_DIR --chain-id $CHAINID