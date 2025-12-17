import { StyleSheet } from "react-native";
import colors from "./colors";
import spacing from "./spacing";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
