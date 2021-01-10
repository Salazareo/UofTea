# **Structure**

## **src/UofTeaServer.ts**
Class to house all initialization scripts for server

## **src/index.ts**
Entry point to host server

## **src/controllers**
Controllers for all API endpoints

## **src/database**
Houses all the schemas, and helpers for DB operations

# **Database Table Schemas (up for change)**

## **Users**

    *Why are these split?*
    
SQL tables were structured as they were because storage at one point was really expensive, so you wanted to structure shit to use less, and leave the black magic of a DBMS to translate your query into the fastest lookup or write it could do.

NoSQL offers different benefits than SQL, in particular, DynamoDB focuses on partitionability and scalability. What does this mean? It means shit can go fast, but to do so it also needs to be structured to fit our specific usecase more personally.

So with that said, I broke it up like this because of 3 reasons:
1.     Direct querying: meaning when logging in, we don't have to scan the table, we simply look for the key, likewise when dealing with user profiles or whatever, we simply query for userName, since we hide email for anonymity (think of DynamoDB as a funky hashTable)
2.     Anonymity: as discussed, our users can leave anonymous reviews, so really at no point should anything other than the login need to know their email, so this makes sense so no accidental passing of the email occurs
3.     Security: DynamoDB does not encrypt rows like some other DBMS, so we have to store these somewhat securely, since we'll only deal with the credentials on log in, a malicious attack trying to dump data is much less likely if we split the tables
### ***UserCredentials***

* **email:** Primary/Partition Key
* **password:** Salted, hashed passwords ideally
* **userName:** Username attached to email

Some other bits are also here for verification and password reset

### ***UserInfo***
These probably will need to change, but dynamo is dynamic so theres not really a schema aside from the partition and sort keys, so just add whatever other things need to be added whenever

* **userName:** Primary/Partition Key
* **verified:** whether or not email is verified
* **darkmode:** darkmode
* **isUofT:** whether or not email is UofT email

Again anything else can be added on the fly