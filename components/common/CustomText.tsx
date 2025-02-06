import { Text as RNText, TextProps, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
  weight?: "thin" | "light" | "regular" | "medium" | "bold";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
}

const fontWeights = {
  thin: "SpoqaHanSansNeo-Thin",
  light: "SpoqaHanSansNeo-Light",
  regular: "SpoqaHanSansNeo-Regular",
  medium: "SpoqaHanSansNeo-Medium",
  bold: "SpoqaHanSansNeo-Bold",
};

const fontSizes: Record<CustomTextProps["size"] & string, number> = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
};

export function CustomText({
  children,
  weight = "regular",
  size = "base",
  style,
  className = "",
  ...props
}: CustomTextProps) {
  const textStyle: TextStyle = {
    fontFamily: fontWeights[weight],
    fontSize: fontSizes[size],
  };

  return (
    <RNText
      className={`text-black ${className}`}
      style={[textStyle, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}
