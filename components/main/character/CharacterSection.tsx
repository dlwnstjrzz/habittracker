import { View, Pressable, GestureResponderEvent } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import EggPage from "./EggPage";
import { Character3D } from "./Character3D";
import rabby from "../../../assets/models/animals/Rabby.fbx";
import rabbyQueen from "../../../assets/models/animals/Rabby_Queen.fbx";
import rabbyYoung from "../../../assets/models/animals/Rabby_Young.fbx";
import animation from "../../../assets/models/animals/Anim_Rabby_Idle.fbx";
import texture from "../../../assets/models/Textures/T_Rabby_01.png";
import { useCharacterStore } from "@/store/useCharacterStore";
import * as Haptics from "expo-haptics";
import { ExperienceBar } from "./ExperienceBar";
import { EvolutionMessage } from "./EvolutionMessage";
import { useState, useRef, useEffect } from "react";

interface CharacterSectionProps {
  stage: number;
}

export default function CharacterSection({ stage }: CharacterSectionProps) {
  const {
    isEvolutionReady,
    evolve,
    currentExperience,
    level,
    needExperience,
    resetCharacter,
  } = useCharacterStore();

  const handlePress = () => {
    if (isEvolutionReady) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      evolve();
    }
  };

  const renderCharacter = () => {
    let modelUrl;

    if (stage === 1) {
      return <EggPage />;
    } else if (stage === 2) {
      modelUrl = rabbyYoung;
    } else if (stage === 3) {
      modelUrl = rabby;
    } else if (stage === 4) {
      modelUrl = rabbyQueen;
    }
    return (
      <Character3D
        modelUrl={modelUrl}
        animationUrl={animation}
        textureUrl={texture}
      />
    );
  };

  return (
    <View className="flex-1 h-[400px] bg-[#F6F5F9]">
      <ExperienceBar
        experience={currentExperience}
        maxExperience={needExperience}
        level={level}
      />

      <View className="w-full h-full flex items-center relative justify-center">
        {isEvolutionReady && stage > 1 && (
          <EvolutionMessage
            message={
              stage === 2
                ? "루미가 반짝반짝✨"
                : "루미의 최종 진화가 시작돼요✨"
            }
            subMessage="터치해서 진화시켜주세요!"
            onPress={handlePress}
          />
        )}
        {/* 초기화 버튼 - 터치 이벤트를 가로채지 않도록 설정 */}
        <View className="absolute bottom-0 left-0 right-0 z-20">
          <Pressable onPress={resetCharacter}>
            <CustomText className="text-center py-2">초기화</CustomText>
          </Pressable>
        </View>
        {renderCharacter()}
      </View>
    </View>
  );
}
