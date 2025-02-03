import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    UnstableStarCore_1_0: THREE.Mesh;
    UnstableStarref_2_0: THREE.Mesh;
  };
  materials: {
    material: THREE.MeshStandardMaterial;
    material_1: THREE.MeshPhysicalMaterial;
  };
};

type ActionName = "Take 001";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export default function Model2(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(
    require("../assets/models/animals/sun.glb")
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="3a2aaa22fb3d4b329318a980ad1bf6d1fbx"
            rotation={[Math.PI / 2, 0, 0]}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group name="UnstableStarCore" rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    name="UnstableStarCore_1_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.UnstableStarCore_1_0.geometry}
                    material={materials.material}
                  />
                </group>
                <group
                  name="UnstableStarref"
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={1.01}
                >
                  <mesh
                    name="UnstableStarref_2_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.UnstableStarref_2_0.geometry}
                    material={materials.material_1}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(require("../assets/models/animals/sun.glb"));
