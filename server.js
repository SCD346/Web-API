const {Client} = require('pg');
const express = require ("express");
const app = express();
app.use(express.json());

const client = new Client({
    "user" : "postgres",
    "password" : "password",
    "host" : "Stephens-MBP",
    "port" : 5432,
    "database" : "postgres"
});




//CREATE
app.post("/jobs", async (req, res) => {
    let result = {};
    try{
        const reqJson = req.body;
        result.success = await createJob(reqJson.job);
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json");
        //                            //might need to change back--> BEFORE "application/json", now set as "text/html"
        //                             //WHY CHANGE? was getting error "Resource interpreted as Document but transferred with MIME type application/json..."
        res.send(JSON.stringify(result));
    }
   
});

//READ
app.get("/jobs", async (req, res) => {
    const rows = await readJobs();
    res.setHeader("content-type", "application/json");
                                   //might need to change back--> BEFORE "application/json", now set as "text/html"
                                    //WHY CHANGE? was getting error "Resource interpreted as Document but transferred with MIME type application/json..."
    res.send(JSON.stringify(rows));
});
 


app.listen(8080, () => console.log("Web server is listening.. on port 8080"));

start();
async function start() {
    await connect();
    const jobs = await readJobs();
    console.log(jobs);

    const successCreate = await createJob("Buy groceries");
    console.log(`Creating was ${successCreate}`);
    
    const successDelete = await deleteJob(6);
    console.log(`Deleting was ${successDelete}`);
    
}

async function connect() {
    try {
        await client.connect(); 
    }
    catch(e) {
        console.error(`Failed to connect ${e}`);
    }
}

async function readJobs() {
    try {
    const results = await client.query("select title, description, company, id from jobs");
    return results.rows;
    }
    catch(e){
        return [];
    }
}

async function createJob(jobText){

    try {
        await client.query("insert into jobs (title, description, company, id) values ($1, $2, $3, $4)", [jobText]);
        return true;
        }
        catch(e){
            return false;
        }
}



async function deleteJob(id){

    try {
        await client.query("delete from jobs where id = $1", [id]);
        return true;
        }
        catch(e){
            return false;
        }
}