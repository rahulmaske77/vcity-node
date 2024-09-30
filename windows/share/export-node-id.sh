#!/bin/bash

set -e

BIN_DIR="/home/user/bin"
CHAIND="$BIN_DIR/evmosd"
DATA_DIR="/home/user/.vcity"
CHAINID="vcitychain_20230825-1"

$CHAIND tendermint show-node-id --home $DATA_DIR --chain-id $CHAINID