import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import { useMutation } from "react-query";
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
  const [afterInformationEditor, setAfterInformationEditor] = React.useState(() =>
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(newQuoteCustomization.afterInformation || "<div></div>").contentBlocks))
  );
  const [afterTableEditor, setAfterTableEditor] = React.useState(() =>
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(newQuoteCustomization.afterTable || "<div></div>").contentBlocks))
  );
  const [footerEditor, setFooterEditor] = React.useState(() =>
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(newQuoteCustomization.footer || "<div></div>").contentBlocks))
  );

  const editorChange = (setEditorState: any, property: any) => (newEditorState: any) => {
    setEditorState(newEditorState);
    const tmp = { ...newQuoteCustomization };
    tmp[property] = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
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
      setAfterInformationEditor(
        EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(quoteCustomization.afterInformation || "").contentBlocks))
      );
      setAfterTableEditor(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(quoteCustomization.afterTable || "").contentBlocks)));
      setFooterEditor(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(quoteCustomization.footer || "").contentBlocks)));
    }
  }, [quoteCustomization]);

  return (
    <form onSubmit={onSubmit} className="w-3/4 flex flex-col border-gray-400 border p-5 rounded bg-white shadow-lg mt-4">
      <h1>Customisation des devis</h1>
      <div className="mt-2">
        <h1 className="text-lg font-bold border-b-2 border-t-2 pb-2 pt-2">Après les informations</h1>
        <Editor
          placeholder="Entre informations et objet du devis"
          editorStyle={{ borderBottom: "1px solid black" }}
          editorState={afterInformationEditor}
          onEditorStateChange={editorChange(setAfterInformationEditor, "afterInformation")}
        />
      </div>
      <div className="mt-2">
        <h1 className="text-lg font-bold border-b-2 border-t-2 pb-2 pt-2">Après le tableau</h1>
        <Editor
          editorStyle={{ borderBottom: "1px solid black" }}
          placeholder="En dessous du tableau du devis"
          editorState={afterTableEditor}
          onEditorStateChange={editorChange(setAfterTableEditor, "afterTable")}
        />
      </div>
      <div className="mt-2">
        <h1 className="text-lg font-bold border-b-2 border-t-2 pb-2 pt-2">Pied de page</h1>
        <Editor
          editorStyle={{ borderBottom: "1px solid black" }}
          placeholder="Pied de page"
          editorState={footerEditor}
          onEditorStateChange={editorChange(setFooterEditor, "footer")}
        />
      </div>
      <button className="w-full primary mt-5" onClick={onSubmit}>
        Enregister
      </button>
    </form>
  );
};

export default QuoteCustomizationForm;
