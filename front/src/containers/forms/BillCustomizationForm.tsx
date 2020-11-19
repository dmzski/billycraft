import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import { useMutation } from "react-query";
import BaseInput from "../../components/inputs/BaseInput";
import MultiLineInput from "../../components/inputs/MultiLineInput";
import SwitchInput from "../../components/inputs/SwitchInput";
import { BillCustomizationGraphQL } from "../../graphql/BillCustomizationGraphQL";
import { useToast } from "../../providers/ToastProvider";

const BillCustomizationForm: React.FC<any> = ({ billCustomization }) => {
  const [newBillCustomization, setNewBillCustomization] = React.useState<any>({} as any);
  const toast = useToast();
  const [updateBillCustomizationMutation, updateBillCustomizationMutationState] = useMutation(BillCustomizationGraphQL.updateMyBillCustomization, {
    onSuccess: (data) => {
      toast.show({ message: "Modification enregistrée", variant: "success" });
    },
  });
  const [afterTableEditor, setAfterTableEditor] = React.useState(() =>
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(newBillCustomization.afterTable || "<div></div>").contentBlocks))
  );
  const [footerEditor, setFooterEditor] = React.useState(() =>
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(newBillCustomization.footer || "<div></div>").contentBlocks))
  );

  const editorChange = (setEditorState: any, property: any) => (newEditorState: any) => {
    setEditorState(newEditorState);
    const tmp = { ...newBillCustomization };
    tmp[property] = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    setNewBillCustomization(tmp);
  };

  const handleToggle = (property: any) => (event: any) => {
    const tmp = { ...newBillCustomization };
    tmp[property] = !!!tmp[property];
    setNewBillCustomization(tmp);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!updateBillCustomizationMutationState.isLoading) {
      updateBillCustomizationMutation(newBillCustomization);
    }
  };

  React.useEffect(() => {
    if (billCustomization) {
      setNewBillCustomization(billCustomization);
      setAfterTableEditor(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(billCustomization.afterTable || "").contentBlocks)));
      setFooterEditor(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(billCustomization.footer || "").contentBlocks)));
    }
  }, [billCustomization]);

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col">
      <div className="flex mt-3 w-full content-center items-center">
        <div className="w-10 h-10 mr-3 border-2 border-black" style={{ backgroundColor: newBillCustomization.mainColor || "white" }}></div>
        <BaseInput
          value={newBillCustomization.mainColor}
          onChange={(e: any) => {
            setNewBillCustomization({ ...newBillCustomization, mainColor: e.target.value });
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
            <SwitchInput checked={newBillCustomization.displayCustomerEmail} id="displayCustomerEmail" onToggle={handleToggle("displayCustomerEmail")} />
            <div className="ml-2">Afficher l'email du client</div>
          </div>
          <div className="mt-2 flex">
            <SwitchInput
              checked={newBillCustomization.displayCustomerPhoneNumber}
              id="displayCustomerPhoneNumber"
              onToggle={handleToggle("displayCustomerPhoneNumber")}
            />
            <div className="ml-2">Afficher le téléphone du client</div>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg">Informations de l'entreprise</h3>
          <div className="mt-2 flex">
            <SwitchInput checked={newBillCustomization.displayCompanyEmail} id="displayCompanyEmail" onToggle={handleToggle("displayCompanyEmail")} />
            <div className="ml-2">Afficher l'email de mon entreprise</div>
          </div>
          <div className="mt-2 flex">
            <SwitchInput
              checked={newBillCustomization.displayCompanyPhoneNumber}
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
          value={newBillCustomization.afterTable}
          className="w-full"
          maxLength={1000}
          onChange={(e: any) => setNewBillCustomization({ ...newBillCustomization, afterTable: e.target.value })}
        />
      </div>
      <div className="mt-2">
        <h1 className="text-lg font-bold border-b-2 pb-2 pt-2">Pied de page</h1>
        <MultiLineInput
          className="w-full"
          style={{ borderBottom: "1px solid black" }}
          placeholder="Pied de page"
          value={newBillCustomization.footer}
          maxLength={1000}
          onChange={(e: any) => setNewBillCustomization({ ...newBillCustomization, footer: e.target.value })}
        />
      </div>
      <button className="w-full primary mt-5" onClick={onSubmit}>
        Enregister
      </button>
    </form>
  );
};

export default BillCustomizationForm;
