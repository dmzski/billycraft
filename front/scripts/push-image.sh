
docker login

read -p "Entrer le numéro de version que vous voulez mettre en ligne : " version

while [[ "$confirm" != "confirm" ]] && [[ "$confirm" != "N" ]]; do
    echo "Etes-vous sûr de vouloir mettre en ligne la version $version ? SI une version est déjà existante elle sera écrasée : Pour confirmer tapez confirm, pour annuler tapez N"
    read confirm
done


docker tag compta-front:latest maliszewskid/compta-front:$version
docker tag compta-front:latest maliszewskid/compta-front:latest

docker push maliszewskid/compta-front:$version
docker push maliszewskid/compta-front:latest
echo "Push des images terminé ! "
