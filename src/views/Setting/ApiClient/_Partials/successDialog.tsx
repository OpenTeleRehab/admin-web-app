import DialogBody from 'components/V2/Dialog/DialogBody';
import DialogFooter from 'components/V2/Dialog/DialogFooter';
import { useTranslate } from 'hooks/useTranslate';
import { useState } from 'react';
import { InputGroup, FormControl, Button, Alert, Form } from 'react-bootstrap';
import useDialog from 'components/V2/Dialog';

type SuccessDialogProps = {
  apiKey: string;
  secretKey: string;
}

const SuccessDialog = ({ apiKey, secretKey }: SuccessDialogProps) => {
  const t: any = useTranslate();
  const { closeDialog } = useDialog();
  const [copiedApi, setCopiedApi] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const copyToClipboard = (text: string, type: 'api' | 'secret') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'api') {
        setCopiedApi(true);
        setTimeout(() => setCopiedApi(false), 2000);
      } else {
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
      }
    });
  };

  return (
    <>
      <DialogBody>
        <Alert variant='warning'>{t('api_client.success_dialog.alert_message')}</Alert>
        <Form.Group>
          <Form.Label>{t('api_client.api_key')}</Form.Label>
          <InputGroup>
            <FormControl
              readOnly
              value={apiKey}
              aria-label="API Key"
            />
            <Button
              variant="outline-secondary"
              onClick={() => copyToClipboard(apiKey, 'api')}
            >
              {copiedApi ? t('copied') : t('copy')}
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>{t('api_client.secret_key')}</Form.Label>
          <InputGroup>
            <FormControl
              readOnly
              value={secretKey}
              aria-label="Secret Key"
            />
            <Button
              variant="outline-secondary"
              onClick={() => copyToClipboard(secretKey, 'secret')}
            >
              {copiedSecret ? t('copied') : t('copy')}
            </Button>
          </InputGroup>
        </Form.Group>
      </DialogBody>
      <DialogFooter>
        <Button variant="outline-dark" onClick={closeDialog}>
          {t('common.close')}
        </Button>
      </DialogFooter>
    </>
  );
};

export default SuccessDialog;
