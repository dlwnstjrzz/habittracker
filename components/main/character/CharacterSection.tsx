import { View, Pressable } from "react-native";
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

interface CharacterSectionProps {
  stage: number;
}

export default function CharacterSection({ stage }: CharacterSectionProps) {
  const { isEvolutionReady, evolve } = useCharacterStore();

  const getEvolutionMessage = () => {
    if (!isEvolutionReady) return null;

    switch (stage) {
      case 2:
        return "루미가 변하려고 해요! 터치해주세요!";
      case 3:
        return "루미가 최종 진화를 하려고 해요! 터치해주세요!";
      default:
        return null;
    }
  };

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
    <View className="w-full h-[400px] bg-[#F6F5F9]">
      <View className="w-full h-full flex items-center relative justify-center">
        {isEvolutionReady && stage > 1 && (
          <Pressable
            className="absolute top-28 left-1/2 -translate-x-1/2 z-50"
            onPress={handlePress}
          >
            <CustomText className="text-lg text-blue-500">
              {getEvolutionMessage()}
            </CustomText>
          </Pressable>
        )}
        {renderCharacter()}
      </View>
    </View>
  );
}
