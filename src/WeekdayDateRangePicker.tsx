import React, { useState } from "react";

type DateRange = [Date, Date];
type WeekendDates = Date[];

interface PredefinedRange {
  label: string;
  range: DateRange;
}

interface WeekdayDateRangePickerProps {
  predefinedRanges?: PredefinedRange[];
  onChange: (
    range: DateRange,
    weekends: WeekendDates
  ) => void;
}

const WeekdayDateRangePicker: React.FC<
  WeekdayDateRangePickerProps
> = ({ predefinedRanges = [], onChange }) => {
  const [startDate, setStartDate] =
    useState<Date | null>(null);
  const [endDate, setEndDate] =
    useState<Date | null>(null);
  const [displayedYear, setDisplayedYear] =
    useState<number>(new Date().getFullYear());
  const [displayedMonth, setDisplayedMonth] =
    useState<number>(new Date().getMonth());

  const handleDateClick = (date: Date) => {
    if (
      startDate &&
      !endDate &&
      date > startDate &&
      isWeekday(date)
    ) {
      setEndDate(date);
      onChange(
        [startDate, date],
        getWeekendDates(startDate, date)
      );
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const handleYearChange = (year: number) => {
    setDisplayedYear(year);
  };

  const handleMonthChange = (month: number) => {
    setDisplayedMonth(month);
  };

  const handlePredefinedRangeClick = (
    range: DateRange
  ) => {
    setStartDate(range[0]);
    setEndDate(range[1]);
    onChange(
      range,
      getWeekendDates(range[0], range[1])
    );
  };

  const handleLast7DaysClick = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // Last 7 days
    setStartDate(startDate);
    setEndDate(endDate);
    onChange(
      [startDate, endDate],
      getWeekendDates(startDate, endDate)
    );
  };

  const handleLast30DaysClick = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 29); // Last 30 days
    setStartDate(startDate);
    setEndDate(endDate);
    onChange(
      [startDate, endDate],
      getWeekendDates(startDate, endDate)
    );
  };

  const isWeekday = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  };

  const getWeekendDates = (
    start: Date,
    end: Date
  ) => {
    const weekendDates: WeekendDates = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      if (!isWeekday(currentDate)) {
        weekendDates.push(new Date(currentDate));
      }
      currentDate.setDate(
        currentDate.getDate() + 1
      );
    }
    return weekendDates;
  };

  const getDaysInMonth = (
    year: number,
    month: number
  ) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthDays = (
    year: number,
    month: number
  ) => {
    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();
    const daysInMonth = getDaysInMonth(
      year,
      month
    );
    const monthDays: (Date | null)[] =
      Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      monthDays.push(new Date(year, month, i));
    }
    return monthDays;
  };

  const monthDays = getMonthDays(
    displayedYear,
    displayedMonth
  );

  return (
    <div className="WeekdayDateRangePicker">
      <h2>Select a Weekday Date Range</h2>
      <div className="calendar-container">
        <div>
          <button
            onClick={() =>
              handleYearChange(displayedYear - 1)
            }
          >
            Prev Year
          </button>
          <button
            onClick={() =>
              handleMonthChange(
                displayedMonth - 1
              )
            }
          >
            Prev Month
          </button>
          <span>{`${displayedYear} - ${
            displayedMonth + 1
          }`}</span>
          <button
            onClick={() =>
              handleMonthChange(
                displayedMonth + 1
              )
            }
          >
            Next Month
          </button>
          <button
            onClick={() =>
              handleYearChange(displayedYear + 1)
            }
          >
            Next Year
          </button>
        </div>
        <div className="calendar-row">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          {monthDays.map((day, index) => (
            <div
              key={index}
              onClick={() =>
                day && handleDateClick(day)
              }
              className={`calendar-cell ${
                day && isWeekday(day)
                  ? "weekday"
                  : "weekend"
              } ${
                day &&
                day >= startDate &&
                day <= endDate
                  ? "selected"
                  : ""
              }`}
            >
              {day && day.getDate()}
            </div>
          ))}
        </div>
        <div className="selected-dates">
          {startDate && endDate && (
            <>
              <h4>Selected Range:</h4>
              <div>{`${startDate.toDateString()} - ${endDate.toDateString()}`}</div>
              <h4>Weekend Dates:</h4>
              <ul className="weekend-dates">
                {getWeekendDates(
                  startDate,
                  endDate
                ).map((date, index) => (
                  <li
                    key={index}
                    className="weekend-date"
                  >
                    {date.toDateString()}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="predefined-ranges">
        {predefinedRanges.map((range, index) => (
          <button
            key={index}
            onClick={() =>
              handlePredefinedRangeClick(
                range.range
              )
            }
            className="predefined-range-btn"
          >
            {range.label}
          </button>
        ))}
        <button
          onClick={handleLast7DaysClick}
          className="predefined-range-btn"
        >
          Last 7 Days
        </button>
        <button
          onClick={handleLast30DaysClick}
          className="predefined-range-btn"
        >
          Last 30 Days
        </button>
      </div>
    </div>
  );
};

export default WeekdayDateRangePicker;
