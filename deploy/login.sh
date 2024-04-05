#!/bin/sh
echo "$SCW_SECRET_KEY" | docker login rg.fr-par.scw.cloud/coco-erp -u nologin --password-stdin
