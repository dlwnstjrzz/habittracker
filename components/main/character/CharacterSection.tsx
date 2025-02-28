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
import { ExperienceBar } from "./ExperienceBar";

interface CharacterSectionProps {
  stage: number;
}

export default function CharacterSection({ stage }: CharacterSectionProps) {
  const { isEvolutionReady, evolve, currentExperience, level, needExperience } =
    useCharacterStore();

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
      <ExperienceBar
        experience={currentExperience}
        maxExperience={needExperience}
        level={level}
      />
      <View className="w-full h-full flex items-center relative justify-center">
        {isEvolutionReady && stage > 1 && (
          <Pressable
            className="absolute top-28 left-1/2 -translate-x-1/2 z-50"
            onPress={handlePress}
          >
            <View className="bg-white/90 px-6 py-3 rounded-full border-2 border-blue-400 shadow-lg">
              <View className="absolute -top-2 left-1/2 -translate-x-1/2">
                <CustomText className="text-yellow-500 text-lg">✨</CustomText>
              </View>
              <CustomText className="text-blue-500 text-center font-medium">
                {stage === 2 ? (
                  <>
                    <CustomText className="text-lg">
                      루미가 반짝반짝✨
                    </CustomText>
                    {"\n"}
                    <CustomText className="text-base">
                      터치해서 진화시켜주세요!
                    </CustomText>
                  </>
                ) : (
                  <>
                    <CustomText className="text-lg">
                      루미의 최종 진화가 시작돼요✨
                    </CustomText>
                    {"\n"}
                    <CustomText className="text-base">
                      터치해서 진화시켜주세요!
                    </CustomText>
                  </>
                )}
              </CustomText>
            </View>
          </Pressable>
        )}
        {renderCharacter()}
      </View>
    </View>
  );
}
