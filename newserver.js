const {Pool} = require("pg")
const express = require ("express")
const app = express();
app.use(express.json())

//dbread role with SELECT 
const dbReadPool = new Pool({
    "user": "read1Jobs",
    "password" : "password",
    "host" : "Stephens-MBP",
    "port" : 5432,
    "database" : "postgres"
})

//dbdelete role with SELECT, DELETE
const dbDeletePool = new Pool({
    "user": "delete1Jobs",
    "password" : "password",
    "host" : "Stephens-MBP",
    "port" : 5432,
    "database" : "postgres"
})

//dbcreate role with INSERT

const dbCreatePool = new Pool({
    "user": "create1Jobs",
    "password" : "password",
    "host" : "Stephens-MBP",
    "port" : 5432,
    "database" : "postgres"
})

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))

app.get("/jobs", async (req, res) => {
    const rows = await readJobs();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
})



app.post("/jobs", async (req, res) => {
    let result = {}
    try{
        const reqJson = req.body;
        result.success = await createTodo(reqJson.job)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
   
})





app.delete("/jobs", async (req, res) => {
    let result = {}
    try{

        const reqJson = req.body;
        result.success = await deleteTodo(reqJson.id)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(result))
    }
   
})


app.listen(8080, () => console.log("Web server is listening.. on port 8080"))

start()

async function start() {
    await connect();
    /*
    const jobs = await readJobs();
    console.log(jobs)
    const successCreate = await createTodo("Go to trader joes")
    console.log(`Creating was ${successCreate}`)
    const successDelete = await deleteTodo(1)
    console.log(`Deleting was ${successDelete}`)
    */
}

async function connect() {
    try {
        await dbCreatePool.connect();
        await dbDeletePool.connect();
        await dbReadPool.connect();
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

async function readJobs() {
    try {
    const results = await dbReadPool.query("select title, description, company, id from jobs");
    return results.rows;
    }
    catch(e){
        return [];
    }
}

async function createTodo(jobText){

    try {
        await dbCreatePool.query("insert into jobs (text) values ($1)", [jobText]);
        return true
        }
        catch(e){
            return false;
        }
}



async function deleteTodo(id){

    try {
        await dbDeletePool.query("delete from jobs where id = $1", [id]);
        return true
        }
        catch(e){
            return false;
        }
}