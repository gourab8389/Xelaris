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
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {label && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
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

  // Create geometry and material only once
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  if (!geometryRef.current) {
    geometryRef.current = new THREE.BufferGeometry().setFromPoints(points);
  }

  return (
    <primitive
      object={new THREE.Line(
        geometryRef.current,
        new THREE.LineBasicMaterial({ color, linewidth: 3 })
      )}
      ref={lineRef}
    />
  );
};

const Chart3DScene = ({ chart }: { chart: Chart }) => {
  const { data, config } = chart;
  const chartData = data.chartData || [];

  if (!chartData.length) {
    return (
      <Text fontSize={1} color="red" position={[0, 0, 0]}>
        No data available
      </Text>
    );
  }

  const maxValue = Math.max(...chartData.map((item: any) => item[config.yAxis]));
  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"];

  const renderBars = () => {
    return chartData.map((item: any, index: number) => {
      const value = item[config.yAxis];
      const normalizedHeight = (value / maxValue) * 5; // Scale to max height of 5
      const x = (index - chartData.length / 2) * 1.5;
      const color = colors[index % colors.length];

      return (
        <BarMesh
          key={index}
          position={[x, 0, 0]}
          height={normalizedHeight}
          color={color}
          label={item[config.xAxis]?.toString().substring(0, 8)}
        />
      );
    });
  };

  const renderLine = () => {
    const points = chartData.map((item: any, index: number) => {
      const value = item[config.yAxis];
      const normalizedHeight = (value / maxValue) * 5;
      const x = (index - chartData.length / 2) * 1.5;
      return new THREE.Vector3(x, normalizedHeight, 0);
    });

    return <LineMesh points={points} color="#4ecdc4" />;
  };

  const renderChart = () => {
    switch (chart.type) {
      case CHART_TYPES.COLUMN_3D:
      case CHART_TYPES.BAR_3D:
        return renderBars();
      case CHART_TYPES.LINE_3D:
        return renderLine();
      default:
        return (
          <Text fontSize={1} color="red" position={[0, 0, 0]}>
            Unsupported 3D chart type
          </Text>
        );
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />
      
      {/* Chart title */}
      {config.title && (
        <Text
          position={[0, 6, 0]}
          fontSize={0.8}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {config.title}
        </Text>
      )}

      {/* Axis labels */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="gray"
        anchorX="center"
        anchorY="middle"
      >
        {config.xAxis}
      </Text>
      
      <Text
        position={[-8, 3, 0]}
        fontSize={0.4}
        color="gray"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, Math.PI / 2]}
      >
        {config.yAxis}
      </Text>

      {/* Grid */}
      <gridHelper args={[10, 10]} position={[0, -1, 0]} />
      
      {renderChart()}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
};

export const Chart3D = ({ chart, height = 400 }: Chart3DProps) => {
  return (
    <div className="w-full bg-gray-100 rounded-lg" style={{ height: `${height}px` }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <Chart3DScene chart={chart} />
      </Canvas>
    </div>
  );
};