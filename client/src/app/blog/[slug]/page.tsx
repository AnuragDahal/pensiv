"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Heart, MessageSquare } from "lucide-react";
import { FormEventHandler, useState } from "react";

const BlogPost = () => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(42);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "John Doe",
      avatar: "https://github.com/shadcn.png",
      content: "Great article!",
      timestamp: "2 hours ago",
    },
  ]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleComment: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setComments([
      {
        id: comments.length + 1,
        user: "Current User",
        avatar: "https://github.com/shadcn.png",
        content: comment,
        timestamp: "Just now",
      },
      ...comments,
    ]);
    setComment("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="prose lg:prose-xl mb-8">
        <h1 className="text-4xl font-bold mb-4">How to Master Web Design</h1>

        <div className="flex items-center gap-4 mb-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span>John Doe</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Aug 12, 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>4 min read</span>
          </div>
        </div>

        <img
          src="/image-generator-freepik-7.jpeg"
          alt="Blog header"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        <div className="prose max-w-none">
          # Mastering Web Design: A Comprehensive Guide Web design is an
          ever-evolving field that blends creativity, technical skills, and
          user-centric thinking. In this guide, we will explore the key
          principles, tools, and best practices to help you master the art of
          web design. --- ## **1. Understanding the Foundations** ### **1.1
          Design Principles** - **Visual Hierarchy**: Organize elements based on
          their importance to guide users' attention. - **Balance**: Achieve
          harmony in your layouts using symmetry or asymmetry. - **Contrast**:
          Use contrasting colors, sizes, and shapes to highlight important
          elements. - **Alignment**: Ensure proper alignment for a clean,
          professional appearance. - **Repetition**: Reinforce design
          consistency across the site. ### **1.2 User Experience (UX)** - Focus
          on simplicity and ease of navigation. - Conduct user research to
          understand your target audience. - Optimize for accessibility,
          ensuring your site is usable for everyone. --- ## **2. Choosing the
          Right Tools** ### **2.1 Design Software** - **Figma**: A cloud-based
          tool for collaborative design. - **Adobe XD**: Powerful software for
          wireframing and prototyping. - **Sketch**: Ideal for macOS users
          looking for vector-based design tools. ### **2.2 Front-End Development
          Tools** - **HTML & CSS**: The backbone of any website. - **JavaScript
          Frameworks**: Libraries like React.js or Vue.js enhance interactivity.
          - **CSS Frameworks**: Tools like Tailwind CSS or Bootstrap speed up
          styling. --- ## **3. Staying Ahead with Trends** ### **3.1 Responsive
          Design** - Ensure your website looks great on devices of all sizes. -
          Use media queries and flexible grids for adaptability. ### **3.2 Dark
          Mode** - Provide users with light and dark themes for better
          readability. ### **3.3 Micro-Interactions** - Add subtle animations or
          feedback to enhance user engagement. ### **3.4 Minimalism** - Keep
          designs clean and focused to improve usability and aesthetics. --- ##
          **4. Testing and Optimization** ### **4.1 Usability Testing** -
          Conduct A/B tests to evaluate design decisions. - Gather user feedback
          to refine your website. ### **4.2 Performance Optimization** -
          Compress images and minify code. - Use tools like Lighthouse to
          measure and improve performance. ### **4.3 Accessibility Checks** -
          Follow Web Content Accessibility Guidelines (WCAG). - Use tools like
          Axe or Wave to identify accessibility issues. --- ## **5. Building a
          Design Portfolio** ### **5.1 Showcase Your Best Work** - Highlight a
          diverse range of projects. - Include case studies to explain your
          design process. ### **5.2 Create a Personal Brand** - Use a consistent
          style across your portfolio. - Build an online presence with a
          professional website and social media profiles. --- ## **6. Never Stop
          Learning** ### **6.1 Follow Industry Leaders** - Subscribe to blogs
          like Smashing Magazine or Web Designer Depot. - Join communities like
          Dribbble, Behance, or Reddit’s web design forums. ### **6.2 Take
          Online Courses** - Platforms like Coursera, Udemy, and freeCodeCamp
          offer excellent resources. ### **6.3 Practice Regularly** - Work on
          personal projects to experiment with new styles and techniques. --- ##
          **Conclusion** Mastering web design requires a blend of creativity,
          technical expertise, and an eagerness to learn. By focusing on the
          principles outlined above, using the right tools, and staying updated
          with trends, you can create stunning, user-friendly websites that
          leave a lasting impression.
        </div>
      </article>

      <div className="border-t pt-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={liked ? "default" : "outline"}
            onClick={handleLike}
            className="flex items-center gap-2"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {likes}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {comments.length}
          </Button>
        </div>

        <form onSubmit={handleComment} className="mb-8">
          <div className="flex gap-4">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
            />
            <Button type="submit">Comment</Button>
          </div>
        </form>

        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>{comment.user[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{comment.user}</h4>
                  <p className="text-sm text-gray-500">{comment.timestamp}</p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">{comment.content}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
