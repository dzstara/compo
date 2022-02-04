import { resize } from "../../util";
import "./style.css";

interface InputClusivityProps {
  label: string;
  clusivities: string[][];
  onClusivityChange: (value: string[][]) => unknown;
}

export function InputClusivity(props: InputClusivityProps) {
  return (
    <label className="InputClusivity">
      <span>{props.label}</span>
      <input
        type="number"
        value={props.clusivities.length}
        min={0}
        onChange={(e) => {
          const newLength = parseInt(e.target.value, 10);
          console.log(
            props.clusivities,
            resize(props.clusivities, newLength, [])
          );
          props.onClusivityChange(resize(props.clusivities, newLength, []));
        }}
      />
    </label>
  );
}
