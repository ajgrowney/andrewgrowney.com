import React, { useState } from "react";
import { ScatterPlot2D, ScatterPlot3D, RadarPlot } from "./Plots";
import { DataLabControlPanel } from '../../../../components/js/ControlPanels'
import { initTeamData, statInfo } from "../../../../Data/mm/demo"
import Nav from '../../../js/Nav';
import '../css/datalab.css';



const PlotContainer = ({ plotType, points, selectedAxes }) => {
  if (plotType === "Radar") {
    return <RadarPlot data={points} selectedAxes={selectedAxes} statInfo={statInfo} />;
  } else if (plotType === "2D Scatter") {
    return <ScatterPlot2D points={points} selectedAxes={selectedAxes} />;
  } else {
    return <ScatterPlot3D points={points} axes={selectedAxes} />;
  }
};

// Main App Component
export default function DataLab() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAxes, setSelectedAxes] = useState({ x: "adjoe", y: "adjde", z: "seed", l: ["adjoe", "adjde", "seed"] });
  const [teamData, setTeamData] = useState(initTeamData);
  const [selectedTeams, setSelectedTeams] = useState(Object.keys(initTeamData));
  const [plotType, setPlotType] = useState("3D Scatter");
  const [colors, setColors] = useState({});

  // Convert team data to scatter plot points
    const plotData = selectedTeams.map(teamId => {
        console.log(teamId);
        const team = teamData[teamId];
        return {
            name: team.name,
            ...team,
            x: team[selectedAxes.x],
            y: team[selectedAxes.y],
            z: plotType === '3D Scatter' ? team[selectedAxes.z] : 0,
            size: team.seed * 2,
            color: colors[teamId] || 'red'
        };
    });

  // Function to update axis selection
  const toggleAxis = (axes) => {
    setSelectedAxes(axes);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", flexWrap: "wrap", border: "1px solid green", overflowX: "hidden" }}>
      <Nav navContent={[]} />
      {/* Plot Container centered*/}
      <div style={{ flex: 1, width: "100%", display: "flex", justifyContent: "center", zIndex: 0 }}>
        <PlotContainer plotType={plotType} points={plotData} selectedAxes={selectedAxes} />
      </div>

      {/* Control Panel */}
      <DataLabControlPanel
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        toggleAxis={toggleAxis}
        selectedAxes={selectedAxes}
        teamData={teamData}
        selectedTeams={selectedTeams}
        toggleTeamSelection={setSelectedTeams}
        plotType={plotType}
        setPlotType={setPlotType}
        colors={colors}
        setColors={setColors}
      />
    </div>
  );
}