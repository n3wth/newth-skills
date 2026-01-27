import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SEO } from '../components/SEO'

export function About() {
  return (
    <div className="min-h-screen relative">
      <SEO
        title="What are AI Skills? - newth.ai"
        description="Skills are portable instruction sets that teach your AI coding assistant new capabilities. No servers, no infrastructure. Just markdown files that work immediately."
        canonicalUrl="/about"
        keywords={['AI skills', 'MCP servers', 'Gemini CLI', 'Claude Code', 'AI coding assistant']}
      />
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
      <Nav />

      <main className="px-6 md:px-12 pt-28 md:pt-32 pb-24">
        <div className="max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-grey-400)' }}
          >
            <span>&larr;</span> Back to skills
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-8 tracking-tight">
            What are Skills?
          </h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                Domain expertise for your AI
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skills are portable instruction sets that extend what your AI coding assistant can do. They're markdown files containing specialized knowledge, best practices, and workflows that Gemini CLI and Claude Code can follow to help you with specific tasks.
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Think of skills as giving your AI expertise in a particular domain. Whether it's creating GSAP animations, building MCP servers, or generating algorithmic art, skills provide the context and instructions your assistant needs to help you effectively.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                Skills vs MCP servers
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                MCP (Model Context Protocol) servers are powerful tools that give AI assistants the ability to interact with external systems, APIs, and databases. They run as separate processes and require server infrastructure to operate.
              </p>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skills take a fundamentally different approach. Instead of running external servers, skills are static markdown files that provide instructions and context directly to your AI assistant. This makes them lightweight, portable, and instantly available without any server setup or maintenance.
              </p>
              <div className="glass-card p-6 md:p-8 mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3
                      className="text-lg font-medium mb-3"
                      style={{ color: 'var(--color-mint)' }}
                    >
                      Skills
                    </h3>
                    <ul
                      className="space-y-2 text-base"
                      style={{ color: 'var(--color-grey-200)' }}
                    >
                      <li>Markdown files with instructions</li>
                      <li>No server required</li>
                      <li>Instant installation</li>
                      <li>Works offline</li>
                      <li>Zero maintenance</li>
                      <li>Portable across machines</li>
                    </ul>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-medium mb-3"
                      style={{ color: 'var(--color-coral)' }}
                    >
                      MCP Servers
                    </h3>
                    <ul
                      className="space-y-2 text-base"
                      style={{ color: 'var(--color-grey-200)' }}
                    >
                      <li>Running server processes</li>
                      <li>Can access external APIs</li>
                      <li>Real-time data integration</li>
                      <li>Requires server infrastructure</li>
                      <li>Needs ongoing maintenance</li>
                      <li>More complex setup</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                When to use each
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                <strong style={{ color: 'var(--color-white)' }}>Use skills</strong> when you need to teach your AI how to do something: following framework best practices, writing code in a particular style, or understanding domain-specific concepts. Skills excel at guidance, patterns, and workflows.
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                <strong style={{ color: 'var(--color-white)' }}>Use MCP servers</strong> when your AI needs to interact with external systems, fetch real-time data, or perform actions that require API access. MCPs are ideal for databases, third-party services, and live connections.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                How it works
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skills are markdown files that get installed into your AI assistant's configuration directory. When you ask for help, your assistant reads the relevant skill to understand how to approach the problem.
              </p>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Each skill contains structured instructions, examples, and best practices. Your AI uses this to provide more accurate and consistent help for that specific domain.
              </p>
              <div className="command-box p-4 mt-6">
                <code
                  className="text-sm font-mono"
                  style={{ color: 'var(--color-grey-200)' }}
                >
                  curl -fsSL https://skills.newth.ai/install.sh | bash
                </code>
              </div>
              <p
                className="text-sm mt-3"
                style={{ color: 'var(--color-grey-400)' }}
              >
                Skills are installed to your assistant's config directory. Takes about 5 seconds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                Why skills?
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-sage)' }}
                  >
                    Just files
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    Copy them anywhere, share with your team, or version control them alongside your project.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-mint)' }}
                  >
                    Zero infrastructure
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    No processes, no ports, no servers. Skills run entirely within your AI assistant.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Works immediately
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    Install with one command. Your AI has new capabilities in seconds.
                  </p>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Ready to give your AI new capabilities?{' '}
                <Link
                  to="/"
                  className="link-hover"
                  style={{ color: 'var(--color-white)' }}
                >
                  Browse all skills
                </Link>{' '}
                and start building.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
