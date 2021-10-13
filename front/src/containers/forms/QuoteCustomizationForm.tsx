import { Button, Switch, TextInput } from "@coco-ui/core";
import { QuoteCustomizationApi } from "api/QuoteCustomizationApi";
import QuoteCustomization from "models/QuoteCustomization";
import React from "react";
import { useMutation } from "react-query";
import { useToast } from "../../providers/ToastProvider";

type QuoteCustomizationFormProps = {
  quoteCustomization: QuoteCustomization;
};
const QuoteCustomizationForm = ({
  quoteCustomization,
}: QuoteCustomizationFormProps): JSX.Element => {
  const [
    newQuoteCustomization,
    setNewQuoteCustomization,
  ] = React.useState<QuoteCustomization>({} as QuoteCustomization);
  const toast = useToast();
  const [
    updateQuoteCustomizationMutation,
    updateQuoteCustomizationMutationState,
  ] = useMutation(QuoteCustomizationApi.updateMine, {
    onSuccess: () => {
      toast.show({ message: "Modification enregistrée", variant: "success" });
    },
  });

  const handleToggle = (property: keyof QuoteCustomization) => () => {
    setNewQuoteCustomization((current) => ({
      ...current,
      [property]: !current[property],
    }));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!updateQuoteCustomizationMutationState.isLoading) {
      updateQuoteCustomizationMutation(newQuoteCustomization);
    }
  };

  React.useEffect(() => {
    if (quoteCustomization) {
      setNewQuoteCustomization(quoteCustomization);
    }
  }, [quoteCustomization]);

  return (
    <form onSubmit={onSubmit} className="w-full">
      <h2 className="font-bold text-xl underline leading-10">
        Personnalisation du PDF
      </h2>
      <div className="flex mt-3 w-full content-center items-center">
        <div
          className="w-10 h-10 mr-3 border-2 border-black"
          style={{
            backgroundColor: newQuoteCustomization.mainColor || "white",
          }}
        ></div>
        <TextInput
          id="mainColor"
          value={newQuoteCustomization.mainColor}
          onChange={(e: any) => {
            setNewQuoteCustomization({
              ...newQuoteCustomization,
              mainColor: e.target.value,
            });
          }}
          label="Couleur principale"
          placeholder="Couleur en hexadecimale : #000000"
          containerClassName="w-full"
        />
      </div>
      <div className="flex justify-around mt-3">
        <div className="flex flex-col">
          <h3 className="text-lg">Informations du client</h3>
          <div className="mt-2 flex">
            <Switch
              checked={newQuoteCustomization.displayCustomerEmail}
              id="displayCustomerEmail"
              onChange={handleToggle("displayCustomerEmail")}
            >
              Afficher l&lsquo;email du client
            </Switch>
          </div>
          <div className="mt-2 flex">
            <Switch
              checked={newQuoteCustomization.displayCustomerPhoneNumber}
              id="displayCustomerPhoneNumber"
              onChange={handleToggle("displayCustomerPhoneNumber")}
            >
              Afficher le téléphone du client
            </Switch>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg">Informations de l&lsquo;entreprise</h3>
          <div className="mt-2 flex">
            <Switch
              checked={newQuoteCustomization.displayCompanyEmail}
              id="displayCompanyEmail"
              onChange={handleToggle("displayCompanyEmail")}
            >
              Afficher l&lsquo;email de mon entreprise
            </Switch>
          </div>
          <div className="mt-2 flex">
            <Switch
              checked={newQuoteCustomization.displayCompanyPhoneNumber}
              id="displayCompanyPhoneNumber"
              onChange={handleToggle("displayCompanyPhoneNumber")}
            >
              Afficher le téléphone de mon entreprise
            </Switch>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h1 className="text-lg font-bold border-b-2 pb-2 pt-2">
          Après le tableau
        </h1>
        <TextInput
          id="afterTable"
          rows={5}
          multiline
          placeholder="En dessous du tableau"
          value={newQuoteCustomization.afterTable}
          className="w-full"
          maxLength={1000}
          onChange={(e: any) =>
            setNewQuoteCustomization({
              ...newQuoteCustomization,
              afterTable: e.target.value,
            })
          }
        />
      </div>
      <div className="mt-2">
        <h1 className="text-lg font-bold border-b-2 pb-2 pt-2">Pied de page</h1>
        <TextInput
          id="footer"
          rows={5}
          multiline
          className="w-full"
          placeholder="Pied de page"
          value={newQuoteCustomization.footer}
          maxLength={1000}
          onChange={(e: any) =>
            setNewQuoteCustomization({
              ...newQuoteCustomization,
              footer: e.target.value,
            })
          }
        />
      </div>
      <Button
        type="submit"
        size="md"
        className="w-full mt-5"
        onClick={onSubmit}
      >
        Enregister
      </Button>
    </form>
  );
};

export default QuoteCustomizationForm;
