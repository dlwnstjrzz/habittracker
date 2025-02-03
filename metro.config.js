const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

// 기존 설정 유지하면서 확장
config.resolver.sourceExts = [
  "js",
  "jsx",
  "json",
  "ts",
  "tsx",
  "cjs",
  "mjs",
  ...config.resolver.sourceExts,
];

// 기존 assetExts에 필요한 확장자들 추가
config.resolver.assetExts = [
  "glb",
  "gltf",
  "png",
  "jpg",
  "mat",
  "mtl",
  "obj",
  "fbx",
  ...config.resolver.assetExts,
];

// FBX 로더를 위한 설정
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = withNativeWind(config, { input: "./global.css" });
