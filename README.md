# **UofTea**
A small webapp meant to help students find adequate course and professor info as well as reviews and ratings to make course selection and browsing easier.

## **Tech Stack**
### **Frontend**
React app using:
* Typescript cuz js is annoying
* Redux cuz react states are annoying
* Semantic UI cuz its nice to look at
### **Backend**
NodeJS Server using:
* Typescript, see reason above
* Express, cuz its simple to use and mantain
### **Storage**
DynamoDB as our database because:
* Ease of setup
* say we got a lot of users its like distributed or whatever
* our stack spells out NERD and thats cool

Redis as our cache because:
* node-caching takes up resources
* multiple nodes do multiple caches which we dont want
* dynamoDB pricey for searching so caching is like, less pricey
* you can add an extra R for NERRD


## **SET UP**
### ***PLESE READ THIS AND THE OTHER 2 READMES IN /server AND IN /client***

## **Local Dev Setup**

### ***Local DB***
Download the newest local dynamoDB from aws and run it

https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
    
You can also download the jar, add it to /database and run `npm run start-db` but only on windows cuz java is weird

### ***Dev environment***
Redis is OPTIONAL, but HIGHLY ENCOURAGED, run a default redis instance on your local machine, theres a few ways to do it, so do what works best for you. For Windows I use docker with the generic redis image. https://koukia.ca/installing-redis-on-windows-using-docker-containers-7737d2ebc25e

Run:
1. `npm i`
2. `npm run installReact`
3. `npm run start-db` OR start a dynamoDB instance locally
4. Start your redis server
5. `npm run start-server`
6. `npm run start-react`


## **DEPLOYMENT**

Were hosting this on AWS, however potentially you can host the server and content anywhere, just use AWS for DynamoDB

### ***AWS***
PreReqs:
* AWS account obvi...
* ElasticBeanstalk env running node

Steps:
1. Make sure you have a AWS_Deploy.ts file in root containing your AWS Config.
2. run ./buildForProd.sh
3. there should be a folder named ZIP_ME, zip the files inside
4. deploy the zip via elasticBeanstalk UI in aws console to your env OR use the aws EB cli to deploy it

Theres others steps for the dns and what not, but like, just google that

That's all, enjoy.

# **NOTE**

If installing node module for the react side, please do so in the subdirectory that react is in ie `./client`
Otherwise:

1. It will probably not recognize it
2. The structure will get messy, so harder to mantain
