BASEDIR=$(dirname "$0")
actualVersion=`cat $BASEDIR/.version`

echo "Actual version : $actualVersion"
read -p "Numero de version à mettre en ligne : " version

docker login

echo "Tag image"
docker tag compta-back:latest maliszewskid/compta-back:latest
docker tag compta-back:latest maliszewskid/compta-back:$version

echo "Pushing image"
docker push maliszewskid/compta-back:latest
docker push maliszewskid/compta-back:$version

echo $version > $BASEDIR/.version
