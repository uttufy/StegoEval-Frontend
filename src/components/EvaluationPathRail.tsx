interface EvaluationPathRailProps {
  activeStep: number;
}

const SEGMENTS = [
  { label: "1.", nodes: [1, 2, 3, 4] },
  { label: "2.", nodes: [5, 6, 7, 8] },
  { label: "3.", nodes: [9, 10, 11, 12] },
  { label: "4.", nodes: [13, 14, 15] }
];

export function EvaluationPathRail({ activeStep }: EvaluationPathRailProps) {
  return (
    <section className="path-rail" aria-label="Evaluation path">
      <p className="path-title">Your Path</p>
      <div className="path-groups">
        {SEGMENTS.map((segment, segmentIndex) => {
          const isActive = activeStep >= segment.nodes[0];
          return (
            <article className={`path-group ${isActive ? "is-active" : ""}`} key={segment.label}>
              <strong>{segment.label}</strong>
              <div>
                {segment.nodes.map((node, nodeIndex) => {
                  const isCurrent = node === activeStep;
                  return (
                    <span key={node} className={isCurrent ? "is-current" : ""}>
                      {isCurrent ? "AI" : nodeIndex === 0 && segmentIndex === 0 ? "1" : node}
                    </span>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
      <aside className="path-goal" aria-label="Current goal">
        <p>The Goal</p>
        <strong>One Epic Model Card (10%)</strong>
      </aside>
    </section>
  );
}
