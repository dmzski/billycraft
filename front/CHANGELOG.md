## [1.18.0](https://github.com/DorianMaliszewski/coco-erp/compare/v1.17.1...v1.18.0) (2021-07-08)

## 2.48.0

### Minor Changes

- f2a878a: Improve UI/UX, rename articles, improve typing, add labels, add auto vat on bill/quote creation, improve navigation

### Patch Changes

- Updated dependencies [f2a878a]
  - @coco-ui/core@1.35.0

## 2.47.0

### Minor Changes

- a356be9: Improve Bill and Quote navigation, drop history tab and increase font size of product group

## 2.46.0

### Minor Changes

- 1fe259e: Feat: Improve UI

### Patch Changes

- Updated dependencies [1fe259e]
  - @coco-ui/core@1.34.0

## 2.45.0

### Minor Changes

- 66ed73b: Improve listings and add some labels

## 2.44.0

### Minor Changes

- 8913bc5: Improve filters and Add row update product on quote and bill

## 2.43.0

### Minor Changes

- 9cbaad2: Products : add select all, low stock and stock alert and fix form submission on product form

### Patch Changes

- Updated dependencies [9cbaad2]
  - @coco-ui/core@1.33.0

## 2.42.0

### Minor Changes

- fc2e6fc: New todo list

## 2.41.0

### Minor Changes

- 28ee2b3: Product: Add multi actions on listing

## 2.40.0

### Minor Changes

- 83c7328: UI/UX Refacto

## 2.39.0

### Minor Changes

- a7af714: Products: New UI that allow users to add a group of products

### Patch Changes

- Updated dependencies [a7af714]
  - @coco-ui/core@1.32.0

## 2.38.0

### Minor Changes

- a2e0c0f: Allow users to manage their product stocks

## 2.37.0

### Minor Changes

- 737f0c6: fix: textarea resize and some wordings

### Patch Changes

- Updated dependencies [737f0c6]
  - @coco-ui/core@1.31.0

## 2.36.0

### Minor Changes

- a46e78d: feat: you can now invite, join and delete user in your organization
- 8a88a56: feat: add transition state on download pdf and create bill
- e94f549: feat: add roles on users

## 2.35.0

### Minor Changes

- 58092e8: fix: add whitespace pre-wrap on overview bill and quote

## 2.34.0

### Minor Changes

- e75911a: fix: product type label when icon is not present

## 2.33.0

### Minor Changes

- 5995d90: feat: allow users to save product during bill or quote creation/edit

## 2.32.0

### Minor Changes

- 8246d69: feat(supplier): improve ui
- 2af94e9: feat: add product filters
- 8246d69: feat(product): add supplier

### Patch Changes

- Updated dependencies [8246d69]
  - @coco-ui/core@1.30.0

## 2.31.0

### Minor Changes

- 580e25f: feat: migrate to uuid and drop appointment

## 2.30.0

### Minor Changes

- 1b9d0bd: fix: typecheck

## 2.29.0

### Minor Changes

- f86a80e: feat: allow users to edit ttc prices

## 2.28.0

### Minor Changes

- 9c51f2d: fix: condition create bill from quote and select
- f35e32b: feat: new bills and quotes form and add overview
- e987ff5: feat: better status management
- f73c129: feat: quote improve form ui
- e987ff5: feat: customer overview

### Patch Changes

- Updated dependencies [ee3e82a]
- Updated dependencies [7097660]
- Updated dependencies [ee3e82a]
- Updated dependencies [9c51f2d]
  - @coco-ui/core@1.29.0

## 2.27.0

### Minor Changes

- 08e1cf0: feat(core): improve tsconfig and add error boundary
- 08e1cf0: feat(quote,bills): drop useless status
- 090c89d: chore(dashboard): change bg opacity when todo is done
- 08e1cf0: feat(quote): try a new form

## 2.26.0

### Minor Changes

- 4181bdc: feat(core): change theme

## 2.25.0

