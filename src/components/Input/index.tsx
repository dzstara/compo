import {
  InformationCircleIcon,
  LightningBoltIcon,
} from "@heroicons/react/solid";
import { useState } from "react";
import { Parameters, Item, Preference } from "../../types";
import { InputActivities } from "../InputActivities";
import { InputClusivity } from "../InputClusitivies";
import { InputGrid } from "../InputGrid";
import { InputList } from "../InputList";
import "./style.css";

interface InputProps {
  params: Parameters;
  onParametersChange: (params: Parameters) => unknown;
}

export function Input(props: InputProps) {
  const [members, setMembers] = useState<Item[]>(props.params.members);
  const [activities, setActivities] = useState<Item<number>[]>(
    props.params.activities
  );
  const [preferences, setPreferences] = useState<Preference[]>(
    props.params.preferences
  );
  const [exclusivities, setExclusivities] = useState<string[][]>(
    props.params.exclusivities
  );
  const [inclusivities, setInclusivities] = useState<string[][]>(
    props.params.inclusivities
  );

  return (
    <>
      <h2 className="Input--title">Team Members</h2>

      <div className="Input--members">
        <InputList
          value={members}
          onChange={(members) => setMembers(members)}
        />
      </div>

      <h2 className="Input--title">Activities</h2>

      <div className="Input--activities">
        <InputActivities
          activities={activities}
          exclusivities={exclusivities}
          inclusivities={inclusivities}
          onActivityChange={(activities) => setActivities(activities)}
          onExclusivityChange={(exclusivities) =>
            setExclusivities(exclusivities)
          }
          onInclusivityChange={(inclusivities) =>
            setInclusivities(inclusivities)
          }
        />
      </div>

      <h3 className="Input--title">Exclusivities</h3>

      <div>
        <p>
          <InformationCircleIcon /> Activities that <em>cannot</em> have member
          overlap
        </p>

        <InputClusivity
          label={"Exclusivity groups"}
          clusivities={exclusivities}
          onClusivityChange={setExclusivities}
        />
      </div>

      <h3 className="Input--title">Inclusivities</h3>

      <div>
        <p>
          <InformationCircleIcon /> Activities that <em>can</em> have member
          overlap
        </p>

        <InputClusivity
          label={"Inclusivity groups"}
          clusivities={inclusivities}
          onClusivityChange={setInclusivities}
        />
      </div>

      <h2 className="Input--title">Preferences</h2>

      {members.length && activities.length ? (
        <InputGrid
          members={members}
          activities={activities}
          preferences={preferences}
          onPreferencesChange={(prefs) => {
            setPreferences(prefs);
          }}
        />
      ) : (
        <div className="subtle-text">
          Add some team members and activities first.
        </div>
      )}

      <div />

      <div>
        <button
          className="btn btn-primary Input--submit"
          disabled={
            members.length === 0 ||
            activities.length === 0 ||
            preferences.length === 0
          }
          onClick={() => {
            props.onParametersChange({
              ...props.params,
              members,
              activities,
              preferences,
              exclusivities,
              inclusivities,
            });
          }}
        >
          <LightningBoltIcon /> Solve constraints
        </button>
      </div>
    </>
  );
}
