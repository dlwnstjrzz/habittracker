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
import { EvolutionMessage } from "./EvolutionMessage";
import { useState, useRef, useEffect } from "react";
import { EvolutionModal } from "./EvolutionModal";
import { clearStorage, resetOnboarding } from "@/utils/storage";
import { useRouter } from "expo-router";

interface CharacterSectionProps {
  stage: number;
}

export default function CharacterSection({ stage }: CharacterSectionProps) {
  const router = useRouter();
  const {
    isEvolutionReady,
    evolve,
    currentExperience,
    level,
    needExperience,
    resetCharacter,
  } = useCharacterStore();

  const [showEvolutionModal, setShowEvolutionModal] = useState(false);
  const [evolutionStage, setEvolutionStage] = useState(1);

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log(
      "CharacterSection 렌더링 - 현재 단계:",
      stage,
      "진화 준비:",
      isEvolutionReady
    );
  }, [stage, isEvolutionReady]);

  const handlePress = () => {
    if (isEvolutionReady) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // 진화 단계 설정
      if (stage === 1) {
        setEvolutionStage(1); // 크리스탈 → 루미
      } else if (stage === 2) {
        setEvolutionStage(2); // 1단계 → 2단계
      } else if (stage === 3) {
        setEvolutionStage(3); // 2단계 → 3단계
      }

      console.log("진화 모달 표시 - 단계:", evolutionStage);
      // 진화 모달 표시
      setShowEvolutionModal(true);
    }
  };

  const handleEvolutionComplete = () => {
    // 모달이 닫히면 진화 완료
    setShowEvolutionModal(false);
    console.log("진화 완료 처리");
    evolve();
  };

  // 온보딩 초기화 및 리다이렉트
  const handleResetOnboarding = async () => {
    await resetOnboarding();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/onboarding");
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
        {/* 캐릭터 렌더링 */}
        {renderCharacter()}

        {/* 진화 메시지 - stage가 1일 때도 표시되도록 수정 */}
        {isEvolutionReady && (
          <EvolutionMessage
            message={
              stage === 1
                ? "크리스탈에서 작은 숨소리가 들려요..!"
                : stage === 2
                ? "루미가 반짝반짝"
                : "루미의 최종 진화가 시작돼요"
            }
            subMessage="터치해서 진화시켜주세요!"
            onPress={handlePress}
          />
        )}

        {/* 진화 모달 */}
        <EvolutionModal
          visible={showEvolutionModal}
          onClose={handleEvolutionComplete}
          stage={evolutionStage}
        />

        {/* 초기화 버튼 */}
        {/* <View className="absolute bottom-0 left-0 right-0 z-20">
          <Pressable onPress={resetCharacter}>
            <CustomText className="text-center py-2">초기화</CustomText>
          </Pressable>
          <Pressable onPress={clearStorage}>
            <CustomText className="text-center py-2">전체 초기화</CustomText>
          </Pressable>
          <Pressable onPress={handleResetOnboarding}>
            <CustomText className="text-center py-2">온보딩 보기</CustomText>
          </Pressable>
        </View> */}
      </View>
    </View>
  );
}
