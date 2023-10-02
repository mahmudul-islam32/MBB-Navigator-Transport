import React, { useState, useEffect } from "react";

function JourneyList({ journeys, isLoading }) {
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [journeysToShow, setJourneysToShow] = useState(3);

  const handleJourneyClick = (journey) => {
    if (selectedJourney === journey) {
      // If the same journey is clicked again, deselect it
      setSelectedJourney(null);
    } else {
      setSelectedJourney(journey);
    }
  };

  function formatTime(time, delay) {
    const formattedTime = new Date(time).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    if (delay) {
      return (
        <span className="time">
          {formattedTime}{" "}
          <span className="delay">+{Math.floor(delay / 60)} min</span>
        </span>
      );
    } else {
      return (
        <span className="time">
          {formattedTime} <span className="delay">+0 min</span>
        </span>
      );
    }
  }

  function calculateDuration(selectedJourney) {
    const departureTime = new Date(selectedJourney.legs[0].departure);
    const arrivalTime = new Date(
      selectedJourney.legs[selectedJourney.legs.length - 1].arrival
    );
    const durationInMilliseconds = arrivalTime - departureTime;
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
    return durationInHours.toFixed(2); // Display duration with two decimal places
  }

  const handleShowMore = () => {
    // Increment the number of journeys to show by, e.g., 3 more
    setJourneysToShow(journeysToShow + 3);
  };

  // Define a mapping of transport types to class names
  const transportTypeClassMapping = {
    bus: "bus",
    ic: "ic",
    ice: "ice",
    re: "re",
    rb: "rb",
    s: "s",
    f: "f",
    u: "u",
    t: "t",
    taxi: "taxi",
    me: "me",
    ec: "ec",
    tl: "tl",
    tlx: "tlx",
    str: "str",
    opb:"opb",
    ire:"ire",
    mex:"mex",
  };

  return (
    <div className="journey-details">
      {isLoading ? (
        // Show loading image while waiting for data
        <div className="introduction-text">
          <h1>Travel With Us</h1>
          <p>
            Traveling with our app provides a seamless and efficient way to
            explore Germany's extensive transportation network. With our app,
            you can easily plan your journeys, whether it's for business or
            leisure. You can check the availability of connections, departure
            and arrival times, and even track real-time updates. Our app's
            user-friendly interface makes it simple to input your starting point
            and destination, select departure or arrival times, and view
            multiple travel options. Say goodbye to the stress of navigating
            unfamiliar transportation routes; our app empowers you to make
            informed travel decisions. Experience the convenience and
            reliability of traveling through Germany with our app, where your
            journey is just a few taps away.
          </p>
        </div>
      ) : (
        <ul>
          {journeys.slice(0, journeysToShow).map((journey, journeyIndex) => (
            <li
              key={journeyIndex}
              className={`journey-item ${
                selectedJourney === journey ? "selected" : ""
              }`}
            >
              <span
                className="journey-info"
                onClick={() => handleJourneyClick(journey)}
              >
                <div className="departure-arrival-container">
                  <div className="departure-time-container">
                    <span
                      className={`departure-time ${
                        journey.legs[0].departureDelay > 0 ? "red" : "green"
                      }`}
                    >
                      {formatTime(
                        journey.legs[0].departure,
                        journey.legs[0].departureDelay
                      )}
                    </span>
                  </div>
                  <div className="details-container">
                    <span className="change">
                      chg. {journey.legs.length - 1}
                    </span>
                    <span className="duration">
                      Dur. {calculateDuration(journey)} h
                    </span>
                  </div>
                  <div className="arrival-time-container">
                    <span
                      className={`arrival-time ${
                        journey.legs[journey.legs.length - 1].arrivalDelay > 0
                          ? "red"
                          : "green"
                      }`}
                    >
                      {formatTime(
                        journey.legs[journey.legs.length - 1].arrival,
                        journey.legs[journey.legs.length - 1].arrivalDelay
                      )}
                    </span>
                  </div>
                </div>
                <div className="fahr-names-container">
                  {journey.legs.map((leg, legIndex) => (
                    <div key={legIndex} className="fahr-name-item">
                      {leg.line && (
                        <span
                          className={`transport-type ${
                            transportTypeClassMapping[
                              leg.line.productName.toLowerCase()
                            ] || ""
                          }`}
                        >
                          {leg.line.productName}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {selectedJourney === journey && (
                  <div className="journey-details-container">
                    <div className="transport-info">
                      {journey.legs.map((leg, legIndex) => (
                        <div key={legIndex}>
                          {leg.line && (
                            <div className="details-info">
                              <div className="departure-details">
                                <span
                                  className={`arrival-time ${
                                    journey.legs[journey.legs.length - 1]
                                      .arrivalDelay > 0
                                      ? "red"
                                      : "green"
                                  }`}
                                >
                                  {formatTime(leg.departure)}
                                </span>
                                <span className="name">{leg.origin.name}</span>
                                <span className="departure-platform">
                                  Platform: {leg.departurePlatform}
                                </span>
                              </div>
                              <span
                                className={`transport-name ${
                                  transportTypeClassMapping[
                                    leg.line.productName.toLowerCase()
                                  ] || ""
                                }`}
                              >
                                {leg.line.name}
                              </span>
                              <div className="arriavl-details">
                                <span
                                  className={`arrival-time ${
                                    journey.legs[journey.legs.length - 1]
                                      .arrivalDelay > 0
                                      ? "red"
                                      : "green"
                                  }`}
                                >
                                  {formatTime(leg.arrival)}
                                </span>
                                <span className="name">
                                  {leg.destination.name}
                                </span>
                                <span className="arrival-platform">
                                  Platform: {leg.arrivalPlatform}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
      {journeysToShow < journeys.length && (
        <button className="btn btn-primary load-more" onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
}

export default JourneyList;
