#!/usr/bin/env bash

if [[ "$TOKEN" = "" ]] ; then
    echo "Entrez un access token"
    read access_token
    TOKEN=${access_token}
fi

echo "Le token" $TOKEN

wrk -t12 -c400 -d30s -H "Authorization: $TOKEN" --script ./scripts/wrk/myInformation.lua https://api.coco-erp.fr/graphql
