import { HeaderTitle } from "@react-navigation/elements";
import { Pressable,Text,StyleSheet } from "react-native";

export default function CustomButton({
  title,
  onPress,
}: any){
    return(
        <Pressable
            style={styles.button}
            onPress={onPress}
        >
            <Text
                style={styles.text}
            >
                {title}
            </Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },

  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});