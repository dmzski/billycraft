# Front Billycraft

# Uses

- pnpm >= 8
- node >= 20

# Install

- pnpm install

# Dev

- pnpm start

# Deploy

- make deploy-docker

# URLs API dynamiques au runtime (sans rebuild)

Les URLs (`VITE_API_URL` / `VITE_AUTH_API_URL`) sont figées dans le bundle JS
au moment du build. Depuis qu'on utilise les images `dockers/front/Dockerfile`
(nginx), on peut les changer au runtime via des variables d'environnement :
aucune modification de code front n'est nécessaire, le `sub_filter` nginx
réécrit le bundle JS à la volée.

```sh
# Rien à changer dans le code. Au lancement du conteneur :
docker run -e API_URL=https://api.mon-domaine.fr/api/v1 \
           -e AUTH_API_URL=https://auth.mon-domaine.fr/api \
           -p 8080:80 app:latest
```

Ou dans `deploy/docker-compose.yml` via `.env` :

```env
API_URL=https://api.mon-domaine.fr/api/v1
AUTH_API_URL=https://auth.mon-domaine.fr/api
```

Détails :
- `BAKED_API_URL` / `BAKED_AUTH_API_URL` = URLs du build (chaînes cherchées),
- `API_URL` / `AUTH_API_URL` = valeurs de remplacement (retour à l'URL du build
  si non définies => pas de changement),
- le template nginx (`front/nginx.conf.template`) est substitué au démarrage
  par l'image officielle nginx (`/etc/nginx/templates/`).
- les pointeurs `sub_filter` (+ `Cache-Control: no-cache` sur les assets JS)
  vivent dans `front/nginx.conf.template`.
