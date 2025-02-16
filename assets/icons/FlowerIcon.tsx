import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { ViewStyle } from "react-native";

interface FlowerIconProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
  opacity?: number;
}

export function FlowerIcon({
  color = "#000000",
  size = 128,
  style,
  opacity = 1,
}: FlowerIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 128 128" style={style}>
      <Path
        d="M0 0 C7.53198966 3.98752394 13.01575026 10.55173695 17 18 C17.68820284 20.44446072 17.89126011 22.44461257 18 25 C19.155 24.67 20.31 24.34 21.5 24 C30.65958463 21.79402674 38.34148407 23.40799083 47 27 C51.76119403 30.28358209 51.76119403 30.28358209 53 34 C53.98437122 43.25687555 51.75877602 50.9206889 46.1875 58.3125 C45.54167969 59.09238281 44.89585938 59.87226562 44.23046875 60.67578125 C42.68520619 62.96859286 42.68520619 62.96859286 43.6484375 65.59375 C44.80124646 67.64614976 45.94538076 69.3792932 47.4375 71.1875 C52.22760351 77.72074769 54.11299056 85.98646799 53 94 C51.63458053 97.84024225 49.79078505 99.31510294 46.3125 101.1875 C36.57924447 105.58258979 28.20024466 105.91435562 18 103 C17.9175 103.825 17.835 104.65 17.75 105.5 C15.70137804 115.06023582 9.98130108 121.01495914 2.5 127 C-1.10934449 128.4437378 -4.2336853 128.84393348 -8 128 C-16.23029861 123.71207725 -23.13003638 115.77871226 -26 107 C-26 105.68 -26 104.36 -26 103 C-27.2375 103.350625 -28.475 103.70125 -29.75 104.0625 C-40.28035257 106.36394498 -49.5165808 104.052137 -58.5 98.4375 C-61.03600267 96.00716411 -61.17731379 93.27500843 -61.25 89.9375 C-61.08650658 80.75214242 -58.04202613 74.34216729 -52.23046875 67.32421875 C-50.68520619 65.03140714 -50.68520619 65.03140714 -51.6484375 62.40625 C-52.80124646 60.35385024 -53.94538076 58.6207068 -55.4375 56.8125 C-60.22760351 50.27925231 -62.11299056 42.01353201 -61 34 C-59.63458053 30.15975775 -57.79078505 28.68489706 -54.3125 26.8125 C-45.25144433 22.78172298 -37.81110867 22.7253284 -28 24 C-27.34 24.33 -26.68 24.66 -26 25 C-25.979375 24.071875 -25.95875 23.14375 -25.9375 22.1875 C-24.8370815 14.66797356 -19.61632572 7.86489539 -13.6875 3.375 C-9.15036726 0.2908194 -5.55015641 -0.74693694 0 0 Z M-11.02734375 13.9921875 C-17.76472852 20.84964447 -18.35230195 28.21757446 -18.28515625 37.4453125 C-17.73146198 44.34752875 -14.81714824 50.02228015 -10 55 C-9.34 55 -8.68 55 -8 55 C-7.86464844 54.39414062 -7.72929688 53.78828125 -7.58984375 53.1640625 C-4.84871331 42.49499191 0.7324023 34.92163386 10 29 C8.17457395 20.17710741 4.48603966 14.19966301 -3 9 C-6.47042561 9 -8.53971388 11.76189865 -11.02734375 13.9921875 Z M-52 36 C-51.57042905 45.27873243 -48.90925649 51.99673222 -42.04296875 58.39453125 C-35.49222615 63.54243796 -28.3790873 66.31673526 -20 66 C-16.52481314 65.20876287 -16.52481314 65.20876287 -14 64 C-14.886875 63.05125 -15.77375 62.1025 -16.6875 61.125 C-23.64627316 52.89949981 -25.88696216 44.59877824 -27 34 C-36.76203443 31.30702498 -42.58573884 32.24769662 -52 36 Z M5.55078125 44.19921875 C3.44552531 46.64386103 2.08043615 48.96127332 1 52 C1.39122809 54.1342341 1.39122809 54.1342341 2 56 C3.216875 55.649375 4.43375 55.29875 5.6875 54.9375 C15.30207222 52.82108473 24.87098312 54.72344541 34 58 C39.75899961 52.06744149 43.7350715 46.94533204 44.1875 38.5 C44.125625 37.675 44.06375 36.85 44 36 C29.45850961 28.72925481 16.55147653 32.8082549 5.55078125 44.19921875 Z M6 64 C6.886875 64.94875 7.77375 65.8975 8.6875 66.875 C15.64627316 75.10050019 17.88696216 83.40122176 19 94 C28.22741552 96.63952075 35.3715507 96.22243264 44 92 C43.57042905 82.72126757 40.90925649 76.00326778 34.04296875 69.60546875 C25.94525956 63.24187702 15.85618917 59.59065222 6 64 Z M-42 70 C-47.75899961 75.93255851 -51.7350715 81.05466796 -52.1875 89.5 C-52.125625 90.325 -52.06375 91.15 -52 92 C-44.44596345 95.69665618 -37.43680637 96.95047002 -29.19140625 94.78515625 C-21.8590154 92.15804295 -14.88757088 86.82254106 -10.86328125 80.1015625 C-9.35001772 76.85592037 -8.84348288 75.46955135 -10 72 C-11.8253125 72.5259375 -11.8253125 72.5259375 -13.6875 73.0625 C-23.30207222 75.17891527 -32.87098312 73.27655459 -42 70 Z M0 73 C-0.13535156 73.60585937 -0.27070312 74.21171875 -0.41015625 74.8359375 C-3.15128669 85.50500809 -8.7324023 93.07836614 -18 99 C-16.40361315 106.9653052 -13.27574362 112.71199338 -7 118 C-5.0620696 119.05682316 -5.0620696 119.05682316 -3 119 C4.08237295 114.9193359 7.50654073 108.4803778 10 101 C10.81305723 90.63018809 9.78505249 83.45492859 3.875 74.9375 C3.25625 74.298125 2.6375 73.65875 2 73 C1.34 73 0.68 73 0 73 Z"
        fill={color}
        transform="translate(68,0)"
        opacity={opacity}
      />
    </Svg>
  );
}
