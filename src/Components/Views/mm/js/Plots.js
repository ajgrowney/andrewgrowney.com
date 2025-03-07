import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, Cell, LabelList } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const ScatterPlot2D = ({ points, selectedAxes }) => {
    const data = points.map(point => ({
        x: point.x,
        y: point.y,
        size: point.size,
        color: point.color,
        name: point.name,
    }));

    return (
        <ScatterChart width={600} height={400}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name={selectedAxes.x} />
            <YAxis type="number" dataKey="y" name={selectedAxes.y} />
            <ZAxis type="number" dataKey="size" range={[60, 400]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Teams" data={data} fill="#8884d8">
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList dataKey="name" position="top" />
            </Scatter>
        </ScatterChart>
    );
};

// Scatter Plot Component
const ScatterPlot3D = ({ points, axes }) => (
  <Canvas camera={{ position: [0, 0, 150], fov: 50 }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    {points.map((point, index) => (
      <mesh key={index} position={[point.x, point.y, point.z]}>
        <sphereGeometry args={[point.size, 16, 16]} />
        <meshStandardMaterial color={point.color} />
        <Text position={[0, 0, point.size + 2]} fontSize={5} color="black" anchorX="center" anchorY="middle">
          {point.name}
        </Text>
      </mesh>
    ))}
    <gridHelper args={[200, 10]} />
    <gridHelper args={[200, 10]} rotation={[Math.PI / 2, 0, 0]} />
    <OrbitControls />
    {/* Axis */}
    <Text position={[100, 0, 0]} fontSize={10} color="gray">{axes.x}</Text>
    <Text position={[0, 100, 0]} fontSize={10} color="gray" rotation={[0, 0, 0]}>{axes.y}</Text>
    <Text position={[0, 0, 100]} fontSize={10} color="gray" rotation={[0, Math.PI / 2, 0]}>{axes.z}</Text>
  </Canvas>
);

const RadarPlot = ({ data, selectedAxes, statInfo }) => {
    console.log("GENERATING RADAR PLOT");
    console.log(selectedAxes)
    const radarData = selectedAxes.l.map((axis) => {
        const axisData = { stat: axis, name: statInfo[axis].full };
        data.forEach((team) => {
            axisData[team.name] = team[axis];
        });
        // Calculate the min and max values for the axis
        axisData.min = Math.min(...data.map((team) => team[axis]));
        axisData.max = Math.max(...data.map((team) => team[axis]));
        return axisData;
    });
    console.log(radarData);

    return (
        <div className='radar-chart-container'>
            <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                {data.map((team, index) => (
                    <Radar key={team.name} name={team.name} dataKey={team.name} stroke={team.color} fill={team.color} fillOpacity={0.6} />
                ))}
            </RadarChart>
            <div className='legend'>
                {data.map((team, index) => (
                    <div key={team.name} style={{ color: team.color }}>
                        {team.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export { ScatterPlot2D, ScatterPlot3D, RadarPlot };