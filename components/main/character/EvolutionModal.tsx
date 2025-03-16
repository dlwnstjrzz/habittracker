import React, { useEffect, useState, useRef } from "react";
import { View, Modal, Pressable, Dimensions } from "react-native";
import { CustomText } from "@/components/common/CustomText";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Character3D } from "./Character3D";
import rabby from "../../../assets/models/animals/Rabby.fbx";
import rabbyQueen from "../../../assets/models/animals/Rabby_Queen.fbx";
import rabbyYoung from "../../../assets/models/animals/Rabby_Young.fbx";
import animation from "../../../assets/models/animals/Anim_Rabby_Idle.fbx";
import texture from "../../../assets/models/Textures/T_Rabby_01.png";
import ConfettiCannon from "react-native-confetti-cannon";

interface EvolutionModalProps {
  visible: boolean;
  onClose: () => void;
  stage: number; // 1: 크리스탈→루미, 2: 1단계→2단계, 3: 2단계→3단계
}

export function EvolutionModal({
  visible,
  onClose,
  stage,
}: EvolutionModalProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const contentOpacity = useSharedValue(0);
  const confettiRef = useRef(null);
  const confettiTopRef = useRef(null);
  const [confettiColors, setConfettiColors] = useState<string[]>([]);
  const [modalPosition, setModalPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // 진화 단계별 타이틀 설정
  const getEvolutionTitle = () => {
    if (stage === 1) return "루미가 태어났어요!";
    if (stage === 2) return "루미가 성장했어요!";
    if (stage === 3) return "루미가 최종 진화했어요!";
    return "";
  };

  // 진화 단계별 설명 설정
  const getEvolutionDescription = () => {
    if (stage === 1) return "루미와 함께 습관을 관리해보세요!";
    if (stage === 2) return "루미가 더 귀여워졌어요!";
    if (stage === 3) return "루미가 최종 형태로 진화했어요!";
    return "";
  };

  // 진화 단계별 타이틀 색상 설정
  const getTitleColor = () => {
    if (stage === 1) return "#4F46E5"; // 인디고
    if (stage === 2) return "#D97706"; // 앰버
    if (stage === 3) return "#DB2777"; // 핑크
    return "#4F46E5";
  };

  // 진화 단계별 폭죽 색상 설정
  const getConfettiColors = () => {
    if (stage === 1) return ["#818CF8", "#C7D2FE", "#4F46E5", "#E0E7FF"];
    if (stage === 2) return ["#FBBF24", "#FEF3C7", "#D97706", "#FDE68A"];
    if (stage === 3) return ["#EC4899", "#FBCFE8", "#DB2777", "#FCE7F3"];
    return ["#818CF8", "#C7D2FE", "#4F46E5", "#E0E7FF"];
  };

  // 캐릭터 모델 URL 설정
  const getCharacterModel = () => {
    if (stage === 1) return rabbyYoung;
    if (stage === 2) return rabby;
    if (stage === 3) return rabbyQueen;
    return rabbyYoung;
  };

  // 모달 애니메이션 스타일
  const modalStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
      zIndex: 10, // 모달의 z-index 설정
    };
  });

  // 콘텐츠 애니메이션 스타일
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });

  // 모달 위치 측정 함수
  const onModalLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setModalPosition({ x, y, width, height });
  };

  // 모달이 열릴 때 애니메이션 시작
  useEffect(() => {
    if (visible) {
      console.log("진화 모달 열림, 단계:", stage);

      // 햅틱 피드백
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // 폭죽 색상 설정
      setConfettiColors(getConfettiColors());

      // 모달 페이드인
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });

      // 콘텐츠 페이드인
      contentOpacity.value = withDelay(200, withTiming(1, { duration: 300 }));

      // 폭죽 발사 (약간의 지연 후)
      setTimeout(() => {
        if (confettiRef.current) {
          confettiRef.current.start();
        }

        // 모달 위에서 떨어지는 폭죽 발사
        setTimeout(() => {
          if (confettiTopRef.current) {
            confettiTopRef.current.start();
          }
        }, 500);
      }, 300);
    } else {
      // 모달 닫기 애니메이션
      opacity.value = withTiming(0, { duration: 250 });
      scale.value = withTiming(0.9, { duration: 250 });
      contentOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, stage]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View
          style={modalStyle}
          className="w-[90%] max-w-[350px] h-[500px] rounded-3xl overflow-hidden bg-white"
          onLayout={onModalLayout}
        >
          <View className="w-full h-full py-6 bg-[#F6F5F9] flex justify-between relative">
            <Animated.View
              style={contentStyle}
              className="flex-1 flex flex-col justify-between"
            >
              {/* 타이틀과 설명 */}
              <View className="items-center mt-2 bg-[#F6F5F9] rounded-xl">
                <CustomText
                  size="xl"
                  weight="bold"
                  style={{ color: getTitleColor() }}
                  className="mb-2 text-center text-2xl"
                >
                  {getEvolutionTitle()}
                </CustomText>
                <CustomText className="text-[#666666] text-center text-base">
                  {getEvolutionDescription()}
                </CustomText>
              </View>

              {/* 캐릭터 */}
              <View className="flex-1 justify-center items-center relative">
                <View className="w-full h-full">
                  <Character3D
                    modelUrl={getCharacterModel()}
                    animationUrl={animation}
                    textureUrl={texture}
                    rotation={0} // 캐릭터가 앞을 보도록 설정 (0은 앞, Math.PI는 뒤)
                  />
                </View>
              </View>

              {/* 확인 버튼 */}
              <View className="w-full items-center mt-2 mb-2">
                <Pressable
                  onPress={onClose}
                  style={{ backgroundColor: getTitleColor() }}
                  className="py-3.5 px-10 rounded-full w-4/5"
                >
                  <CustomText
                    size="base"
                    weight="bold"
                    className="text-white text-center text-base"
                  >
                    확인
                  </CustomText>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* 폭죽 효과 - 모달 뒤에서 렌더링되지 않도록 모달 다음에 배치 */}
        {visible && (
          <>
            <View
              style={{
                position: "absolute",
                zIndex: 20,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <ConfettiCannon
                ref={confettiRef}
                count={150}
                origin={{ x: screenWidth / 2, y: screenHeight }}
                colors={confettiColors}
                explosionSpeed={350}
                fallSpeed={3000}
                fadeOut={true}
                autoStart={false}
              />
              <ConfettiCannon
                count={100}
                origin={{ x: 0, y: 0 }}
                colors={confettiColors}
                explosionSpeed={300}
                fallSpeed={2500}
                fadeOut={true}
                autoStart={visible}
              />
              <ConfettiCannon
                count={100}
                origin={{ x: screenWidth, y: 0 }}
                colors={confettiColors}
                explosionSpeed={300}
                fallSpeed={2500}
                fadeOut={true}
                autoStart={visible}
              />
            </View>
          </>
        )}

        {/* 모달 위에서 떨어지는 폭죽 */}
        {visible && modalPosition.width > 0 && (
          <View
            style={{
              position: "absolute",
              zIndex: 20,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <ConfettiCannon
              ref={confettiTopRef}
              count={80}
              origin={{ x: screenWidth / 2, y: screenHeight / 2 - 300 }}
              colors={confettiColors}
              explosionSpeed={200}
              fallSpeed={2000}
              fadeOut={true}
              autoStart={false}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}
