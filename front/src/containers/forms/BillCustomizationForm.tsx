import { Button, Switch, TextInput } from "@coco-ui/core";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import React from "react";
import { useMutation } from "react-query";
import { BillCustomizationGraphQL } from "../../graphql/BillCustomizationGraphQL";
import { useToast } from "../../providers/ToastProvider";

type BillCustomizationFormProps = {
  billCustomization: any;
};

const BillCustomizationForm = ({ billCustomization }: BillCustomizationFormProps): JSX.Element => {
  const [newBillCustomization, setNewBillCustomization] = React.useState<any>({} as any);
  const toast = useToast();
  const [updateBillCustomizationMutation, updateBillCustomizationMutationState] = useMutation(BillCustomizationGraphQL.updateMyBillCustomization, {
    onSuccess: () => {
      toast.show({ message: "Modification enregistrée", variant: "success" });
    },
  });
  const [, setAfterTableEditor] = React.useState(() =>
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(newBillCustomization.afterTable || "<div></div>").contentBlocks))
  );
  const [, setFooterEditor] = React.useState(() =>
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(newBillCustomization.footer || "<div></div>").contentBlocks))
  );

  const handleToggle = (property: string) => () => {
    const tmp = { ...newBillCustomization };
    tmp[property] = !tmp[property];
    setNewBillCustomization(tmp);
  };

  const onSubmit = (e: React.FormEvent) => {
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
      <h2 className="font-bold text-xl underline leading-10">Personnalisation du PDF</h2>
      <div className="flex mt-3 w-full content-center items-center">
        <div className="w-10 h-10 mr-3 border-2 border-black" style={{ backgroundColor: newBillCustomization.mainColor || "white" }}></div>
        <TextInput
          id="mainColor"
          value={newBillCustomization.mainColor}
          onChange={(e: any) => {
            setNewBillCustomization({ ...newBillCustomization, mainColor: e.target.value });
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
            <Switch checked={newBillCustomization.displayCustomerEmail} id="displayCustomerEmail" onChange={handleToggle("displayCustomerEmail")}>
              Afficher l&lsquo;email du client
            </Switch>
          </div>
          <div className="mt-2 flex">
            <Switch
              checked={newBillCustomization.displayCustomerPhoneNumber}
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
            <Switch checked={newBillCustomization.displayCompanyEmail} id="displayCompanyEmail" onChange={handleToggle("displayCompanyEmail")}>
              Afficher l&lsquo;email de mon entreprise
            </Switch>
          </div>
          <div className="mt-2 flex">
            <Switch
              checked={newBillCustomization.displayCompanyPhoneNumber}
              id="displayCompanyPhoneNumber"
              onChange={handleToggle("displayCompanyPhoneNumber")}
            >
              Afficher le téléphone de mon entreprise
            </Switch>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h1 className="text-lg font-bold border-b-2 pb-2 pt-2">Après le tableau</h1>
        <TextInput
          id="afterTable"
          multiline
          rows={5}
          placeholder="En dessous du tableau"
          value={newBillCustomization.afterTable}
          className="w-full"
          maxLength={1000}
          onChange={(e: React.ChangeEvent) => setNewBillCustomization({ ...newBillCustomization, afterTable: (e.target as HTMLTextAreaElement).value })}
        />
      </div>
      <div className="mt-2">
        <h1 className="text-lg font-bold border-b-2 pb-2 pt-2">Pied de page</h1>
        <TextInput
          id="footer"
          multiline
          rows={5}
          className="w-full"
          placeholder="Pied de page"
          value={newBillCustomization.footer}
          maxLength={1000}
          onChange={(e: React.ChangeEvent) => setNewBillCustomization({ ...newBillCustomization, footer: (e.target as HTMLTextAreaElement).value })}
        />
      </div>
      <Button type="submit" size="md" className="w-full mt-5" onClick={onSubmit}>
        Enregister
      </Button>
    </form>
  );
};

export default BillCustomizationForm;
