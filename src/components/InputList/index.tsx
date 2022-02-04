import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon, XIcon } from "@heroicons/react/solid";
import { Item } from "../../types";
import "./style.css";

interface InputListProps<T extends any> {
  value: Item<T>[];
  onChange: (value: Item<T>[]) => unknown;
}

export function InputList<T extends any>(props: InputListProps<T>) {
  const [inputValue, setInputValue] = useState<string>("");

  const removeValue = (id: string) => {
    props.onChange(props.value.filter((i) => i.id !== id));
  };

  const addValue = () => {
    if (!inputValue.trim().length) return;

    props.onChange([
      ...props.value,
      { id: uuidv4(), name: inputValue, info: 3 as T },
    ]);

    setInputValue("");
  };

  return (
    <>
      <ul className="InputList--list">
        {props.value.map((item) => (
          <li key={item.id} className="InputList--item">
            <span>{item.name}</span>
            <button onClick={() => removeValue(item.id)}>
              <XIcon />
            </button>
          </li>
        ))}
      </ul>

      <div className="InputList--input-wrapper">
        <input
          className="InputList--input"
          type="text"
          placeholder="Member name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
