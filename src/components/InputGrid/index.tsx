import { Fragment, useState } from "react";
import { Preference, Item, PreferenceValue } from "../../types";
import { id } from "../../util";
import { Pref } from "../Pref";
import "./style.css";

interface InputGridProps {
  members: Item[];
  activities: Item<number>[];
  preferences: Preference[];
  onPreferencesChange: (prefs: Preference[]) => unknown;
}

export function InputGrid(props: InputGridProps) {
  const [lastPref, setLastPref] = useState(PreferenceValue.Yes);

  const cyclePref = (activity: Item<number>, member: Item) => {
    const memberPreference = props.preferences.find(
      (c) => c.activity === activity.id && c.member === member.id
    ) || {
      member: member.id,
      activity: activity.id,
      value: undefined,
    };
    const memberPref = memberPreference.value;
    const nextPref =
      memberPref === undefined ? lastPref : getNextPref(memberPref);

    if (nextPref !== PreferenceValue.Unknown) setLastPref(nextPref);

    props.onPreferencesChange([
      ...props.preferences.filter(
        (c) => !(c.activity === activity.id && c.member === member.id)
      ),
      { ...memberPreference, value: nextPref },
    ]);
  };

  return (
    <div
      className="grid InputGrid"
      style={{
        gridTemplateColumns: `repeat(${props.members.length + 1}, min-content)`,
      }}
    >
      <div></div>

      {props.members.map((member) => (
        <div key={member.id} className="grid--top-header">
          {member.name}
        </div>
      ))}

      <div className="grid--hr" />

      {props.activities.map((activity) => (
        <Fragment key={activity.id}>
          <div className="grid--left-header">{activity.name}</div>

          {props.members.map((member) => (
            <div
              key={id(activity, member)}
              className="grid--cell InputGrid--pref"
              onClick={() => cyclePref(activity, member)}
            >
              <Pref
                pref={
                  props.preferences.find(
                    (c) => c.activity === activity.id && c.member === member.id
                  )?.value ?? PreferenceValue.Unknown
                }
              />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

function getNextPref(pref: PreferenceValue | undefined) {
  switch (pref) {
    case PreferenceValue.Yes:
      return PreferenceValue.Maybe;
    case PreferenceValue.Maybe:
      return PreferenceValue.No;
    case PreferenceValue.No:
      return PreferenceValue.Unknown;
    case PreferenceValue.Unknown:
      return PreferenceValue.Yes;
    default:
      return PreferenceValue.Yes;
  }
}
