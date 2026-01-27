import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SEO } from '../components/SEO'

export function About() {
  return (
    <div className="min-h-screen relative">
      <SEO
        title="About AI Coding Skills - newth.ai skills"
        description="Learn what AI coding assistant skills are, how they differ from MCP servers, and how to extend Gemini CLI and Claude Code with specialized capabilities."
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
            About Skills
          </h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                What are AI coding assistant skills?
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skills are portable instruction sets that extend the capabilities of AI coding assistants like Gemini CLI and Claude Code. They're simple markdown files containing specialized knowledge, best practices, and workflows that your AI assistant can follow to help you with specific tasks.
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Think of skills as giving your AI assistant expertise in a particular domain. Whether it's creating GSAP animations, building MCP servers, or generating algorithmic art, skills provide the context and instructions your assistant needs to help you effectively.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                How skills differ from MCP servers
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
                When to use skills vs MCPs
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Choose skills when you need to give your AI assistant knowledge about how to do something, like following best practices for a framework, writing code in a particular style, or understanding domain-specific concepts. Skills excel at providing guidance, patterns, and workflows.
              </p>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Choose MCP servers when you need your AI assistant to actively interact with external systems, fetch real-time data, or perform actions that require API access. MCPs are ideal for integrations with databases, third-party services, or any system that requires live connections.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                How skills work
              </h2>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Skills are markdown files that get installed into your AI assistant's configuration directory. When you ask your assistant for help with a task, it reads the relevant skill files to understand how to approach the problem.
              </p>
              <p
                className="text-lg leading-relaxed mb-4"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Each skill contains structured instructions, examples, and best practices. The AI assistant uses this information to provide more accurate, consistent, and helpful responses for the specific domain covered by the skill.
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
                One command installs skills to your assistant's configuration directory.
              </p>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
                Benefits of skills
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-sage)' }}
                  >
                    Portable
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    Skills are just files. Copy them anywhere, share them with your team, or version control them with your project.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-mint)' }}
                  >
                    No Server
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    No processes to run, no ports to manage, no infrastructure to maintain. Skills work entirely within your AI assistant.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    Instant
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: 'var(--color-grey-300)' }}
                  >
                    Install in seconds with a single command. Your AI assistant immediately has access to new capabilities.
                  </p>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--color-grey-200)' }}
              >
                Ready to extend your AI assistant?{' '}
                <Link
                  to="/"
                  className="link-hover"
                  style={{ color: 'var(--color-white)' }}
                >
                  Browse available skills
                </Link>{' '}
                and install them with a single command.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
