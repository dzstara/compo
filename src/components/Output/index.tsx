import { Fragment, useEffect, useState } from "react";
import { solver } from "../../solver";
import { Parameters, Result } from "../../types";
import "./style.css";

interface OutputProps {
  parameters: Parameters;
}

export function Output(props: OutputProps) {
  const [results, setResults] = useState<Result[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      setError(false);
      const results = solver(props.parameters);
      setResults(results);
    } catch (err) {
      setError(true);
    }
  }, [props.parameters]);

  if (error)
    return (
      <>
        <div />

        <div className="Output--error">
          We couldn't solve the given constraints.
        </div>
      </>
    );

  if (!results) return null;

  const maxMembers = Math.max(...results.map((r) => r.info));

  return (
    <>
      <h2>Proposed line-up</h2>

      <div
        className="grid Output--grid"
        style={{
          gridTemplateColumns: `repeat(${maxMembers + 1}, min-content)`,
        }}
      >
        <div></div>

        {Array.from({ length: maxMembers }).map((_, n) => (
          <div className="grid--top-header" key={n}>
            M{n + 1}
          </div>
        ))}

        <div className="grid--hr" />

        {results.map((result) => (
          <Fragment key={result.id}>
            <div className="grid--left-header">{result.name}</div>

            {result.participatingMembers.map((member) => (
              <div key={member.id}>{member.name}</div>
            ))}

            {Array.from({
              length: Math.max(
                0,
                maxMembers - result.participatingMembers.length
              ),
            }).map((_, n) => (
              <div className="grid--cell Output--na" key={n}>
                N/A
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <div />

      <div>
        <h3>Copy paste friendly format:</h3>
        <div className="Output--copy">
          {results.map((result) => (
            <Fragment key={result.id}>
              **{result.name}**
              <br />
              {result.participatingMembers
                .map((member) => member.name)
                .join(" - ")}
              <br />
              <br />
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
