import { site, about, facts } from '@/data/site'

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about-inner">
        <h2 className="display about-title" id="about-title">
          About <em>me</em>
        </h2>

        <div className="about-grid">
          <div className="about-bio">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {site.resume ? (
              <a className="btn btn--dark" href={site.resume} download>
                Download my resume
              </a>
            ) : (
              <a className="btn btn--dark" href={`mailto:${site.email}?subject=Resume request`}>
                Ask for my resume
              </a>
            )}
          </div>

          <dl className="about-facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="skills">
          <h3 className="skills-title">What I work with</h3>
          <dl className="skills-list">
            {about.skills.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
