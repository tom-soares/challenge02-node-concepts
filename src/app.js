const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");
const { request } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  if ( !isUuid(id) ) {
    return response.status(400).json({ error: 'Invalid Id' });
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id );

  if (repositoryIndex < 0) {
    return response.status(400).json({ erro: 'Repository not found' });
  }

  return next();
}

function validateFields(request, response, next) {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs) {
    return response.status(400).json({ erro: 'Missing Fields' });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", validateFields, (request, response) => {
  
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = {
    ...repositories[repositoryIndex],
    title: title,
    url: url,
    techs: techs
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {

  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = repositories[repositoryIndex];
  repository.likes += 1;

  return response.status(200).json(repository);
});

module.exports = app;
