currentVersion=`cat ./src/constants/global.ts| grep VERSION | cut -d " " -f5 | cut -d "\"" -f2`
docker login
echo "Version actuelle : $currentVersion"

read -p "Entrer le numéro de version que vous voulez build : " version

while [[ "$confirm" != "O" ]] && [[ "$confirm" != "N" ]]; do
    echo "Builder la version $version ? (O/N)"
    read confirm
done

sed -i'' -e "s/VERSION = .*/VERSION = \"$currentVersion\";/g" ./src/constants/global.ts


docker build -t compta-front:latest -f ./Dockerfile ./