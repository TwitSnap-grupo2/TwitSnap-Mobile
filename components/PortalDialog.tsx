import { Dialog, Portal, Text as PaperText, Button } from "react-native-paper";

export default function PortalDialog({
  dialogVisible,
  hideDialog,
  message,
}: {
  dialogVisible: boolean;
  hideDialog: () => void;
  message: string;
}) {
  return (
    <Portal>
      <Dialog visible={dialogVisible} onDismiss={hideDialog}>
        <Dialog.Title>Oops...</Dialog.Title>
        <Dialog.Content>
          <PaperText variant="bodyMedium">{message}</PaperText>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