### Minor Changes

- fb3cdb4: feat: add customer page and split quote form pages
- f974b13: feat(accounting): clean and better style

### Patch Changes

- f974b13: feat: change side menu order
- f974b13: chore(settings): use unique strings to translate in pdf customizations

## 2.24.0

### Minor Changes

- aa8fec4: fix: populate modal with data

## 2.23.0

### Minor Changes

- 5505d60: fix: login success throw always if use cookies

## 2.22.0

### Minor Changes

- 9422908: feat: improve AuthProvider to handle localStorage usage instead of cookie only

### Patch Changes

- 9422908: chore: refactor queries into a single directory
- Updated dependencies [9422908]
  - @coco-ui/core@1.28.1

## 2.21.0

### Minor Changes

- 1c2e945: feat: useI18n everywhere
- 1c2e945: feat: reimport coco-ui in workspace
- 4247b35: feat: use a custom auth server
- 3e2eb01: feat: add tos validation

### Patch Changes

- Updated dependencies [1c2e945]
- Updated dependencies [3e2eb01]
  - @coco-ui/core@1.28.0

## 2.20.1

### Patch Changes

- d269098: feat: implement ht and ttc in pdf generation

### :gear: Features

- prefix and can back from accepted [#15](https://github.com/DorianMaliszewski/coco-erp/issues/15) ([#16](https://github.com/DorianMaliszewski/coco-erp/issues/16)) ([3dfc047](https://github.com/DorianMaliszewski/coco-erp/commit/3dfc04739c0cc85484b9c3314d7d39aa6efb8406))

### [1.17.1](https://github.com/DorianMaliszewski/coco-erp/compare/v1.17.0...v1.17.1) (2021-06-21)

### :bug: Bug Fixes

- select customers ([#14](https://github.com/DorianMaliszewski/coco-erp/issues/14)) ([9577430](https://github.com/DorianMaliszewski/coco-erp/commit/9577430c16d4fbad34b27278317fab2ed49735cc))

## 1.0.0 (2021-06-17)

### :gear: Features

- add ci ([#13](https://github.com/DorianMaliszewski/coco-erp/issues/13)) ([eb59e3e](https://github.com/DorianMaliszewski/coco-erp/commit/eb59e3e393d687b326ead134066f70232e83c551))
- add coco-ui ([f888b41](https://github.com/DorianMaliszewski/coco-erp/commit/f888b415bde3fe6872e738c623650d36b6f74bd9))
- add existing product ([bbd1911](https://github.com/DorianMaliszewski/coco-erp/commit/bbd191186b42c2ad7514a575afc24dc87a1e50bd))
- migration done ([ed1d815](https://github.com/DorianMaliszewski/coco-erp/commit/ed1d815ae840daf030e7006d63e870e9206e8bfd))
- new product design ([2c93346](https://github.com/DorianMaliszewski/coco-erp/commit/2c933469328a8ad067418d008b7333a8f64d3eef))

### :package: Chore

- **back:** prepare for next development iteration ([761e8b7](https://github.com/DorianMaliszewski/coco-erp/commit/761e8b7d56804dd2b20bb87044690dfbf9d7e6f9))
- **back:** prepare for next development iteration ([f3067a8](https://github.com/DorianMaliszewski/coco-erp/commit/f3067a8bf804a40be11b636263e03a228f2e2d43))
- **back:** release back-v1.2.1 ([0005120](https://github.com/DorianMaliszewski/coco-erp/commit/0005120ce78f9d92855bd6f97786e27c00bbde27))
- **back:** release back-v1.2.2 ([5447aad](https://github.com/DorianMaliszewski/coco-erp/commit/5447aad25ab32ce2c108e08a8a084a8bde17403a))
- **back:** release back-v1.2.2 ([0c69977](https://github.com/DorianMaliszewski/coco-erp/commit/0c699778c1a37764a2adaf3c9d5a6e47f06f52b2))
- front 1.16.0 ([56360c5](https://github.com/DorianMaliszewski/coco-erp/commit/56360c517db8eaabad5ff1b210758a748fea9a11))
- release back 1.1.0 ([66438cf](https://github.com/DorianMaliszewski/coco-erp/commit/66438cf37c06dbdae40ae7504b718207a936af32))
- release back 1.2.0 ([61ba427](https://github.com/DorianMaliszewski/coco-erp/commit/61ba427158a9389b5577da41b7e8399b574147e4))
- release front 1.16.1 ([383fecf](https://github.com/DorianMaliszewski/coco-erp/commit/383fecf6a05d76ce332f37e70ae56aa28845c888))
- release front 1.16.2 ([5f3bc82](https://github.com/DorianMaliszewski/coco-erp/commit/5f3bc824032b41a98b4b12bbf9c863860a15255b))
- release front 1.16.3 ([c948acf](https://github.com/DorianMaliszewski/coco-erp/commit/c948acf6e5710389d35d3b2d70ff487cd7c1a03b))
- **front-release:** version 1.15.0 ([7449130](https://github.com/DorianMaliszewski/coco-erp/commit/74491306a2bac4eb17cd4efc037fcedeb6d4c807))
- **release:** version 1.15.1 ([8ed959c](https://github.com/DorianMaliszewski/coco-erp/commit/8ed959cafc08dbb5925ca37d27e8a06381c9b865))

### :bug: Bug Fixes

- back ci ([e00677f](https://github.com/DorianMaliszewski/coco-erp/commit/e00677fca6fee9d3d0d545405c9e43e420124f46))
- back developerConnection ([fe60cd9](https://github.com/DorianMaliszewski/coco-erp/commit/fe60cd9235ee545dbfa119e56fb6e8810168625c))
- bill form ([7c6d276](https://github.com/DorianMaliszewski/coco-erp/commit/7c6d276e1ba70a72102881b9b23fbf718cdaafdd))
- ci ([4a471de](https://github.com/DorianMaliszewski/coco-erp/commit/4a471dea8af9e5f47fa358c63c184539897bae5c))
- ci ([45142e9](https://github.com/DorianMaliszewski/coco-erp/commit/45142e9d40486a3ecad0c1d6ac15408c37899c6d))
- disble add existing product ([05e6c93](https://github.com/DorianMaliszewski/coco-erp/commit/05e6c93a27d11e0c7582c83757a9be2b9708ccfa))
- drop version file ([f428077](https://github.com/DorianMaliszewski/coco-erp/commit/f4280778acfd1230601a79616dcc9246001bfc1b))
- front ci ([9ef9591](https://github.com/DorianMaliszewski/coco-erp/commit/9ef95913862c4e0a4b1fa8d9782baba8004cc482))
- front dependencies ([980d246](https://github.com/DorianMaliszewski/coco-erp/commit/980d246bc1a36941b4ac62f0acc1f056472d5740))
- line name ([c5c6744](https://github.com/DorianMaliszewski/coco-erp/commit/c5c674480983575a942af8f2adbd837811cd43b3))
- lot of stuff ([7366309](https://github.com/DorianMaliszewski/coco-erp/commit/73663096e2f0e1aca955987efe744c4ace38ee48))
- pdf generation ([3e8c5a0](https://github.com/DorianMaliszewski/coco-erp/commit/3e8c5a0ab7a8b45f0fd8c58913b64cb3709e9d50))
- release cocoerp configuration ([cbf80b5](https://github.com/DorianMaliszewski/coco-erp/commit/cbf80b5b4c6cc089f66145371161e789159e2148))
- semantic plugins ([f9da8e4](https://github.com/DorianMaliszewski/coco-erp/commit/f9da8e4cb2213e984056d82f9b0fdd8e12e69716))
- testing ci ([9f7bc95](https://github.com/DorianMaliszewski/coco-erp/commit/9f7bc954a6f4cb716c6bacd1e165b813bdf8e187))
