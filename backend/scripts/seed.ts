import "module-alias/register";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connect } from "../src/shared/database";
import User from "../src/features/auth/models/user.model";
import { Post } from "../src/features/posts/models/post.model";
import { Comments } from "../src/features/comments/models/comment.model";
import { Reaction } from "../src/features/reaction/models/reaction-model";

dotenv.config();

const seedData = async () => {
  try {
    await connect();
    console.log("Connected to database");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comments.deleteMany({});
    await Reaction.deleteMany({});
    console.log("Existing data cleared");

    // Create test users
    console.log("Creating test users...");
    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
    ]);
    console.log(`Created ${users.length} users`);

    // Create test posts
    console.log("Creating test posts...");
    const posts = await Post.create([
      {
        userId: users[0]._id,
        title: "Getting Started with Node.js",
        slug: "getting-started-with-nodejs",
        content: `# Getting Started with Node.js

Node.js is a powerful JavaScript runtime built on Chrome's V8 engine. In this post, we'll explore the basics of Node.js and how to get started.

## What is Node.js?

Node.js allows you to run JavaScript on the server side, enabling full-stack JavaScript development.

## Key Features

- **Asynchronous and Event-Driven**: All APIs are asynchronous
- **Fast Execution**: Built on V8 engine
- **NPM**: Largest ecosystem of open source libraries

Let's dive in!`,
        htmlContent:
          "<h1>Getting Started with Node.js</h1><p>Node.js is a powerful JavaScript runtime...</p>",
        tags: ["nodejs", "javascript", "backend"],
        likesCount: 0,
        dislikesCount: 0,
        isFeatured: true,
        views: 0,
      },
      {
        userId: users[1]._id,
        title: "Understanding React Hooks",
        slug: "understanding-react-hooks",
        content: `# Understanding React Hooks

React Hooks revolutionized how we write React components. Let's explore useState and useEffect.

## useState Hook

The useState hook lets you add state to functional components.

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in functional components.

This is a game changer!`,
        htmlContent:
          "<h1>Understanding React Hooks</h1><p>React Hooks revolutionized...</p>",
        tags: ["react", "javascript", "frontend", "hooks"],
        likesCount: 0,
        dislikesCount: 0,
        isFeatured: false,
        views: 0,
      },
      {
        userId: users[0]._id,
        title: "MongoDB Best Practices",
        slug: "mongodb-best-practices",
        content: `# MongoDB Best Practices

Learn the best practices for working with MongoDB in production.

## Schema Design

- Embed vs Reference
- Indexing strategies
- Query optimization

## Performance Tips

1. Use indexes wisely
2. Limit document size
3. Use aggregation pipeline

Happy coding!`,
        htmlContent:
          "<h1>MongoDB Best Practices</h1><p>Learn the best practices...</p>",
        tags: ["mongodb", "database", "nosql"],
        likesCount: 0,
        dislikesCount: 0,
        isFeatured: true,
        views: 0,
      },
    ]);
    console.log(`Created ${posts.length} posts`);

    // Create test comments
    console.log("Creating test comments...");
    const comments = await Comments.create([
      {
        userId: users[1]._id,
        postId: posts[0]._id,
        content: "Great introduction to Node.js! Very helpful for beginners.",
        replies: [],
      },
      {
        userId: users[2]._id,
        postId: posts[0]._id,
        content:
          "I've been using Node.js for years and this is a solid overview.",
        replies: [
          {
            userId: users[0]._id,
            content: "Thanks! Glad you found it useful.",
            date: new Date(),
          },
        ],
      },
      {
        userId: users[0]._id,
        postId: posts[1]._id,
        content: "Hooks made React development so much easier!",
        replies: [
          {
            userId: users[1]._id,
            content: "Absolutely! No more class components for me.",
            date: new Date(),
          },
          {
            userId: users[2]._id,
            content: "I still prefer class components sometimes though.",
            date: new Date(),
          },
        ],
      },
      {
        userId: users[2]._id,
        postId: posts[2]._id,
        content: "These MongoDB tips are gold! Especially the indexing part.",
        replies: [],
      },
    ]);
    console.log(`Created ${comments.length} comments with nested replies`);

    // Create test reactions for posts
    console.log("Creating test reactions for posts...");
    const postReactions = await Reaction.create([
      {
        user: users[1]._id,
        post: posts[0]._id,
        reactionType: "like",
      },
      {
        user: users[2]._id,
        post: posts[0]._id,
        reactionType: "like",
      },
      {
        user: users[0]._id,
        post: posts[1]._id,
        reactionType: "like",
      },
      {
        user: users[2]._id,
        post: posts[1]._id,
        reactionType: "dislike",
      },
    ]);
    console.log(`Created ${postReactions.length} post reactions`);

    // Create test reactions for comments
    console.log("Creating test reactions for comments...");
    const commentReactions = await Reaction.create([
      {
        user: users[0]._id,
        comment: comments[0]._id,
        reactionType: "like",
      },
      {
        user: users[2]._id,
        comment: comments[1]._id,
        reactionType: "like",
      },
    ]);
    console.log(`Created ${commentReactions.length} comment reactions`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nTest Users:");
    users.forEach((user, index) => {
      console.log(
        `  ${index + 1}. ${user.name} (${user.email}) - password: password123`
      );
    });

    console.log("\nTest Posts:");
    posts.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title}`);
    });

    console.log("\nTest Comments:");
    console.log(`  Total: ${comments.length} comments`);
    console.log(
      `  Nested replies: ${comments.reduce(
        (acc, c) => acc + c.replies.length,
        0
      )} replies`
    );

    console.log("\nTest Reactions:");
    console.log(`  Post reactions: ${postReactions.length}`);
    console.log(`  Comment reactions: ${commentReactions.length}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
    process.exit(0);
  }
};

seedData();
