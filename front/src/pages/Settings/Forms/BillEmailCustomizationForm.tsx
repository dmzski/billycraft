import { Button, Switch, Input, TextArea } from "@coco-ui/core";
import React from "react";
import { FormEvent } from "react-router/node_modules/@types/react";
import BillEmailCustomization from "../../../models/BillEmailCustomization";

const defaultValues = {
  body: "",
  object: "",
  sendAutomatically: false,
} as BillEmailCustomization;

type BillEmailCustomizationFormProps = {
  billEmailCustomization: BillEmailCustomization;
  onSubmit: (e: FormEvent, values: BillEmailCustomization) => void;
};

const BillEmailCustomizationForm = ({
  billEmailCustomization,
  onSubmit,
}: BillEmailCustomizationFormProps): JSX.Element => {
  const [
    newBillEmailCustomization,
    setNewBillEmailCustomization,
  ] = React.useState<BillEmailCustomization>(
    billEmailCustomization || defaultValues
  );

  React.useEffect(() => {
    setNewBillEmailCustomization(billEmailCustomization || defaultValues);
  }, [billEmailCustomization]);

  const handleToggle = (field: string) => (e: any) => {
    setNewBillEmailCustomization({
      ...newBillEmailCustomization,
      [field]: e.target.checked,
    });
  };

  return (
    <form
      onSubmit={(e) => onSubmit(e, newBillEmailCustomization)}
      className="w-full"
    >
      <h2 className="text-2xl">Personnalisation de l&lsquo;email</h2>
      <div className="ml-4">
        <div className="my-4 flex">
          <Switch
            labelPosition="right"
            checked={newBillEmailCustomization.sendAutomatically}
            id="sendAutomatically"
            onChange={handleToggle("sendAutomatically")}
          >
            <div className="ml-2">
              Envoyer l&lsquo;email automatiquement lorsque la facture passe au
              status &ldquo;Envoyé&ldquo;
            </div>
          </Switch>
        </div>
        <div className="bg-info-200 text-info-700 rounded p-3 mb-3">
          <p className="underline">Astuces :</p>
          <ul className="list-disc list-inside">
            <li>Pour insérer le numéro du devis entrez : #BILL_ID#</li>
            <li>Pour insérer le titre du devis entrez : #BILL_TITLE#</li>
          </ul>
        </div>
        <div>
          <Input
            id="object"
            name="object"
            label="Objet du mail"
            value={newBillEmailCustomization.object}
            onChange={(e: any) =>
              setNewBillEmailCustomization({
                ...newBillEmailCustomization,
                object: e.target.value,
              })
            }
            placeholder="Facture #BILL_ID# : #BILL_TITLE#"
            className="border-2 border-gray-200 p-3 w-full rounded"
          />
        </div>
        <div className="mt-2">
          <TextArea
            id="body"
            name="body"
            label="Corps du mail"
            rows={5}
            value={newBillEmailCustomization.body}
            onChange={(e: any) =>
              setNewBillEmailCustomization({
                ...newBillEmailCustomization,
                body: e.target.value,
              })
            }
            placeholder="Vous trouvez en pièce jointe la facture #BILL_ID# concernant #BILL_TITLE#.&#10;Cordialement,"
            className="border-2 border-gray-200 p-3 w-full rounded"
          />
        </div>
        <Button type="submit" size="md" className="mt-4">
          Enregistrer la personnalisation de l&apos;email
        </Button>
      </div>
    </form>
  );
};

export default BillEmailCustomizationForm;
