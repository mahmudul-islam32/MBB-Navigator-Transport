import React, { useState } from "react";
import stationData from "../data/stationNames.json";

function SearchForm({ onSearch }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isDeparture, setIsDeparture] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const formatDateTime = (date, time) => {
    // Create a new Date object for the selected date
    const selectedDate = new Date(date);

    // Extract hours and minutes from the time input
    const [hours, minutes] = time.split(":").map(Number);

    // Set the hours and minutes of the selected date
    selectedDate.setHours(hours);
    selectedDate.setMinutes(minutes);

    // Format the date and time in a way that works consistently across browsers
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return selectedDate.toLocaleString("en-US", options);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDateTime = formatDateTime(date, time);

    // Set loading state to true when submitting
    setIsLoading(true);

    // Call the search function (assuming it returns a promise)
    try {
      await onSearch(from, to, formattedDateTime, isDeparture);
    } catch (error) {
      // Handle any errors here
      console.error("Error:", error);
    } finally {
      // Set loading state to false when the search is complete (success or error)
      setIsLoading(false);
    }
  };

  const handleFromChange = (e) => {
    const inputValue = e.target.value;
    setFrom(inputValue);

    // Filter station names for matching suggestions
    const suggestions = Object.entries(stationData)
      .filter(([id, name]) =>
        name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 5); // Limit to the top 5 matching suggestions

    setFromSuggestions(suggestions);
  };

  const handleToChange = (e) => {
    const inputValue = e.target.value;
    setTo(inputValue);

    // Filter station names for matching suggestions
    const suggestions = Object.entries(stationData)
      .filter(([id, name]) =>
        name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 5); // Limit to the top 5 matching suggestions

    setToSuggestions(suggestions);
  };

  return (
    <div className="form-sub">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="from" className="form-label">
            Starting Point
          </label>
          <input
            type="text"
            className="form-control"
            id="from"
            placeholder="Enter starting point"
            value={from}
            onChange={handleFromChange}
          />
          <ul className="station-list">
            {fromSuggestions.map(([id, name]) => (
              <li
                key={id}
                onClick={() => {
                  setFrom(name);
                  setFromSuggestions([]);
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-3">
          <label htmlFor="to" className="form-label">
            Destination
          </label>
          <input
            type="text"
            className="form-control"
            id="to"
            placeholder="Enter destination"
            value={to}
            onChange={handleToChange}
          />
          <ul className="station-list">
            {toSuggestions.map(([id, name]) => (
              <li
                key={id}
                onClick={() => {
                  setTo(name);
                  setToSuggestions([]);
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-3">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inputType"
              id="departure"
              value="departure"
              checked={isDeparture}
              onChange={() => setIsDeparture(true)}
            />
            <label className="form-check-label" htmlFor="departure">
              Departure
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="inputType"
              id="arrival"
              value="arrival"
              checked={!isDeparture}
              onChange={() => setIsDeparture(false)}
            />
            <label className="form-check-label" htmlFor="arrival">
              Arrival
            </label>
          </div>
          <label className="form-label d-h">
            {isDeparture ? "Departure" : "Arrival"} Date
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="form-label d-h">
            {isDeparture ? "Departure" : "Arrival"} Time
            <input
              type="time"
              className="form-control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          {isLoading ? "Searching..." : "Search Journeys"}
        </button>
      </form>
    </div>
  );
}

export default SearchForm;
