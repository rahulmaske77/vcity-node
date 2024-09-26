#!/bin/bash

# check params
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 {build|start <node>|stop <node>}"
    exit 1
fi

# read command
COMMAND=$1
NODE=""

# if command is start or stop, read node name
if [[ $COMMAND == "start" || $COMMAND == "stop" ]]; then
    if [ "$#" -ne 2 ]; then
        echo "Usage: $0 $COMMAND <node>"
        exit 1
    fi
    NODE=$2
    NODE_DIR="${NODE}"

    # check if node directory exists
    if [ ! -d "${NODE_DIR}" ]; then
        echo "Node directory '${NODE_DIR}' does not exist."
        exit 1
    fi
fi

# excute command
case $COMMAND in
    build)
        echo "Building Docker image..."
        if [ -z "$2" ]; then
            echo "No build type specified."
            echo "Usage: $0 build <build_type>"
            exit 2
        else
            BUILD_TYPE=$2
            echo "Build type is: $BUILD_TYPE"
            if [ "$BUILD_TYPE" = "devnet" ]; then
                docker build --no-cache --tag vcity/validator . --build-arg USERNAME=$USER
            elif [ "$BUILD_TYPE" = "testnet" ]; then
                docker build --no-cache --tag vcity/validator . --build-arg USERNAME="user"
            else
                echo "Invalid build type: $BUILD_TYPE"
                echo "Usage: $0 build {devnet|testnet}"
                exit 2
            fi
        fi
        ;;
    start)
        echo "Starting ${NODE}..."
        docker-compose -f ${NODE_DIR}/docker-compose.yaml up node0 -d
        sleep 5
        docker-compose -f ${NODE_DIR}/docker-compose.yaml up -d
        ;;
    stop)
        echo "Stopping ${NODE}..."
        docker-compose -f ${NODE_DIR}/docker-compose.yaml down
        ;;
    *)
        echo "Invalid command: $COMMAND"
        echo "Usage: $0 {build|start <node>|stop <node>}"
        exit 2
        ;;
esac

exit 0