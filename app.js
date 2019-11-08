const express = require("express");
const app = express();
const cors = require("cors");

const { ENVIRONMENT, PORT } = process.env;
const IS_DEVELOPMENT = ENVIRONMENT === "development";

app.use(express.json());
app.use(
  cors({
    origin: IS_DEVELOPMENT
      ? "http://localhost:3000"
      : "https://dtang-react-crud.surge.sh"
  })
);

const db = {
  posts: [
    {
      id: 1,
      title: "Post 1",
      body: "something here..."
    },
    {
      id: 2,
      title: "Post 2",
      body: "something else here..."
    }
  ],
  comments: []
};

app.get("/", response => {
  response.json("welcome");
});

app.get("/api/posts", (request, response) => {
  response.json(db.posts);
});

app.post("/api/posts", (request, response) => {
  const post = request.body;
  post.id = db.posts.length + 1;
  db.posts.push(post);
  response.json(post);
});

app.get("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.delete("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    db.posts = db.posts.filter(post => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    Object.assign(post, request.body);
    response.json(post);
  } else {
    response.status(404).send();
  }
});

//assignment 8
app.get("/api/db", (request, response) => {
  response.json(db);
});

app.post("/api/comments", (request, response) => {
  const comment = request.body;
  if (!comment.post) {
    response.status(400).send({
      errors: {
        post: "post is required"
      }
    });
  } else {
    const post = db.posts.find(post => {
      return post.id === comment.post;
    });
    if (post) {
      comment.id = db.comments.length + 1;
      db.comments.push(comment);

      response.json(comment);
    } else {
      response.status(404).send("post is not in the db");
    }
  }
});

app.get("/api/posts/:id/comments", (request, response) => {
  const postid = Number(request.params.id);
  const comments = [];
  db.comments.find(comment => {
    if (comment.post === postid) {
      comments.push(comment);
    }
  });
  response.send(comments);
});

app.delete("/api/comments/:id", (request, response) => {
  const commentid = Number(request.params.id);
  const comment = db.comments.find(comment => {
    return comment.id === commentid;
  });

  if (comment) {
    db.comments = db.comments.filter(comment => {
      return comment.id !== commentid;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put("/api/comments/:id", (request, response) => {
  const commentid = Number(request.params.id);

  const comment = db.comments.find(comment => {
    return comment.id === commentid;
  });
  // response.json(comment);
  // const updatedcomment = request.body;
  // updatedcomment[post] = comment.post;
  if (comment) {
    Object.assign(comment, request.body);
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.listen(8000);
