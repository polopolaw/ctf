#!/bin/sh

echo s4femap starting
init=$INIT
if [ "$init" == "yes" ]; then
    echo initialize data
    rm /opt/s4femap/db/myDb
    rm -r /opt/s4femap/data/*
    cp -r -f /opt/s4femap/init/data/* /opt/s4femap/data/
    cp -f /opt/s4femap/init/myDb /opt/s4femap/db/myDb
fi
echo run java app
exec java -jar s4femap.jar
