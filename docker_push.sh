echo "Have you checked that the new changes don't write unnecessary data to the Audit log? (yes/no):"
read -r answer

case "$answer" in
    yes|y)
        echo "Audit log check passed."
        ;;
    *)
        echo "Script aborted. Please check Audit log changes first."
        exit 1
        ;;
esac

echo "Have you checked that poster URLs are valid or that poster links use prefetch={false}? (yes/no):"
read -r answer

case "$answer" in
    yes|y)
        echo "Poster links check passed."
        ;;
    *)
        echo "Script aborted. Please check poster URLs and prefetch settings first."
        exit 1
        ;;
esac

echo "Proceeding with frontend checks and Docker build..."

yarn tsc --noEmit &&
# yarn lint &&
yarn test &&
yarn build &&
docker build -t azalor/title-hunter-frontend:latest . &&
docker push azalor/title-hunter-frontend:latest
