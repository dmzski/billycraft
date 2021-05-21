currentVersion=`cat ./src/constants/global.ts| grep VERSION | cut -d " " -f5 | cut -d "\"" -f2`
docker login
checkSuccess () {
        if [ $? != 0 ] ; then
                echo "Non zero code. Rollback files then exiting";
                sed -e "s/VERSION = .*/VERSION = \"$currentVersion\";/g" ./src/constants/global.ts > ./src/constants/global.ts
                egrep -lRZ "$version" ./kubernetes/ | xargs -0 -l sed -i -e "s/$version/$currentVersion/g" > /dev/null
                exit 1;
        fi
}

echo "Version actuelle : $currentVersion"

read -p "Entrer le numéro de version que vous voulez build, push et installer sur le serveur : " version

while [[ "$confirm" != "confirm" ]] && [[ "$confirm" != "N" ]]; do
        echo "Etes-vous sûr de vouloir mettre en ligne la version $version ? Si une version est déjà existante elle sera écrasée : Pour confirmer tapez confirm, pour annuler tapez N"
        read confirm
done

if [ "$confirm" = "N" ] ; then
        echo "Bye bye";
        exit 0;
fi

displayPopup="q"
while [[ "$displayPopup" != "o" ]] && [[ "$displayPopup" != "n" ]]; do
        read -p "Faut-il afficher le popup des news (o/n) : " displayPopup
done

if [[ "$displayPopup" == "o" ]]; then
        sed -e "s/DISPLAY_NEWS = .*/DISPLAY_NEWS = true;/g" ./src/constants/global.ts > ./src/constants/global.ts
else
        sed -e "s/DISPLAY_NEWS = .*/DISPLAY_NEWS = false;/g" ./src/constants/global.ts > ./src/constants/global.ts
fi

sed -e "s/VERSION = .*/VERSION = \"$version\";/g" ./src/constants/global.ts > ./src/constants/global.ts
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