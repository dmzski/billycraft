# docker login

# currentVersion=`cat ./theme/.version`
# echo "Version actuelle : $currentVersion" 

# read -p "Version du theme à mettre sur le dockerhub ? " version

# read -p "Sur ? (confirm pour confirmer) : " confirm

# if [ "$confirm" != "confirm" ] ; then
#     echo "Bonne idée, bye."
#     exit 0;
# fi

# docker build -t maliszewskid/compta-kc-theme:latest -f Dockerfile.prod
# docker taf maliszewskid/compta-kc-theme:latest maliszewskid/compta-kc-theme:$version

# docker push maliszewskid/compta-kc-theme:$version
# docker push maliszewskid/compta-kc-theme:latest

# echo "C'est bon maliszewskid/compta-kc-theme:$version en PROD"

scp -r ./theme/* debian@app.coco-erp.fr:~/compta/theme
