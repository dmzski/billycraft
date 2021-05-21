import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { Quote, QuoteLine } from "../models/Quote";

import QuoteLineTable from "../containers/tables/QuoteLineTable";
import { Button, TextInput } from "@coco-ui/core";

const QuoteForm = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [quote, setQuote] = React.useState<Quote>(new Quote());

  function goBack() {
    history.goBack();
  }

  function inputChange(property: keyof Quote) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <>
      <div className="flex items-center">
        <button className="primary" onClick={goBack}>
          Retour
        </button>
        <h1 className="ml-4 text-lg">
          {!quote.id ? "Nouveau " : "Modifier un "}devis{quote.id ? " #" + quote.id : ""}
        </h1>
      </div>
      <form className="quote-form">
        <TextInput label="Titre" placeholder="Titre du devis" value={quote.title} onChange={inputChange("title")} />
        <TextInput label="Client" placeholder="Nom du client" value={`${quote.customer}`} onChange={inputChange("customer")} />
        <TextInput label="TVA" placeholder="TVA en %" type="numeric" value={quote.tva || ""} onChange={inputChange("tva")} />
        <QuoteLineTable quote={quote} setQuote={setQuote} />
        <div className="flex">
          <button type="button" className="primary w-full" onClick={addLine}>
            Ajouter une ligne
          </button>
        </div>

        <div className="flex pt-3 flex-row-reverse">
          <Button variant="link" className="ml-4">
            Enregistrer
          </Button>
          <Button variant="success">Envoyer le devis</Button>
        </div>
      </form>
    </>
  );
};

export default QuoteForm;
