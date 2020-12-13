#!/bin/sh
# sensor program read data from input stream
t=$(date +'%M')
read id
len=${#id}
mdf=`expr $t + $len`
tail=$((mdf%60))
part=`expr $tail / 15 `

if [ "$part" -eq "1" ]; then
    echo Tempo Fall detected!
  else
    if [ "$part" -eq "3" ]; then
      echo Beached Things detected!    
    else
      echo No anomaly detected!
    fi
fi

