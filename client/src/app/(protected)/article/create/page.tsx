"use client";
import CreateArticleForm from "./_components/article-create-form";

const CreateArticle = () => {
  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-8">
            Create New Article
          </h1>
          <CreateArticleForm />
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
