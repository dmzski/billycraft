import { Button, Switch, TextInput } from "@coco-ui/core";
import React from "react";
import { BillEmailCustomization } from "../../models/BillEmailCustomization";

const BillEmailCustomizationForm = ({ billEmailCustomization, onSubmit }: any): JSX.Element => {
  const [newBillEmailCustomization, setNewBillEmailCustomization] = React.useState(billEmailCustomization || new BillEmailCustomization());

  React.useEffect(() => {
    setNewBillEmailCustomization(billEmailCustomization || new BillEmailCustomization());
  }, [billEmailCustomization]);

  const handleToggle = (field: string) => (e: any) => {
    setNewBillEmailCustomization({ ...newBillEmailCustomization, [field]: e.target.checked });
  };

  return (
    <form onSubmit={(e) => onSubmit(e, newBillEmailCustomization)} className="w-full">
      <div className="my-2 flex">
        <Switch checked={newBillEmailCustomization.sendAutomatically} id="sendBillAutomatically" onChange={handleToggle("sendAutomatically")} />
        <div className="ml-2">Envoyer l&lsquo;email automatiquement lorsque la facture passe au status &ldquo;Envoyé&ldquo;</div>
      </div>
      <div className="border border-black p-3 mb-3">
        <p>Pour insérer le numéro du devis entrez : #BILL_ID#</p>
        <p>Pour insérer le titre du devis entrez : #BILL_TITLE#</p>
      </div>
      <div>
        <label className="font-bold text-gray-700">Objet du mail</label>
        <TextInput
          value={newBillEmailCustomization.object}
          onChange={(e: any) => setNewBillEmailCustomization({ ...newBillEmailCustomization, object: e.target.value })}
          placeholder="Objet du mail"
          className="border-2 border-gray-200 p-3 w-full rounded"
        />
      </div>
      <div className="mt-2">
        <label className="font-bold text-gray-700">Corps du mail</label>
        <TextInput
          multiline
          value={newBillEmailCustomization.body}
          onChange={(e: any) => setNewBillEmailCustomization({ ...newBillEmailCustomization, body: e.target.value })}
          placeholder="Corps du mail"
          className="border-2 border-gray-200 p-3 w-full rounded"
        />
      </div>
      <div>
        <Button size="md" className="w-full mt-3">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default BillEmailCustomizationForm;
