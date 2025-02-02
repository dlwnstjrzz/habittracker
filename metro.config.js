const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

// 기존 assetExts에 glb 확장자 추가
config.resolver.assetExts.push("glb");

module.exports = withNativeWind(config, { input: "./global.css" });
