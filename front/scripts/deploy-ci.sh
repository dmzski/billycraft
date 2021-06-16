version=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

docker login

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

# docker push maliszewskid/compta-front:$version
# docker push maliszewskid/compta-front:latest
checkSuccess

echo "Image pushed...";