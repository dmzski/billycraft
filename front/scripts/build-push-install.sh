docker login
checkSuccess () {
        if [ $? != 0 ] ; then
                echo "Non zero code. exiting";
                exit 1;
        fi
}


version=`awk -F\" '/"version":/ {print $4}' package.json`

echo "Building image...";
# Build
docker build -t compta-front:latest -f ./Dockerfile ./
checkSuccess

echo "Image built...";

echo "Pushing image...";
# Push
docker tag compta-front:latest maliszewskid/compta-front:$version
docker tag compta-front:latest maliszewskid/compta-front:latest
checkSuccess

docker push maliszewskid/compta-front:$version
docker push maliszewskid/compta-front:latest
checkSuccess

echo "Image pushed...";
