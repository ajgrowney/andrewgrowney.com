import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Card, CardGroup } from "react-bootstrap";
import { colorPool, statInfo, teamGroups } from "../../Data/mm/demo";
import '../css/controlPanel.css';

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
  
// March Madness Data Lab
const DataLabControlPanel = ({ isExpanded, setIsExpanded, plotType, setPlotType, toggleAxis, selectedAxes, teamData, selectedTeams, toggleTeamSelection, colors, setColors }) => {
    // Description: Control panel for the March Madness Data Lab
    // User Experience: User can select teams and groups, change plot type, and select axes
    // Props:
    // - isExpanded: boolean, whether the control panel is expanded
    // - setIsExpanded: function, toggles the control panel expansion
    // - plotType: string, the current plot type (2D Scatter, 3D Scatter, Radar)
    // - setPlotType: function, sets the plot type
    // - toggleAxis: function, sets the selected axes
    // - selectedAxes: object, the currently selected axes (x:str, y:str, z:str, l:[str])
    // - teamData: object, the team data (teamId: {name:str, ...features})
    // - selectedTeams: array, the currently selected teamIds
    // - toggleTeamSelection: function, sets the selected teams
    // - colors: object, the team colors (teamId: color)
    // - setColors: function, sets the team colors

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

const BracketControlPanel = ({ bracketInfo, isExpanded, setIsExpanded, location, setLocation, season, setSeason, mode, setMode, zIndex }) => {
    // Description: Control panel for the March Madness Bracket Page
    // User Experience: User can change bracket location, mode (review or fill)
    // Props:
    // - isExpanded: boolean, whether the control panel is expanded
    // - setIsExpanded: function, toggles the control panel
    // - location: string, the current bracket location
    // - setLocation: function, sets the bracket location
    // - season: number, the current season
    // - setSeason: function, sets the current season
    // - mode: string, the current mode (review or fill)
    // - setMode: function, sets the current mode
    let regionOptions = [
        { value: "W1", label: `Top ${bracketInfo.regions.W}` }, { value: "W2", label: `Bottom ${bracketInfo.regions.W}` },
        { value: "X1", label: `Top ${bracketInfo.regions.X}` }, { value: "X2", label: `Bottom ${bracketInfo.regions.X}` },
        { value: "Y1", label: `Top ${bracketInfo.regions.Y}` }, { value: "Y2", label: `Bottom ${bracketInfo.regions.Y}` },
        { value: "Z1", label: `Top ${bracketInfo.regions.Z}` }, { value: "Z2", label: `Bottom ${bracketInfo.regions.Z}` },
        { value: "16WX", label: `${bracketInfo.regions.W} / ${bracketInfo.regions.X} Regionals` },
        { value: "16YZ", label: `${bracketInfo.regions.Y} / ${bracketInfo.regions.Z} Regionals` },
        { value: "FF", label: "Final Four" }
    ]
    let previewText = `Bracket | Mode: ${mode} | Context: ${location} | Season: ${season}`;
    return (
        <div className="ctrlPanel" style={{ height: isExpanded ? "50vh" : "5vh", zIndex: zIndex }}
            onClick={() => setIsExpanded(!isExpanded)}>
            <div className="preview" style={{ opacity: isExpanded ? 0 : 1 }}>{previewText}</div>
            <div style={{ opacity: isExpanded ? 1 : 0 }}>
                <CardGroup>
                    <Card style={{ margin: "10px", background: "#333", color: "white" }}>
                        <Card.Body>
                            <Card.Title>Change Season</Card.Title>
                            <label>
                                <Select
                                    menuPlacement="top"
                                    options={[2021, 2022, 2023].map((year) => ({ value: year, label: year }))}
                                    value={{ value: season, label: season }}
                                    onChange={(selectedOption) => setSeason(selectedOption.value)}
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
                        </Card.Body>
                    </Card>
                    <Card style={{ margin: "10px", background: "#333", color: "white" }}>
                        <Card.Body>
                            <Card.Title>Change Region</Card.Title>
                            <label>
                                <Select
                                    menuPlacement="top"
                                    options={regionOptions}
                                    value={{ value: location, label: location }}
                                    onChange={(selectedOption) => { console.log(selectedOption); setLocation(selectedOption.value)}}
                                    styles={{
                                        control: (provided) => ({ ...provided, background: "#444", color: "white" }),
                                        menu: (provided) => ({ ...provided, background: "#333", color: "white" }),
                                    }}
                                />
                            </label>
                        </Card.Body>
                    </Card>
                    <Card style={{ margin: "10px", background: "#333", color: "white" }}>
                        <Card.Body>
                            <Card.Title>Change Mode</Card.Title>
                            <label>
                                <Select
                                    menuPlacement="top"
                                    options={["Review", "Fill"].map((type) => ({ value: type, label: type }))}
                                    value={{ value: mode, label: mode }}
                                    onChange={(selectedOption) => setMode(selectedOption.value)}
                                    styles={{
                                        control: (provided) => ({ ...provided, background: "#444", color: "white" }),
                                        menu: (provided) => ({ ...provided, background: "#333", color: "white" }),
                                    }}
                                />
                            </label>
                        </Card.Body>
                    </Card>
                </CardGroup>
            </div>
        </div>
    )
}

export { BracketControlPanel, DataLabControlPanel };