import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;


app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: true })); 


let posts = [];

app.get("/", (req, res) => {
   res.render("index", { posts });  
});
//To create a blog
app.get("/create", (req, res) => {
    res.render("createBlog");
})


//To upload blogs
app.post("/submit", (req, res) => {
    
    const title = req.body.title;
    const content = req.body.content;
    const date = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year : "numeric",
        month: "long",
        day: "numeric",
    });

    if (!title || !content) {
        return res.status(400).send("Title and content are required.");
    }
    posts.push({ title, content, date });
    res.redirect("/");
});

//To edit the blog
app.get("/edit/:id", (req, res)=>{
    const id = req.params.id;
    const post = posts[id];

    if(!post){
        return res.status(404).send("Post not found!");
    }
    res.render("edit", {post, index: id});
});

app.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    const content = req.body.content;

    if (!title || !content) {
        return res.status(400).send("Title and content are required.");
    }

    if (!posts[id]) {
        return res.status(404).send("Post not found");
    }

    // Update the post
    posts[id] = { title, content };
    console.log("Post Updated:", { id, title, content });

    res.redirect("/");
});

//Delete the post 
app.post("/delete/:id", (req, res)=>{
    const id = req.params.id;

    if (id < 0 || id >= posts.length || isNaN(id)) {
        return res.status(404).send("Post not found");
    }
    posts.splice(id, 1);
    console.log(`Post ${id} deleted.`);
    
    res.redirect("/");
})


app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
