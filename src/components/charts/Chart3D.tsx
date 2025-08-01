import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { CHART_TYPES } from "../../lib/constants";
import type { Chart } from "../../types";

interface Chart3DProps {
  chart: Chart;
  height?: number;
}

interface BarMeshProps {
  position: [number, number, number];
  height: number;
  color: string;
  label?: string;
}

const BarMesh = ({ position, height, color, label }: BarMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.8, Math.max(height, 0.1), 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {label && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {label}
        </Text>
      )}
    </group>
  );
};

interface LineMeshProps {
  points: THREE.Vector3[];
  color: string;
}

const LineMesh = ({ points, color }: LineMeshProps) => {
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  // Create geometry from points
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, linewidth: 3 });

  // Create the line object only once
  const line = useRef<THREE.Line>(new THREE.Line(geometry, material)).current;

  // Attach ref for rotation
  lineRef.current = line;

  return <primitive object={line} />;
};

interface SphereMeshProps {
  position: [number, number, number];
  size: number;
  color: string;
  label?: string;
}

const SphereMesh = ({ position, size, color, label }: SphereMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[Math.max(size, 0.1), 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {label && (
        <Text
          position={[0, -size - 0.5, 0]}
          fontSize={0.25}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {label}
        </Text>
      )}
    </group>
  );
};

const Chart3DScene = ({ chart }: { chart: Chart }) => {
  const { data, config } = chart;
  const chartData = data?.chartData || [];

  console.log('3D Chart Data:', chartData);
  console.log('3D Chart Config:', config);

  if (!chartData.length) {
    return (
      <Text fontSize={1} color="red" position={[0, 0, 0]}>
        No data available for 3D chart
      </Text>
    );
  }

  // Process the data based on chart type
  let processedData: any[] = [];

  if (chart.type === CHART_TYPES.PIE) {
    // For pie charts, count occurrences
    const categoryCount: { [key: string]: number } = {};
    chartData.forEach((item: any) => {
      const category = item[config.xAxis] || item.x || item.label;
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });
    
    processedData = Object.entries(categoryCount).map(([key, value]) => ({
      [config.xAxis]: key,
      [config.yAxis]: value,
    }));
  } else {
    processedData = chartData.map((item: any) => ({
      [config.xAxis]: item[config.xAxis] || item.x || item.label || 'Unknown',
      [config.yAxis]: typeof (item[config.yAxis] || item.y) === 'number' 
        ? (item[config.yAxis] || item.y) 
        : 1,
    }));
  }

  const values = processedData.map(item => item[config.yAxis]);
  const maxValue = Math.max(...values, 1); // Ensure maxValue is at least 1
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#a8e6cf", "#ffd93d"];

  const renderBars = () => {
    return processedData.map((item: any, index: number) => {
      const value = item[config.yAxis];
      const normalizedHeight = Math.max((value / maxValue) * 4, 0.1); // Scale to max height of 4, minimum 0.1
      const x = (index - processedData.length / 2) * 1.5;
      const color = colors[index % colors.length];

      return (
        <BarMesh
          key={`bar-${index}`}
          position={[x, 0, 0]}
          height={normalizedHeight}
          color={color}
          label={String(item[config.xAxis]).substring(0, 10)}
        />
      );
    });
  };

  const renderLine = () => {
    const points = processedData.map((item: any, index: number) => {
      const value = item[config.yAxis];
      const normalizedHeight = Math.max((value / maxValue) * 4, 0.1);
      const x = (index - processedData.length / 2) * 1.5;
      return new THREE.Vector3(x, normalizedHeight, 0);
    });

    return <LineMesh points={points} color="#4ecdc4" />;
  };

  const renderPieAs3D = () => {
    // Render pie chart as 3D spheres of different sizes
    return processedData.map((item: any, index: number) => {
      const value = item[config.yAxis];
      const normalizedSize = Math.max((value / maxValue) * 0.8, 0.2); // Scale sphere size
      const angle = (index / processedData.length) * Math.PI * 2;
      const radius = 3;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const color = colors[index % colors.length];

      return (
        <SphereMesh
          key={`sphere-${index}`}
          position={[x, 0, z]}
          size={normalizedSize}
          color={color}
          label={String(item[config.xAxis]).substring(0, 8)}
        />
      );
    });
  };

  const renderChart = () => {
    switch (chart.type) {
      case CHART_TYPES.COLUMN_3D:
      case CHART_TYPES.BAR_3D:
        return renderBars();
      case CHART_TYPES.LINE_3D:
        return renderLine();
      case CHART_TYPES.PIE:
        // Render pie chart as 3D representation
        return renderPieAs3D();
      default:
        return (
          <Text fontSize={0.8} color="red" position={[0, 0, 0]}>
            Unsupported 3D chart type: {chart.type}
          </Text>
        );
    }
  };

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Chart title */}
      {config.title && (
        <Text
          position={[0, 5, 0]}
          fontSize={0.6}
          color="navy"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {config.title}
        </Text>
      )}

      {/* Axis labels */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.4}
        color="gray"
        anchorX="center"
        anchorY="middle"
      >
        {config.xAxis}
      </Text>
      
      <Text
        position={[-6, 2, 0]}
        fontSize={0.4}
        color="gray"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, Math.PI / 2]}
      >
        {config.yAxis}
      </Text>

      {/* Grid */}
      <gridHelper args={[10, 10]} position={[0, -1.5, 0]} />
      
      {renderChart()}
      
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
    </>
  );
};

export const Chart3D = ({ chart, height = 400 }: Chart3DProps) => {
  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border" style={{ height: `${height}px` }}>
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        <Chart3DScene chart={chart} />
      </Canvas>
    </div>
  );
};