import { PlusIcon, UserIcon, XIcon } from "@heroicons/react/solid";
import { Fragment, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Item } from "../../types";
import { toggle } from "../../util";
import "./style.css";

interface InputActivitiesProps {
  activities: Item<number>[];
  exclusivities: string[][];
  inclusivities: string[][];
  onActivityChange: (value: Item<number>[]) => unknown;
  onExclusivityChange: (value: string[][]) => unknown;
  onInclusivityChange: (value: string[][]) => unknown;
}

export function InputActivities(props: InputActivitiesProps) {
  const [activityNameInput, setActivityNameInput] = useState<string>("");
  const [activityNumberInput, setActivityNumberInput] = useState<number>(3);

  const removeValue = (id: string) => {
    props.onActivityChange(props.activities.filter((i) => i.id !== id));
  };

  const addValue = () => {
    if (!activityNameInput.trim().length || isNaN(activityNumberInput)) return;

    props.onActivityChange([
      ...props.activities,
      { id: uuidv4(), name: activityNameInput, info: activityNumberInput },
    ]);

    setActivityNameInput("");
  };

  return (
    <>
      {props.activities.length > 0 && (
        <div
          className="grid InputActivities"
          style={{
            gridTemplateColumns: `repeat(5, min-content)`,
          }}
        >
          <div className="grid--left-header">Activity</div>
          <div className="grid--top-header">
            <UserIcon />
          </div>
          <div className="grid--top-header">Exclusivity</div>
          <div className="grid--top-header">Inclusivity</div>
          <div />

          <div className="grid--hr" />

          {props.activities.map((activity) => (
            <Fragment key={activity.id}>
              <div className="grid--left-header">{activity.name}</div>
              <div className="grid--cell">
                <input
                  type="number"
                  min="1"
                  value={activity.info}
                  onChange={(e) =>
                    props.onActivityChange(
                      props.activities.map((a) =>
                        a.id === activity.id
                          ? { ...a, info: parseInt(e.target.value, 10) }
                          : a
                      )
                    )
                  }
                />
              </div>
              <div className="grid--cell">
                {props.exclusivities.map((exclusivity, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={exclusivity.includes(activity.id)}
                      onChange={(e) => {
                        props.onExclusivityChange(
                          props.exclusivities.map((ex, n) =>
                            n === i
                              ? toggle(ex, activity.id, e.target.checked)
                              : ex
                          )
                        );
                      }}
                    />
                    {props.exclusivities.length > 1 && <span>#{i + 1}</span>}
                  </label>
                ))}
              </div>
              <div className="grid--cell">
                {props.inclusivities.map((inclusivity, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      checked={inclusivity.includes(activity.id)}
                      onChange={(e) => {
                        props.onInclusivityChange(
                          props.inclusivities.map((inc, n) =>
                            n === i
                              ? toggle(inc, activity.id, e.target.checked)
                              : inc
                          )
                        );
                      }}
                    />
                    {props.inclusivities.length > 1 && <span>#{i + 1}</span>}
                  </label>
                ))}
              </div>
              <div className="grid--cell">
                <button
                  className="btn btn-dangerous btn-small"
                  onClick={() => removeValue(activity.id)}
                >
                  Remove <XIcon />
                </button>
              </div>
            </Fragment>
          ))}
        </div>
      )}

      <div className="InputActivities--input">
        <input
          type="text"
          value={activityNameInput}
          placeholder="Activity name"
          onChange={(e) => setActivityNameInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") addValue();
          }}
        />
        <input
          type="number"
          value={activityNumberInput}
          min={1}
          onChange={(e) => setActivityNumberInput(parseInt(e.target.value, 10))}
          onKeyPress={(e) => {
            if (e.key === "Enter") addValue();
          }}
        />
        <button className="btn" onClick={addValue}>
          Add <PlusIcon />
        </button>
      </div>
    </>
  );
}
