import { Snackbar } from "react-native-paper";

export default function SnackBarComponent({
  visible,
  action,
  message,
}: {
  visible: boolean;
  action: any;
  message: string;
}) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={action}
      duration={3000}
      action={{
        label: "Cerrar",
        onPress: () => action,
      }}
    >
      {message}
    </Snackbar>
  );
}
