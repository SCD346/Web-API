const {Client} = require('pg');
const express = require ("express");
const app = express();
app.use(express.json());

const client = new Client({
    "user" : "postgres",
    "password" : "password",
    "host" : "Stephens-MBP",
    "port" : 5432,
    "database" : "todo"
});

app.get("/todos", async (req, res) => {
    const rows = await readTodos();
    res.setHeader("content-type", "application/json");
                                   //might need to change back--> BEFORE "application/json", now set as "text/html"
                                    //WHY CHANGE? was getting error "Resource interpreted as Document but transferred with MIME type application/json..."
    res.send(JSON.stringify(rows));
});


//CREATE
app.post("/todos", async (req, res) => {
    let result = {};
    try{
        const reqJson = req.body;
        result.success = await createTodo(reqJson.todo);
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



 


app.listen(8080, () => console.log("Web server is listening.. on port 8080"));

start();
async function start() {
    await connect();
    const todos = await readTodos();
    console.log(todos);

    const successCreate = await createTodo("Buy groceries");
    console.log(`Creating was ${successCreate}`);
    
    const successDelete = await deleteTodo(6);
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

async function readTodos() {
    try {
    const results = await client.query("select id, text from todos");
    return results.rows;
    }
    catch(e){
        return [];
    }
}

async function createTodo(todoText){

    try {
        await client.query("insert into todos (text) values ($1)", [todoText]);
        return true;
        }
        catch(e){
            return false;
        }
}



async function deleteTodo(id){

    try {
        await client.query("delete from todos where id = $1", [id]);
        return true;
        }
        catch(e){
            return false;
        }
}