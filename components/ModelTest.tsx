import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei/native";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Mesh: THREE.SkinnedMesh;
    root: THREE.Bone;
  };
  materials: {
    M_Gecko: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | "Attack"
  | "Bounce"
  | "Clicked"
  | "Death"
  | "Eat"
  | "Fear"
  | "Fly"
  | "Hit"
  | "Idle_A"
  | "Idle_B"
  | "Idle_C"
  | "Jump"
  | "Roll"
  | "Run"
  | "Sit"
  | "Spin"
  | "Swim"
  | "Walk";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export default function Model(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(
    require("../assets/models/animals/Gecko_Animations.glb")
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={7}
      position={[0, -1, 0]}
    >
      <group>
        <group name="RootNode">
          <group name="Rig" rotation={[-Math.PI / 2, 0, 0]} scale={40}>
            <primitive object={nodes.root} />
          </group>
          <skinnedMesh
            name="Mesh"
            geometry={nodes.Mesh.geometry}
            material={materials.M_Gecko}
            skeleton={nodes.Mesh.skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={40}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(require("../assets/models/animals/Gecko_Animations.glb"));
