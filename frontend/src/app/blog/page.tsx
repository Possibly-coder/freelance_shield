import PageShell from "@/components/PageShell";
import Link from "next/link";

const posts = [
  {
    slug: "#",
    date: "Coming Soon",
    title: "Why We're Building FreelanceShield",
    excerpt: "The freelance economy has a trust problem. Both sides get burned. Here's how we're fixing it with milestone-based escrow.",
    tag: "Announcement",
  },
  {
    slug: "#",
    date: "Coming Soon",
    title: "How Milestone-Based Escrow Works",
    excerpt: "A deep dive into the payment flow -- from funding to approval to auto-release. Why this model protects both freelancers and clients.",
    tag: "Product",
  },
  {
    slug: "#",
    date: "Coming Soon",
    title: "Upwork Takes 20%. Here's the Math on Why That's Insane.",
    excerpt: "Breaking down what freelancers actually lose to platform fees and why unbundled escrow at 1-2% is the future.",
    tag: "Insights",
  },
  {
    slug: "#",
    date: "Coming Soon",
    title: "The Auto-Release Timer: Our Most Requested Feature",
    excerpt: "What happens when a client goes silent after you deliver? We built a system-level solution that enforces fair timelines.",
    tag: "Product",
  },
];

export default function BlogPage() {
  return (
    <PageShell>
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-blue-400/80 tracking-widest uppercase mb-3">Blog</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Thoughts on freelancing & payments</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Insights, product updates, and stories from the freelance payment trenches.
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post, i) => (
          <div key={i} className="card hover:border-[#243656] transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-medium">
                {post.tag}
              </span>
              <span className="text-xs text-gray-600">{post.date}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{post.excerpt}</p>
          </div>
        ))}
      </div>

      <div className="glass p-10 text-center mt-16 glow-blue">
        <h2 className="text-2xl font-bold mb-3">Blog launching soon</h2>
        <p className="text-gray-400 mb-6">Join the waitlist to get notified when we publish our first posts.</p>
        <Link href="/" className="btn-primary text-lg px-8 py-3">Join the Waitlist</Link>
      </div>
    </PageShell>
  );
}
