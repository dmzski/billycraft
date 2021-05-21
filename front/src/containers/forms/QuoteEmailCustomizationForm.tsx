import { Button, Switch, TextInput } from "@coco-ui/core";
import React from "react";
import { QuoteEmailCustomization } from "../../models/QuoteEmailCustomization";

const QuoteEmailCustomizationForm = ({ quoteEmailCustomization, onSubmit }: any): JSX.Element => {
  const [newQuoteEmailCustomization, setNewQuoteEmailCustomization] = React.useState(quoteEmailCustomization || new QuoteEmailCustomization());

  React.useEffect(() => {
    setNewQuoteEmailCustomization(quoteEmailCustomization || new QuoteEmailCustomization());
  }, [quoteEmailCustomization]);

  const handleToggle = (field: string) => (e: any) => {
    setNewQuoteEmailCustomization({ ...newQuoteEmailCustomization, [field]: e.target.checked });
  };

  return (
    <form onSubmit={(e) => onSubmit(e, newQuoteEmailCustomization)} className="w-full">
      <div className="my-2 flex">
        <Switch checked={newQuoteEmailCustomization.sendAutomatically} id="sendQuoteAutomatically" onChange={handleToggle("sendAutomatically")} />
        <div className="ml-2">Envoyer l&lsquo;email automatiquement lorsque le devis passe au status &ldquo;Envoyé&ldquo;</div>
      </div>
      <div className="border border-black p-3 mb-3">
        <p>Pour insérer le numéro du devis entrez : #QUOTE_ID#</p>
        <p>Pour insérer le titre du devis entrez : #QUOTE_TITLE#</p>
      </div>
      <div>
        <label className="font-bold text-gray-700">Objet du mail</label>
        <TextInput
          multiline
          value={newQuoteEmailCustomization.object}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setNewQuoteEmailCustomization({ ...newQuoteEmailCustomization, object: e.target.value })
          }
          placeholder="Objet du mail"
          className="border-2 border-gray-200 p-3 w-full rounded"
        />
      </div>
      <div className="mt-2">
        <label className="font-bold text-gray-700">Corps du mail</label>
        <TextInput
          multiline
          value={newQuoteEmailCustomization.body}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setNewQuoteEmailCustomization({ ...newQuoteEmailCustomization, body: e.target.value })
          }
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

export default QuoteEmailCustomizationForm;
