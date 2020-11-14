import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import { useMutation } from "react-query";
import BaseInput from "../../components/inputs/BaseInput";
import MultiLineInput from "../../components/inputs/MultiLineInput";
import SwitchInput from "../../components/inputs/SwitchInput";
import { QuoteCustomizationGraphQL } from "../../graphql/QuoteCustomizationGraphQL";
import { useToast } from "../../providers/ToastProvider";

const QuoteCustomizationForm: React.FC<any> = ({ quoteCustomization }) => {
  const [newQuoteCustomization, setNewQuoteCustomization] = React.useState<any>({} as any);
  const toast = useToast();
  const [updateQuoteCustomizationMutation, updateQuoteCustomizationMutationState] = useMutation(QuoteCustomizationGraphQL.updateMyQuoteCustomization, {
    onSuccess: (data) => {
      toast.show({ message: "Modification enregistrée", variant: "success" });
    },
  });

  const handleToggle = (property: any) => (event: any) => {
    const tmp = { ...newQuoteCustomization };
    tmp[property] = !!!tmp[property];
    setNewQuoteCustomization(tmp);
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
    <form onSubmit={onSubmit} className="w-3/4 flex flex-col border-gray-400 border p-5 rounded bg-white shadow-lg">
      <div className="flex mt-3 w-full content-center items-center">
        <div className="w-10 h-10 mr-3 border-2 border-black" style={{ backgroundColor: newQuoteCustomization.mainColor || "white" }}></div>
        <BaseInput
          value={newQuoteCustomization.mainColor}
          onChange={(e: any) => {
            setNewQuoteCustomization({ ...newQuoteCustomization, mainColor: e.target.value });
          }}
          label="Couleur principale"
          placeholder="Couleur en hexadecimale : #000000"
          divClassName="w-full"
        />
      </div>
      <div className="flex justify-around mt-3">
        <div className="flex flex-col">
          <h3 className="text-lg">Informations du client</h3>
          <div className="mt-2 flex">
            <SwitchInput checked={newQuoteCustomization.displayCustomerEmail} id="displayCustomerEmail" onToggle={handleToggle("displayCustomerEmail")} />
            <div className="ml-2">Afficher l'email du client</div>
          </div>
          <div className="mt-2 flex">
            <SwitchInput
              checked={newQuoteCustomization.displayCustomerPhoneNumber}
              id="displayCustomerPhoneNumber"
              onToggle={handleToggle("displayCustomerPhoneNumber")}
            />
            <div className="ml-2">Afficher le téléphone du client</div>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg">Informations de l'entreprise</h3>
          <div className="mt-2 flex">
            <SwitchInput checked={newQuoteCustomization.displayCompanyEmail} id="displayCompanyEmail" onToggle={handleToggle("displayCompanyEmail")} />
            <div className="ml-2">Afficher l'email de mon entreprise</div>
          </div>
          <div className="mt-2 flex">
            <SwitchInput
              checked={newQuoteCustomization.displayCompanyPhoneNumber}
              id="displayCompanyPhoneNumber"
              onToggle={handleToggle("displayCompanyPhoneNumber")}
            />
            <div className="ml-2">Afficher le téléphone de mon entreprise</div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h1 className="text-lg font-bold border-b-2 pb-2 pt-2">Après le tableau</h1>
        <MultiLineInput
          style={{ borderBottom: "1px solid black" }}
          placeholder="En dessous du tableau"
          value={newQuoteCustomization.afterTable}
          className="w-full"
          maxLength={1000}
          onChange={(e: any) => setNewQuoteCustomization({ ...newQuoteCustomization, afterTable: e.target.value })}
        />
      </div>
      <div className="mt-2">
        <h1 className="text-lg font-bold border-b-2 pb-2 pt-2">Pied de page</h1>
        <MultiLineInput
          className="w-full"
          style={{ borderBottom: "1px solid black" }}
          placeholder="Pied de page"
          value={newQuoteCustomization.footer}
          maxLength={1000}
          onChange={(e: any) => setNewQuoteCustomization({ ...newQuoteCustomization, footer: e.target.value })}
        />
      </div>
      <button className="w-full primary mt-5" onClick={onSubmit}>
        Enregister
      </button>
    </form>
  );
};

export default QuoteCustomizationForm;
