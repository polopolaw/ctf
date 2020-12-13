#!/bin/sh

echo underpost starting
init=$INIT

if [ "$init" = "yes" ]
then
    echo remove old data
    rm /opt/underpost/db/myDb
    rm -r /opt/underpost/images/*
    rm -r /opt/underpost/complaints/*
fi

if [ "$init" = "yes" ] || [ "$init" = "cond" ]
then
    echo initialize data    
    cp -r /opt/underpost/init/images/* /opt/underpost/images/
    cp -r /opt/underpost/init/complaints/* /opt/underpost/complaints/
    cp /opt/underpost/init/myDb /opt/underpost/db/myDb
fi

echo run java app
exec java -jar underpost.jar
