import React, { useState } from "react";
import axios from "axios";
import SearchForm from "./components/SearchForm"; // Import SearchForm first
import JourneyList from "./components/JourneyList"; // Then import JourneyList
import Footer from "./components/Footer";
import PublicTransportInGermany from "./components/PublicTransportInGermany";

function App() {
  const [journeys, setJourneys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedDateTime, setFormattedDateTime] = useState(""); // Add state for formattedDateTime

  // Define a function to update formattedDateTime
  const updateFormattedDateTime = (newFormattedDateTime) => {
    setFormattedDateTime(newFormattedDateTime);
  };

  const searchJourneys = async (from, to, formattedDateTime, isDeparture) => {
    setIsLoading(true);
    try {
      const fromResponse = await axios.get(
        `https://v5.db.transport.rest/locations?query=${from}`
      );
      //  console.log(fromResponse);
      const toResponse = await axios.get(
        `https://v5.db.transport.rest/locations?query=${to}`
      );

      const fromStopId = fromResponse.data[0]?.id;
      const toStopId = toResponse.data[0]?.id;
      //  console.log(formattedDateTime);

      if (fromStopId && toStopId) {
        const apiFormattedDateTime = new Date(formattedDateTime).toISOString();
        const journeysResponse = await axios.get(
          `https://v5.db.transport.rest/journeys?from=${fromStopId}&to=${toStopId}&results=50&${
            isDeparture ? "departure" : "arrival"
          }=${apiFormattedDateTime}`
        );
        // console.log(journeysResponse.data.journeys);
        setJourneys(journeysResponse.data.journeys);
        setIsLoading(false);
        setFormattedDateTime(formattedDateTime);
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
        <div className="col-md-12">
          <div className="logo">
            <h1 className="mt-4 mb-4 logo">
              <span className="main-logo">MBB</span> <span>Travel With Me</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="row main">
        <div className="col-md-5">
          <SearchForm onSearch={searchJourneys} />
        </div>
        <div className="col-md-7">
          <JourneyList
            journeys={Array.isArray(journeys) ? journeys : []}
            isLoading={isLoading}
            formattedDateTime={formattedDateTime}
          />
        </div>
      </div>
      <PublicTransportInGermany />
      <Footer />
    </div>
  );
}

export default App;
