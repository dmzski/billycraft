docker login

echo "Tag image"
docker tag compta-back:latest maliszewskid/compta-back:latest

echo "Pushing image"
docker push maliszewskid/compta-back:latest
