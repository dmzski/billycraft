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
docker build -t coco-front:latest -f ./Dockerfile ./
checkSuccess

echo "Image built...";

echo "Pushing image...";
# Push
docker tag compta-front:latest maliszewskid/coco-front:$version
docker tag compta-front:latest maliszewskid/coco-front:latest
checkSuccess

docker push maliszewskid/coco-front:$version
docker push maliszewskid/coco-front:latest
checkSuccess

echo "Image pushed...";
