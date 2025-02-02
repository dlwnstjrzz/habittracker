import { Canvas } from "@react-three/fiber/native";
import { useGLTF } from "@react-three/drei/native";
import { Suspense } from "react";
import { View } from "react-native";
import React from "react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
    </>
  );
}

export function Character3D({ modelUrl }: { modelUrl: string }) {
  return (
    <View className="w-full h-[200px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
      </Canvas>
    </View>
  );
}
