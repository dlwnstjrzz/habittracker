import * as React from "react";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
  Circle,
} from "react-native-svg";

export function IcecreamIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.6304 3.21037C27.0104 3.50889 27.0765 4.05895 26.778 4.43898L20.618 12.281C20.3195 12.661 19.7695 12.7271 19.3894 12.4286C19.0094 12.1301 18.9433 11.58 19.2418 11.2L25.4017 3.35797C25.7003 2.97795 26.2503 2.91186 26.6304 3.21037Z"
        fill="url(#paint0_linear_18_30281)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.7834 7.54196C30.0179 7.9645 29.8655 8.49714 29.4429 8.73165L21.3943 13.1988C20.9718 13.4333 20.4392 13.2809 20.2046 12.8584C19.9701 12.4358 20.1225 11.9032 20.5451 11.6687L28.5937 7.20153C29.0162 6.96702 29.5489 7.11943 29.7834 7.54196Z"
        fill="url(#paint4_linear_18_30281)"
      />
      <Circle cx="8.83948" cy="17.75" r="6.75" fill="#8C604D" />
      <Circle
        cx="22.2602"
        cy="17.625"
        r="6.75"
        fill="url(#paint12_radial_18_30281)"
      />
      <Circle
        cx="16"
        cy="14.9219"
        r="8.07812"
        fill="url(#paint14_radial_18_30281)"
      />
      <Path
        d="M2.72245 21.0415H28.2156C28.8378 21.0415 29.1855 21.7515 28.7957 22.2364C27.3125 24.4062 25.8438 25.9375 23.1563 27.3597C22.5868 27.7097 21.9848 28.1856 21.6405 28.7585L21.5056 28.9831C21.1439 29.5848 20.4933 29.9529 19.7913 29.9529H11.1468C10.4447 29.9529 9.79412 29.5848 9.43251 28.9831L9.29755 28.7585C8.95324 28.1856 8.47094 27.7097 7.90147 27.3597C5.21878 25.9062 3.81253 24.625 2.14237 22.2364C1.75257 21.7515 2.10031 21.0415 2.72245 21.0415Z"
        fill="url(#paint17_linear_18_30281)"
      />
      <Path
        d="M17.9493 5.98328C17.9493 7.07861 17.2246 7.84562 15.9661 7.84562C14.7075 7.84562 13.9828 7.07861 13.9828 5.98328C13.9828 4.88794 14.8707 4 15.9661 4C17.0614 4 17.9493 4.88794 17.9493 5.98328Z"
        fill="url(#paint22_radial_18_30281)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_18_30281"
          x1="21.8125"
          y1="9.50004"
          x2="26.375"
          y2="3.89847"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F0AF78" />
          <Stop offset="1" stopColor="#BC8755" />
        </LinearGradient>
        <LinearGradient
          id="paint17_linear_18_30281"
          x1="15.469"
          y1="21.0415"
          x2="15.469"
          y2="29.9529"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.0584643" stopColor="#7FD4FF" />
          <Stop offset="0.114572" stopColor="#69C0F9" />
          <Stop offset="0.500316" stopColor="#6189FF" />
          <Stop offset="0.703708" stopColor="#597CFF" />
          <Stop offset="0.865019" stopColor="#427AFF" />
          <Stop offset="1" stopColor="#716DFF" />
        </LinearGradient>
        <RadialGradient
          id="paint12_radial_18_30281"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26.0625 15.8125) rotate(73.8557) scale(4.94501 7.25117)"
        >
          <Stop stopColor="#FFB1B3" />
          <Stop offset="0.354952" stopColor="#FFA7AB" />
          <Stop offset="1" stopColor="#FF8F9D" />
        </RadialGradient>
        <RadialGradient
          id="paint14_radial_18_30281"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20.75 12.625) rotate(156.413) scale(9.68407 10.8233)"
        >
          <Stop stopColor="#FFF0DE" />
          <Stop offset="0.305629" stopColor="#FFE6C8" />
          <Stop offset="0.667864" stopColor="#E9CFB2" />
          <Stop offset="1" stopColor="#DDC3A6" />
        </RadialGradient>
        <RadialGradient
          id="paint22_radial_18_30281"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(16.75 5.3125) rotate(135.881) scale(2.87296 2.96331)"
        >
          <Stop stopColor="#FF6FB3" />
          <Stop offset="0.480596" stopColor="#FE3E8B" />
          <Stop offset="1" stopColor="#E64260" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}
