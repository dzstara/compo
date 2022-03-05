import { PreferenceValue } from "../../types";
import "./style.css";

interface PrefProps {
  pref: PreferenceValue;
}

export function Pref(props: PrefProps) {
  switch (props.pref) {
    case PreferenceValue.Yes:
      return <div className="Pref Pref--yes">Yes</div>;
    case PreferenceValue.Maybe:
      return <div className="Pref Pref--maybe">Maybe</div>;
    case PreferenceValue.No:
    default:
      return <div className="Pref Pref--no">No</div>;
  }
}
