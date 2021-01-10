### Clean prior build
rm -rf ./build/
rm -rf ./ZIP_ME/

### Copy correct AWS credentials
mv ./server/src/AWS_Config.ts ./
cp ./AWS_Deploy.ts ./server/src/AWS_Config.ts

### Transpile .ts to .js for server
tsc --sourceMap false

# Revert credentials
cp ./AWS_Config.ts ./server/src/AWS_Config.ts
rm ./AWS_Config.ts

### Bundle FrontEnd ###
# Create the directory for React
mkdir -p ./build/public/react/

# Navigate to the react directory
cd ./client/

# Build React code
npm run build

# Rename the folder
mv build UofTea

# Move the contains to the build/ dir to ZIP_ME
mv UofTea ../build/public/react/
mkdir ../ZIP_ME
mv ../build ../ZIP_ME/
cp ../package.json ../ZIP_ME/package.json

#Uncomment this line if we copying new data
#cp -r ../server/src/database/baseData ../ZIP_ME/build/database/

### Generate Random secret
cd ..
x=$(
    tr -dc A-Za-z0-9 </dev/urandom | head -c 128
    echo ''
)
y=$(
    tr -dc A-Za-z0-9 </dev/urandom | head -c 128
    echo ''
)
sed -i "s/{REPLACED_ON_DEPLOY}/$x/g" ./ZIP_ME/build/secrets.js
sed -i "s/{REPLACED_ALSO}/$y/g" ./ZIP_ME/build/secrets.js
