import { useState } from "react";

export default function RatingPopup({ visible, onSubmit, onCancel }) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState({ text: "", isError: true });

  if (!visible) return null;

  const handleSubmit = () => {
    const num = Number(value);
    if (!value || num < 1 || num > 10 || !Number.isInteger(num)) {
      setMessage({ text: "Enter a whole number (1–10)", isError: true });
      return;
    }
    onSubmit(num);
    setMessage({ text: `Saved: ${num}/10`, isError: false });
    setValue("");
  };

  const handleCancel = () => {
    setValue("");
    setMessage({ text: "", isError: true });
    onCancel();
  };

  return (
    <div className="rate-popup">
      <div className="rate-popup-content">
        <h4>Rate this movie</h4>
        <input
          type="number"
          min="1"
          max="10"
          step="1"
          placeholder="1-10"
          className="rateInput"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <br />
        <br />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleCancel}>Cancel</button>
        <p className="rateError" style={{ color: message.isError ? "red" : "lightgreen" }}>
          {message.text}
        </p>
      </div>
    </div>
  );
}
