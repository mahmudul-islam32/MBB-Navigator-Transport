import React, { useState } from "react";
import axios from "axios";
import SearchForm from "./components/SearchForm"; // Import SearchForm first
import JourneyList from "./components/JourneyList"; // Then import JourneyList

function App() {
  const [journeys, setJourneys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchJourneys = async (from, to, formattedDateTime, isDeparture) => {
    setIsLoading(true);
    try {
      const fromResponse = await axios.get(
        `https://v5.db.transport.rest/locations?query=${from}`
      );
      console.log(fromResponse);
      const toResponse = await axios.get(
        `https://v5.db.transport.rest/locations?query=${to}`
      );

      const fromStopId = fromResponse.data[0]?.id;
      const toStopId = toResponse.data[0]?.id;
      console.log(formattedDateTime);

      if (fromStopId && toStopId) {
        const journeysResponse = await axios.get(
          `https://v5.db.transport.rest/journeys?from=${fromStopId}&to=${toStopId}&results=10&${
            isDeparture ? "departure" : "arrival"
          }=${formattedDateTime}`
        );
        console.log(journeysResponse.data.journeys);
        setJourneys(journeysResponse.data.journeys);
        setIsLoading(false);
      } else {
        console.error("Invalid locations");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <h1 className="mt-4 mb-4 logo">🚎 Transport App 🚃</h1>
      </div>

      <div className="row main">
        <div className="col-md-5">
          <SearchForm onSearch={searchJourneys} />
        </div>
        <div className="col-md-7">
          <JourneyList
            journeys={Array.isArray(journeys) ? journeys : []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
