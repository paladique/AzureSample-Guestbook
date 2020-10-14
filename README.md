# Data Driven Guestbook

[Guestbooks](https://en.wikipedia.org/wiki/Guestbook) are a way for visitors to a event or location to leave their mark, typically with their name and message. Around the late 1990s/early 2000s, digital guestbooks were pretty popular.

This simplified demo is a digital guestbook that walks through different types of data, using the Azure Data platform.

## How it works

This demo is single page application (SPA), written in JavaScript that reads from MySQL and Cosmos DB databases.

Features:

- Grabs all entries from both databases, displays which database it came from, and sorts them by date
- Adds new entries to database of choice and updates page
- Notifies all users of new entries using Web Sockets

## Azure Resources Uses

- [Azure DB for MySQL](https://docs.microsoft.com/en-us/azure/mysql/overview?WT.mc_id=ca-github-jasmineg)
- [Cosmos DB (Mongo DB API)](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction?WT.mc_id=ca-github-jasmineg)
- [Azure App Service (optional)](https://docs.microsoft.com/en-us/azure/app-service/?WT.mc_id=ca-github-jasmineg)

## How to Run

### Requirements

- [Azure Account](https://azure.microsoft.com/en-us/free/?WT.mc_id=ca-github-jasmineg)
- NodeJS
- Clone/download this repo

## Create and configure Azure resources

*Recommended: Once your Azure resources are deployed, pin it to your dashboard in the Azure Portal*

1. Click this button to create a MySQL and CosmosDB Database in Azure, wait a few minutes for your services to be created. **Keep note of the resource group you created so you can find your databases later!**

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fpaladique%2FSample-IntroData%2Fmaster%2Ftemplate%2FdeployTemplate.json)
   
2. After your services has been created, go to the [Azure portal](portal.azure.com)

## Configure MySQL

3. Open your MySQL Server (starts with `mysql-`).
4. Download this [certificate](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) and copy to the root of this directory. [***Why you have to do this***](https://docs.microsoft.com/en-us/azure/mysql/howto-configure-ssl?WT.mc_id=ca-github-jasmineg)
5. On the left menu, visit **Connection Security** and click **+ Add client IP*** to add a firewall rule for your ip address.
6. Set **Allow access to Azure Services** to **On**.
7. Go back to the **Overview** in MySQL. Your **server name** and **server admin login name**
8. Click on the terminal icon at the top of the portal to open the Cloud Shell Terminal.
9. Connect to MySQL with the following command replace the `servername` and `server admin login name` with the values in the overview of MySQL:

`mysql -h servername.mysql.database.azure.com -u adminname@servername -p`

You're now connected to your MySQL server. The following commands will set up the database and table:

`USE guestdb;`

```sql
CREATE TABLE guestbook
(
    id serial PRIMARY KEY,
    entrydate datetime default now(),
    sender VARCHAR(100),
    message VARCHAR(200)
);
```

In the .env file, enter the following values:

```javascript
SQLHost = [servername from overview]
SQLUser = [server admin login name from overview]
SQLPassword = [password for admin login]
```

## Visit Cosmos DB

10. Open your Cosmos DB database (starts with `cosmos-`).
11. On the left menu, visit **Connection String** and copy the **Primary conenction string**

In the .env file, enter the following values:

`CosmosConn= [connection string]`

## Run the code

Navigate to the code in your favorite command line tool (You will already be there if using VS Code's terminal)

it should look something like
`some\path\directory\Sample-IntroData`

Enter the following commands:
`npm install`
`npm start`

Visit [localhost:3000](http://localhost:3000/)

### Deploy this site to Azure

Checkout this documentation on how to [deploy this to Azure](https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?WT.mc_id=ca-github-jasmineg&pivots=platform-linux#deploy-to-azure)!

## Learn more

- [Azure SQL Fundamentals](aka.ms/sdc/SqlFun)
- [Azure Data Fundamentals](https://docs.microsoft.com/en-us/learn/paths/azure-data-fundamentals-explore-core-data-concepts/?WT.mc_id=ca-github-jasmineg)

Contributions are welcome!