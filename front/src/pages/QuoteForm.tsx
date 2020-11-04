import React from "react";
import { useHistory, useParams } from "react-router-dom";
import BaseInput from "../components/inputs/BaseInput";
import Layout from "../containers/layout/Layout";
import { Quote, QuoteLine } from "../models/Quote";
import { ROUTES } from "../routes";
import { calculatePriceTTC } from "../utils/quote";

import QuoteLineTable from "../containers/tables/QuoteLineTable";

const QuoteForm = () => {
  const { id } = useParams<any>();
  const history = useHistory();
  const [quote, setQuote] = React.useState<Quote>(new Quote());

  function goBack(e: any) {
    history.goBack();
  }

  function inputChange(property: keyof Quote) {
    return (event: any) => {
      const tmp: any = { ...quote };
      let value: any;
      switch (property) {
        case "tva":
          value = parseInt(event.target.value);
          break;
        default:
          value = event.target.value;
      }
      tmp[property] = value;
      setQuote(tmp);
    };
  }

  function addLine() {
    const tmp = { ...quote };
    const newLine = new QuoteLine();
    newLine.line = tmp.lines.length + 1;
    tmp.lines.push(newLine);
    setQuote(tmp);
  }

  React.useEffect(() => {
    try {
      if (id !== "new") {
        setQuote(new Quote());
      }
    } catch (e) {
      setQuote(new Quote());
    }
  }, [id]);

  return (
    <Layout>
      <div>
        <div className="flex items-center">
          <button className="primary" onClick={goBack}>
            Retour
          </button>
          <h1 className="ml-4 text-lg">
            {!quote.id ? "Nouveau " : "Modifier un "}devis{quote.id ? " #" + quote.id : ""}
          </h1>
        </div>
        <form className="quote-form">
          <BaseInput label="Titre" placeholder="Titre du devis" value={quote.title} onChange={inputChange("title")} />
          <BaseInput label="Client" placeholder="Nom du client" value={quote.customer} onChange={inputChange("customer")} />
          <BaseInput label="TVA" placeholder="TVA en %" type="numeric" value={quote.tva || ""} onChange={inputChange("tva")} />
          <QuoteLineTable quote={quote} setQuote={setQuote} />
          <div className="flex">
            <button type="button" className="primary w-full" onClick={addLine}>
              Ajouter une ligne
            </button>
          </div>

          <div className="flex pt-3 flex-row-reverse">
            <button className="bg-gray-600 text-white p-3 rounded ml-4">Enregistrer</button>
            <button className="bg-green-600 text-white p-3 rounded">Envoyer le devis</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default QuoteForm;
