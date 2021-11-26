docker login
checkSuccess () {
        if [ $? != 0 ] ; then
                echo "Non zero code. exiting";
                exit 1;
        fi
}

read -p "Entrer le numéro de version que vous voulez build, push et installer sur le serveur : " version

while [[ "$confirm" != "confirm" ]] && [[ "$confirm" != "N" ]]; do
        echo "Etes-vous sûr de vouloir mettre en ligne la version $version ? Si une version est déjà existante elle sera écrasée : Pour confirmer tapez confirm, pour annuler tapez N"
        read confirm
done

if [ "$confirm" = "N" ] ; then
        echo "Bye bye";
        exit 0;
fi
checkSuccess

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