yarn tsc --noEmit &&
yarn build &&
docker build -t azalor/title-hunter-frontend:latest . &&
docker push azalor/title-hunter-frontend:latest
