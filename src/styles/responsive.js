import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Escala proporcional
export const wp = percent => (width * percent) / 100;
export const hp = percent => (height * percent) / 100;

// Breakpoints para pantallas pequeñas / grandes
export const deviceType = () => {
    if (width < 380) return "small";
    if (width > 800) return "tablet";
    return "normal";
};
