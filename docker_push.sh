yarn tsc --noEmit &&
yarn lint &&
yarn test &&
yarn build &&
docker build -t azalor/title-hunter-frontend:latest . &&
docker push azalor/title-hunter-frontend:latest
