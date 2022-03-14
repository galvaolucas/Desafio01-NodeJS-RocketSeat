const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user){
    return response.status(400).json({error: "User do not exists"})
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some(user => user.username === username);

  if (userAlreadyExists){
    return response.status(400).json({ error: "user already exists"});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    username: user.username,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id: todoId } = request.params;
  const { title, deadline } = request.body;

  //o metodo findIndex retorna -1 se não encontrar nada

  const indexOfTodo = user.todos.findIndex(todo => todo.id === todoId);
  
  if(indexOfTodo < 0){
    return response.status(404).json({error : "todo doesn't exists"})
  }

  const todoToChangeInfo = user.todos[indexOfTodo];

  title ? todoToChangeInfo.title = title : false;
  deadline ? todoToChangeInfo.deadline = deadline : false;

  return response.status(201).json(todoToChangeInfo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id: todoId } = request.params;

  const indexOfTodo = user.todos.findIndex(todo => todo.id === todoId);

  if(indexOfTodo < 0){
    return response.status(404).json({error : "todo doesn't exists"})
  }

  user.todos[indexOfTodo].done = true;

  return response.status(201).json(user.todos[indexOfTodo]);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const IndexOfTodoToBeDeleted = user.todos.findIndex(todo => todo.id === id);

  if(IndexOfTodoToBeDeleted < 0){
    return response.status(404).json({error : "todo doesn't exists"})
  }

  user.todos.splice(IndexOfTodoToBeDeleted, 1);

  return response.status(204).send();
});

module.exports = app;