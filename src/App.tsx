import React from "react";
import WeekdayDateRangePicker from "./WeekdayDateRangePicker";
import "./styles/WeekdayDateRangePicker.css";

function App() {
  const handleChange = (
    range: DateRange,
    weekends: Date[]
  ) => {
    console.log("Selected Range:", range);
    console.log("Weekend Dates:", weekends);
  };

  return (
    <div className="App">
      <WeekdayDateRangePicker
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
