export function Resources() {
  return (
    <div className="resources">
      <h2>Job Search Resources</h2>
      <ul className="resources-list">
        <li>
          <a
            href="https://shane-tips-for-jobs.lovable.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Shane&apos;s Tips for Job Hunters</strong>
          </a>
          <span className="resource-description">
            Not sure how to get started? Check out Shane&apos;s tips for job seekers.
          </span>
        </li>
        <li>
          <a
            href="https://www.defensetechjobs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Defense Tech Jobs</strong>
          </a>
          <span className="resource-description">
            Comprehensive job board with the latest roles across the defense tech ecosystem.
            A must-follow, must-subscribe resource with extensive coverage.
          </span>
        </li>
        <li>
          <a
            href="https://www.tectonicdefense.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Tectonic Defense</strong>
          </a>
          <span className="resource-description">
            News and analysis covering the defense technology industry.
          </span>
        </li>
      </ul>
    </div>
  );
}
