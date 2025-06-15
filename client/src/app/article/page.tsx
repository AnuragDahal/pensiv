"use client";
import { useEffect, useState } from "react";
import ArticleCard from "./_components/ArticleCard";
import axios from "axios";

const Articles = () => {
  useEffect(() => {
    const res = axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
  }, []);

  const [article, setArticle] = useState([]);

  return (
    <div className="mt-14 pt-4 md:pt-6 lg:pt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ArticleCard
        id="1"
        title="Understanding React Hooks"
        excerpt="A deep dive into React Hooks and how they can simplify your component logic."
        coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
        author={{
          name: "Jane Doe",
          avatar: "/images/jane-doe.jpg",
        }}
        category="React"
        date="2023-10-01"
        estimatedReadTime={5}
        featured={true}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          id="1"
          title="Understanding React Hooks"
          excerpt="A deep dive into React Hooks and how they can simplify your component logic."
          coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
          author={{
            name: "Jane Doe",
            avatar: "/images/jane-doe.jpg",
          }}
          category="React"
          date="2023-10-01"
          estimatedReadTime={5}
          featured={false}
        />
        <ArticleCard
          id="1"
          title="Understanding React Hooks"
          excerpt="A deep dive into React Hooks and how they can simplify your component logic."
          coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
          author={{
            name: "Jane Doe",
            avatar: "/images/jane-doe.jpg",
          }}
          category="React"
          date="2023-10-01"
          estimatedReadTime={5}
          featured={false}
        />
        <ArticleCard
          id="1"
          title="Understanding React Hooks"
          excerpt="A deep dive into React Hooks and how they can simplify your component logic."
          coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
          author={{
            name: "Jane Doe",
            avatar: "/images/jane-doe.jpg",
          }}
          category="React"
          date="2023-10-01"
          estimatedReadTime={5}
          featured={false}
        />
        <ArticleCard
          id="1"
          title="Understanding React Hooks"
          excerpt="A deep dive into React Hooks and how they can simplify your component logic."
          coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
          author={{
            name: "Jane Doe",
            avatar: "/images/jane-doe.jpg",
          }}
          category="React"
          date="2023-10-01"
          estimatedReadTime={5}
          featured={false}
        />
        <ArticleCard
          id="1"
          title="Understanding React Hooks"
          excerpt="A deep dive into React Hooks and how they can simplify your component logic."
          coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
          author={{
            name: "Jane Doe",
            avatar: "/images/jane-doe.jpg",
          }}
          category="React"
          date="2023-10-01"
          estimatedReadTime={5}
          featured={false}
        />
        <ArticleCard
          id="1"
          title="Understanding React Hooks"
          excerpt="A deep dive into React Hooks and how they can simplify your component logic."
          coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
          author={{
            name: "Jane Doe",
            avatar: "/images/jane-doe.jpg",
          }}
          category="React"
          date="2023-10-01"
          estimatedReadTime={5}
          featured={false}
        />
        <ArticleCard
          id="1"
          title="Understanding React Hooks"
          excerpt="A deep dive into React Hooks and how they can simplify your component logic."
          coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
          author={{
            name: "Jane Doe",
            avatar: "/images/jane-doe.jpg",
          }}
          category="React"
          date="2023-10-01"
          estimatedReadTime={5}
          featured={false}
        />
        <ArticleCard
          id="1"
          title="Understanding React Hooks"
          excerpt="A deep dive into React Hooks and how they can simplify your component logic."
          coverImage="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210714205336/Things-You-Should-Know-About-React-Hooks.png"
          author={{
            name: "Jane Doe",
            avatar: "/images/jane-doe.jpg",
          }}
          category="React"
          date="2023-10-01"
          estimatedReadTime={5}
          featured={false}
        />
      </div>
    </div>
  );
};

export default Articles;
