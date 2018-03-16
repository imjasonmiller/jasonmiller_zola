#!/bin/bash

set -e

echo ${TEST}

rsync -a -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=quiet" --quiet --omit-dir-times --update --delete --delay-updates ../public/ ${DEPLOY_ADR}
