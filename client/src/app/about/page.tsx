"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          About Pensiv
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
          A platform where sharing content is easy and accessible to everyone.
        </p>
      </div>
    </div>
  );
}
