import Link from "next/link";
import { Play, MessageSquare, Library, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="h-8 w-8 text-primary fill-primary" />
            <span className="text-xl font-bold">Video Studio</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Sparkles className="h-4 w-4" />
          Powered by AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Create Videos with
          <span className="text-primary"> AI Chat</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Describe your video idea in a conversation, and watch it come to life.
          No video editing skills required.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="border border-input bg-background px-8 py-4 rounded-lg text-lg font-medium hover:bg-accent transition-colors"
          >
            Log in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Chat with AI</h3>
            <p className="text-muted-foreground">
              Describe your video idea in natural language. Our AI understands
              what you want to create.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Generate Video</h3>
            <p className="text-muted-foreground">
              Click generate and watch your video render in real-time with
              professional animations.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Library className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Save to Library</h3>
            <p className="text-muted-foreground">
              All your videos are saved to your personal library. Download and
              share anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-primary rounded-2xl p-12 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join thousands of creators making stunning videos with AI.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Start Creating Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Video Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
