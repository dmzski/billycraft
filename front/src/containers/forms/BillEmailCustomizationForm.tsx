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
      <h2 className="font-bold text-xl underline leading-10">Personnalisation de l&lsquo;email</h2>
      <div className="my-2 flex">
        <Switch labelPosition="right" checked={newBillEmailCustomization.sendAutomatically} id="sendAutomatically" onChange={handleToggle("sendAutomatically")}>
          <div className="ml-2">Envoyer l&lsquo;email automatiquement lorsque la facture passe au status &ldquo;Envoyé&ldquo;</div>
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
        <TextInput
          id="object"
          name="object"
          label="Objet du mail"
          value={newBillEmailCustomization.object}
          onChange={(e: any) => setNewBillEmailCustomization({ ...newBillEmailCustomization, object: e.target.value })}
          placeholder="Facture #BILL_ID# : #BILL_TITLE#"
          className="border-2 border-gray-200 p-3 w-full rounded"
        />
      </div>
      <div className="mt-2">
        <TextInput
          id="body"
          name="body"
          label="Corps du mail"
          multiline
          rows={5}
          value={newBillEmailCustomization.body}
          onChange={(e: any) => setNewBillEmailCustomization({ ...newBillEmailCustomization, body: e.target.value })}
          placeholder="Vous trouvez en pièce jointe la facture #BILL_ID# concernant #BILL_TITLE#.&#10;Cordialement,"
          className="border-2 border-gray-200 p-3 w-full rounded"
        />
      </div>
      <div>
        <Button type="submit" size="md" className="w-full mt-3">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default BillEmailCustomizationForm;
