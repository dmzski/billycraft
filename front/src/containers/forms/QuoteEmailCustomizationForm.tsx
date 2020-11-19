import React from "react";
import MultiLineInput from "../../components/inputs/MultiLineInput";
import SwitchInput from "../../components/inputs/SwitchInput";
import { QuoteEmailCustomization } from "../../models/QuoteEmailCustomization";

const QuoteEmailCustomizationForm: React.FC<any> = ({ quoteEmailCustomization, onSubmit }) => {
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
        <SwitchInput checked={newQuoteEmailCustomization.sendAutomatically} id="sendQuoteAutomatically" onToggle={handleToggle("sendAutomatically")} />
        <div className="ml-2">Envoyer l'email automatiquement lorsque le devis passe au status "Envoyé"</div>
      </div>
      <div className="border border-black p-3 mb-3">
        <p>Pour insérer le numéro du devis entrez : #QUOTE_ID#</p>
        <p>Pour insérer le titre du devis entrez : #QUOTE_TITLE#</p>
      </div>
      <div>
        <label className="font-bold text-gray-700">Objet du mail</label>
        <MultiLineInput
          value={newQuoteEmailCustomization.object}
          onChange={(e: any) => setNewQuoteEmailCustomization({ ...newQuoteEmailCustomization, object: e.target.value })}
          placeholder="Objet du mail"
          className="border-2 border-gray-200 p-3 w-full rounded"
        />
      </div>
      <div className="mt-2">
        <label className="font-bold text-gray-700">Corps du mail</label>
        <MultiLineInput
          value={newQuoteEmailCustomization.body}
          onChange={(e: any) => setNewQuoteEmailCustomization({ ...newQuoteEmailCustomization, body: e.target.value })}
          placeholder="Corps du mail"
          className="border-2 border-gray-200 p-3 w-full rounded"
        />
      </div>
      <div>
        <button className="button primary w-full mt-3">Enregistrer</button>
      </div>
    </form>
  );
};

export default QuoteEmailCustomizationForm;
