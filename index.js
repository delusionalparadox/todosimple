"use strict";
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const todofile = path.join(__dirname, "./todo.json");


app.use(express.json());
const loadtodo = () => {
  try {
    if (!fs.existsSync(todofile)) {
      return [];
    } else {
      const data = fs.readFileSync(todofile, "utf-8");
      if (!data.trim()) {
        return [];
      } else {
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.error(`Error loading todos: ${error.message}`);
    return [];
  }
};

const saveTodos = (todo) => {
  try {
    fs.writeFileSync(todofile, JSON.stringify(todo, null, 2));
  } catch (error) {
    console.error(`Error saving todos: ${error.message}`);
  }
};

app.get("/list", (req, res) => {
  const todos = loadtodo();
  res.json(todos);
});

app.get("/list/:id/:msg", (req, res) => {
  const todos = loadtodo();
  console.log(todos); // Log the loaded todos to check its structure
  if (Array.isArray(todos)) {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (todo) {
      res.json(todo);
      
    } else {
      res.status(404).json("todo not found");
    }
  } else {
    res.status(500).json("Error: Todos is not an array");
  }
});

app.post("/add",(req,res)=>{
    const todos= loadtodo();
    const current=new Date();
    const newtodo={
        id:current.getDay(),
        task:req.body.task,
        completed:false,
    }
    todos.push(newtodo);
    saveTodos(todos);
    res.status(200).json(newtodo)
});
app.post("/put/:id",(req,res)=>{
    const todos= loadtodo();
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (todo) {
        todo.completed=req.body.completed!==undefined? req.body.completed:todo.completed;
        todo.task=req.body.task||todo.task;
        saveTodos(todos);
        res.json(todo);

        
    }else{
        res.status(404).json(
            "todo not found"
        )
    }
    
});


app.post("/delete/:id",(req,res)=>{
    const todos= loadtodo();
    const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
    if (index!==-1) {
       const deletedTodo=todos.splice(index,1)[0];
       saveTodos(todos);
       res.json(deletedTodo);

        
    }else{
        res.status(404).json(
            "todo not found"
        )
    }
    
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
