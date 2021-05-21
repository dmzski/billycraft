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
      <h2 className="font-bold text-xl underline leading-10">Personnalisation de l&lsquo;email</h2>
      <div className="my-2 flex">
        <Switch
          labelPosition="right"
          checked={newQuoteEmailCustomization.sendAutomatically}
          id="sendQuoteAutomatically"
          onChange={handleToggle("sendAutomatically")}
        >
          <div className="ml-2">Envoyer l&lsquo;email automatiquement lorsque le devis passe au status &ldquo;Envoyé&ldquo;</div>
        </Switch>
      </div>
      <div className="bg-info-200 rounded text-info-700 p-3 mb-3">
        <p className="underline">Astuces :</p>
        <ul className="list-inside list-disc">
          <li>Pour insérer le numéro du devis entrez : #QUOTE_ID#</li>
          <li>Pour insérer le titre du devis entrez : #QUOTE_TITLE#</li>
        </ul>
      </div>
      <div>
        <TextInput
          id="email-subject"
          label="Objet du mail"
          value={newQuoteEmailCustomization.object}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setNewQuoteEmailCustomization({ ...newQuoteEmailCustomization, object: e.target.value })
          }
          placeholder="Devis #QUOTE_ID# : #QUOTE_TILE#"
          className="border-2 border-gray-200 p-3 w-full rounded"
        />
      </div>
      <div className="mt-2">
        <TextInput
          id="email-body"
          label="Corps du mail"
          multiline
          rows={5}
          value={newQuoteEmailCustomization.body}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setNewQuoteEmailCustomization({ ...newQuoteEmailCustomization, body: e.target.value })
          }
          placeholder="Vous trouvez en pièce jointe le devis #QUOTE_ID# concernant #QUOTE_TITLE#.&#10;Cordialement,"
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

export default QuoteEmailCustomizationForm;
