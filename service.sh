#!/bin/bash
path=$1
export NODE_ENV=production
sudo /root/.nvm/versions/node/v12.18.4/bin/pm2 describe ricva.v2-gateway > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
    # sudo /root/.nvm/versions/node/v12.18.4/bin/pm2 delete --silent $path
    sudo /root/.nvm/versions/node/v12.18.4/bin/pm2 start $path --env production
else
    sudo /root/.nvm/versions/node/v12.18.4/bin/pm2 stop --silent $path
    sudo /root/.nvm/versions/node/v12.18.4/bin/pm2 restart $path --env production --update-env
fi;