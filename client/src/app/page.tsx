import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import BlogGrid from "@/features/home/components/BlogGrid";

const page = () => {
  return (
    <div className="flex flex-col items-center min-h-screen w-full">
      <NavBar />
      <main className="flex flex-col items-center w-full h-full bg-body">
        {/* <Hero/> */}
        <BlogGrid />
      </main>
      <Footer />
    </div>
  );
};

export default page;
