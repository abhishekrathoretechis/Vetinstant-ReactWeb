import moment from "moment";
import React, { useState, useEffect } from "react";

const CalenderComponent = ({ handleDateClick, selectedDate }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [days, setDays] = useState([]);
  //   const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setEndDate(nextWeek);
  }, []);

  useEffect(() => {
    const currentDate = new Date(startDate);
    const weekDays = [];
    while (currentDate <= endDate) {
      weekDays.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setDays(weekDays);
  }, [startDate, endDate]);

  return (
    <div style={{ display: "flex" }}>
      {days.map((day, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            textAlign: "center",
          }}
        >
          <div className="f14 blue-color txt-semi-bold">
            {day.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)}
          </div>
          <div
            className={
              selectedDate && selectedDate.toDateString() === day.toDateString()
                ? "selected f14 txt-semi-bold cursor mt10 mb10"
                : "transparent f14 txt-semi-bold cursor mt10 mb10"
            }
            onClick={() => handleDateClick(day)}
          >
            {day.getDate()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalenderComponent;
