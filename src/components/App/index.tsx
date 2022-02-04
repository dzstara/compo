import useLocalStorageState from "use-local-storage-state";
import { Parameters } from "../../types";
import { Input } from "../Input";
import { Output } from "../Output";
import "./style.css";

export function App() {
  const [parameters, setParameters] = useLocalStorageState<Parameters>(
    "parameters",
    {
      fair: true,
      members: [],
      activities: [],
      preferences: [],
      exclusivities: [],
      inclusivities: [],
    }
  );

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
