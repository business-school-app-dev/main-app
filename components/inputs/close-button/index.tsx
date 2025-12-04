import { router } from "expo-router";
import IconButton from "../icon-button";

export default function CloseButton() {
  return (
    <IconButton
      iconName="close"
      variant="transparent"
      color="white"
      onPress={() => router.back()}
    />
  );
}