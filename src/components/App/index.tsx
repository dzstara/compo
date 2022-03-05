import useLocalStorageState from "use-local-storage-state";
import { Parameters } from "../../types";
import { Input } from "../Input";
import { Output } from "../Output";
import "./style.css";

const defaultParameters: Parameters = {
  version: 2,
  fair: true,
  members: [],
  activities: [],
  preferences: [],
  exclusivities: [],
  inclusivities: [],
};

export function App() {
  const [rawParameters, setParameters] = useLocalStorageState<Parameters>(
    "parameters",
    defaultParameters
  );

  const parameters =
    rawParameters.version !== defaultParameters.version
      ? defaultParameters
      : rawParameters;

  return (
    <div className="App">
      <h1 className="App--title">Compo</h1>

      <div className="App--layout">
        <Input
          params={parameters}
          onParametersChange={(params) => setParameters(params)}
        />

        {parameters.activities.length > 0 &&
          parameters.members.length > 0 &&
          parameters.preferences.length > 0 && (
            <Output parameters={parameters} />
          )}
      </div>

      <div className="App--spacer" />

      <div className="App--footer">
        App by{" "}
        <a href="https://dzstara.xyz" target="_blank" rel="noreferrer">
          dzstara
        </a>
        , repo on{" "}
        <a
          href="https://github.com/dzstara/compo"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </div>
    </div>
  );
}
