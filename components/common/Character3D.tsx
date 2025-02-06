// @ts-nocheck
import { Canvas } from "@react-three/fiber/native";
import { useAnimations } from "@react-three/drei/native";
import { Suspense, useEffect, useRef } from "react";
import { View } from "react-native";
import React from "react";
import useControls from "r3f-native-orbitcontrols";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useLoader, useFrame } from "@react-three/fiber/native";

interface ModelProps {
  modelUrl: string;
  animationUrl: string;
  textureUrl: string;
}

function Model({ modelUrl, animationUrl, textureUrl }: ModelProps) {
  const fbxModel = useLoader(FBXLoader, modelUrl);
  const fbxAnimation = useLoader(FBXLoader, animationUrl);
  const { mixer } = useAnimations(fbxAnimation.animations, fbxModel);
  const modelRef = useRef<THREE.Group>();
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useEffect(() => {
    // 모델의 모든 메시에 대해 material 설정
    fbxModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // UV 매핑 확인 및 수정
        if (mesh.geometry.attributes.uv) {
          mesh.geometry.attributes.uv.needsUpdate = true;
        }

        // 새로운 material 생성 및 적용
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          side: THREE.DoubleSide, // 양면 렌더링
          transparent: true,
          alphaTest: 0.5,
        });

        // material 설정
        material.needsUpdate = true;
        mesh.material = material;

        // 메시 최적화 설정
        mesh.frustumCulled = true;
        mesh.matrixAutoUpdate = false;
      }
    });

    // 애니메이션 설정
    if (fbxAnimation.animations.length > 0) {
      const clip = fbxAnimation.animations[0];
      const action = mixer.clipAction(clip);

      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
    }

    return () => {
      mixer?.stopAllAction();
    };
  }, [fbxModel, texture, fbxAnimation, mixer]);

  useFrame((state, delta) => {
    mixer?.update(delta);
  });

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <primitive
        ref={modelRef}
        object={fbxModel}
        scale={0.08}
        position={[0, -3, 0]}
        rotation={[0, Math.PI, 0]} // 모델 방향 조정
      />
    </>
  );
}

export function Character3D({
  modelUrl,
  animationUrl,
  textureUrl,
}: {
  modelUrl: string;
  animationUrl: string;
  textureUrl: string;
}) {
  const [OrbitControls, events] = useControls();

  return (
    <View className="w-full h-[400px]" {...events}>
      <Canvas
        events={null}
        onCreated={(state) => {
          const _gl = state.gl.getContext();
          const pixelStorei = _gl.pixelStorei.bind(_gl);
          _gl.pixelStorei = function (...args) {
            const [parameter] = args;
            switch (parameter) {
              case _gl.UNPACK_FLIP_Y_WEBGL:
                return pixelStorei(...args);
            }
          };
        }}
        camera={{ position: [6, 2, 10], fov: 60 }}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          alpha: false,
        }}
        frameloop="demand"
      >
        <color attach="background" args={["#F6F5F9"]} />
        <OrbitControls enableDamping={false} enableZoom={false} />
        <Suspense fallback={null}>
          <Model
            modelUrl={modelUrl}
            animationUrl={animationUrl}
            textureUrl={textureUrl}
          />
        </Suspense>
      </Canvas>
    </View>
  );
}
