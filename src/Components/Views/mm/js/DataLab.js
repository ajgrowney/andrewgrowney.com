import React, { useState, useRef, useEffect } from "react";
import { ScatterPlot2D, ScatterPlot3D, RadarPlot } from "./Plots";
import { Card, CardGroup } from "react-bootstrap";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import Select from 'react-select';
import Nav from '../../../js/Nav';
import '../css/datalab.css';

const statInfo = {
  'adjoe': { "full": "Adjusted Offensive Efficiency", short: "AdjOE", "min": 80, "max": 130 },
  'adjde': { "full": "Adjusted Defensive Efficiency", short: "AdjDE", "min": 80, "max": 130 },
  'seed': { "full": "Seed", short: "Seed", "min": 1, "max": 16 },
  'tempo': { "full": "Tempo", short: "Tempo", "min": 60, "max": 80 },
  'luck': { "full": "Luck", short: "Luck", "min": -10, "max": 10 }
};

const initTeamData = {
  101: { name: "Gonzaga", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
  102: { name: "Kansas", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
  103: { name: "Duke", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
  104: { name: "Purdue", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
  105: { name: "Baylor", adjoe: Math.random() * 130, adjde: Math.random() * 100, seed: Math.floor(Math.random() * 16) + 1, tempo: Math.random() * 80, luck: Math.random() * 100 },
};

const colorPool = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6",
    "#E6B333", "#3366E6", "#999966", "#99FF99", "#B34D4D",
    "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A",
    "#FF99E6", "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC"]

const teamGroups = {
  "2023 Tournament": [101, 102, 103, 104, 105],
  "2023 Championship": [101, 102],
  "2024 Final Four": [101, 102, 103, 104],
  "2024 Sweet Sixteen": [101, 102, 103, 104, 105]
};

const SelectAxis = ({ plotType, statOptions, selectedAxes, handleAxisChange, handleAxesChange }) => {
  if (plotType === "2D Scatter") {
    return (
      <>
        <label>
          X-Axis:
          <Select
            menuPlacement="top"
            options={statOptions}
            value={statOptions.find(option => option.value === selectedAxes.x)}
            onChange={handleAxisChange("x")}
            styles={{
              control: (provided) => ({
                ...provided,
                background: "#444",
                color: "white",
                marginLeft: "10px",
              }),
              menu: (provided) => ({
                ...provided,
                background: "#333",
                color: "white",
              }),
            }}
          />
        </label>
        <label>
          Y-Axis:
          <Select
            menuPlacement="top"
            options={statOptions}
            value={statOptions.find(option => option.value === selectedAxes.y)}
            onChange={handleAxisChange("y")}
            styles={{
              control: (provided) => ({
                ...provided,
                background: "#444",
                color: "white",
                marginLeft: "10px",
              }),
              menu: (provided) => ({
                ...provided,
                background: "#333",
                color: "white",
              }),
            }}
          />
        </label>
      </>
    );
  } else if (plotType === "3D Scatter") {
    return (
      <>
        <label>
          X-Axis:
          <Select
            menuPlacement="top"
            options={statOptions}
            value={statOptions.find(option => option.value === selectedAxes.x)}
            onChange={handleAxisChange("x")}
            styles={{
              control: (provided) => ({
                ...provided,
                background: "#444",
                color: "white",
                marginLeft: "10px",
              }),
              menu: (provided) => ({
                ...provided,
                background: "#333",
                color: "white",
              }),
            }}
          />
        </label>
        <label>
          Y-Axis:
          <Select
            menuPlacement="top"
            options={statOptions}
            value={statOptions.find(option => option.value === selectedAxes.y)}
            onChange={handleAxisChange("y")}
            styles={{
              control: (provided) => ({
                ...provided,
                background: "#444",
                color: "white",
                marginLeft: "10px",
              }),
              menu: (provided) => ({
                ...provided,
                background: "#333",
                color: "white",
              }),
            }}
          />
        </label>
        <label>
          Z-Axis:
          <Select
            menuPlacement="top"
            options={statOptions}
            value={statOptions.find(option => option.value === selectedAxes.z)}
            onChange={handleAxisChange("z")}
            styles={{
              control: (provided) => ({
                ...provided,
                background: "#444",
                color: "white",
                marginLeft: "10px",
              }),
              menu: (provided) => ({
                ...provided,
                background: "#333",
                color: "white",
              }),
            }}
          />
        </label>
      </>
    );
  } else if (plotType === "Radar") {
    return (
      <label>
        Axes:
        <Select
          isMulti
          menuPlacement="top"
          options={statOptions}
          value={statOptions.filter(option => selectedAxes.l.includes(option.value))}
          onChange={handleAxesChange}
          styles={{
            control: (provided) => ({
              ...provided,
              background: "#444",
              color: "white",
              marginLeft: "10px",
            }),
            menu: (provided) => ({
              ...provided,
              background: "#333",
              color: "white",
            }),
          }}
        />
      </label>
    );
  }
  return null;
};

// Control Panel Component
const ControlPanel = ({ isExpanded, setIsExpanded, plotType, setPlotType, toggleAxis, selectedAxes, teamData, selectedTeams, toggleTeamSelection, colors, setColors }) => {
  const statOptions = ["adjoe", "adjde", "seed"].map(stat => ({ value: stat, label: stat }));
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure content height on mount
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, []);

  const teamOptions = Object.keys(teamData).map((teamId) => ({
    value: teamId,
    label: teamData[teamId].name,
  }));

  const groupOptions = Object.keys(teamGroups).map((groupName) => ({
    value: groupName,
    label: groupName,
  }));

  const combinedOptions = [
    ...groupOptions.map(group => ({ value: `group-${group.value}`, label: `Group: ${group.label}` })),
    ...teamOptions.map(team => ({ value: `team-${team.value}`, label: `Team: ${team.label}` }))
  ];

  const handleTeamChange = (selectedOptions) => {
    const selectedTeamIds = selectedOptions.flatMap(option => {
      if (option.value.startsWith('group-')) {
        const groupName = option.value.replace('group-', '');
        return teamGroups[groupName];
      } else {
        return [option.value.replace('team-', '')];
      }
    });
    const newColors = {};
    let colorIndex = 0;

    selectedOptions.forEach(option => {
      if (option.value.startsWith('group-')) {
        const groupName = option.value.replace('group-', '');
        const groupColor = colorPool[colorIndex % colorPool.length];
        newColors[groupName] = groupColor;
        teamGroups[groupName].forEach(teamId => {
            if (!newColors[teamId]) {
                newColors[teamId] = groupColor;
            }
        });
      } else {
        const teamId = option.value.replace('team-', '');
        if (!newColors[teamId]) {
          newColors[teamId] = colorPool[colorIndex % colorPool.length];
        }
      }
      colorIndex++;
    });

    setColors(newColors);
    toggleTeamSelection([...new Set(selectedTeamIds)]);
  };

  const handleAxisChange = (axis) => (selectedOption) => {
    toggleAxis((prev) => ({ ...prev, [axis]: selectedOption.value }));
  };

  const handleAxesChange = (selectedOptions) => {
    toggleAxis((prev) => ({ ...prev, l: selectedOptions.map(option => option.value) }));
  };

  // ---- Build out Preview Text ----
  let previewText = "Control Panel |";
  if (plotType === "2D Scatter") {
    previewText += ` X: ${statInfo[selectedAxes.x].short} | Y: ${statInfo[selectedAxes.y].short}`;
  } else if (plotType === "3D Scatter") {
    previewText += ` X: ${statInfo[selectedAxes.x].short} | Y: ${statInfo[selectedAxes.y].short} | Z: ${statInfo[selectedAxes.z].short}`;
  } else if (plotType === "Radar") {
    previewText += ` Radar Plot: ${selectedAxes.l.join(", ")}`;
  }
  // ---- Add Team Selection to Preview Text ----
  previewText += ` | ${selectedTeams.length} Teams Selected`;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#222",
        color: "white",
        padding: "10px",
        transition: "height 0.3s ease-in-out",
        height: isExpanded ? `${contentHeight + 100}px` : "80px", // Adjust height dynamically
        // overflow: "hidden",
      }}
    >
      {/* Clickable Header */}
      <div
        style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ fontSize: "16px", opacity: isExpanded ? 0 : 1, transition: "opacity 0.3s ease-in-out", textAlign: "center" }}>
          {previewText}
        </div>
        <button
          style={{
            background: "#444",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          {isExpanded ? "Collapse ▼" : "Expand ▲"}
        </button>
      </div>

      {/* Expandable Content */}
      <div ref={contentRef} style={{ opacity: isExpanded ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}>
        <CardGroup>
          <Card style={{ margin: "10px", background: "#333", color: "white" }}>
            <Card.Body>
              <Card.Title>Change Plot</Card.Title>
              <label>
                Plot Type:
                <Select
                  menuPlacement="top"
                  options={["2D Scatter", "3D Scatter", "Radar"].map((type) => ({ value: type, label: type }))}
                  value={{ value: plotType, label: plotType }}
                  onChange={(selectedOption) => setPlotType(selectedOption.value)}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      background: "#444",
                      color: "white",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      background: "#333",
                      color: "white",
                    }),
                  }}
                />
              </label>
              <SelectAxis
                plotType={plotType}
                statOptions={statOptions}
                selectedAxes={selectedAxes}
                handleAxisChange={handleAxisChange}
                handleAxesChange={handleAxesChange}
              />
            </Card.Body>
          </Card>
          <Card style={{ margin: "10px", background: "#333", color: "white" }}>
            <Card.Body>
              <Card.Title>Teams and Groups</Card.Title>
              <Select
                isMulti
                menuPlacement="top"
                options={combinedOptions}
                onChange={handleTeamChange}
                placeholder="Select teams and groups..."
                styles={{
                  control: (provided) => ({
                    ...provided,
                    background: "#444",
                    color: "white",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    background: "#333",
                    color: "white",
                  }),
                  multiValue: (provided, state) => ({
                    ...provided,
                    background: colors[state.data.value.replace('group-', '')] || (colors[state.data.value.replace('team-', '')] || "#555"),
                    color: "white",
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: "white",
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    color: "white",
                    ':hover': {
                      backgroundColor: '#666',
                      color: 'white',
                    },
                  }),
                }}
              />
            </Card.Body>
          </Card>
        </CardGroup>
      </div>
    </div>
  );
};

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
      <ControlPanel
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