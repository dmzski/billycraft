import React from "react";
import BaseInput from "../../components/inputs/BaseInput";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import { useMutation, useQueryCache } from "react-query";
import { CompanyGraphQL } from "../../graphql/CompanyGraphQL";
import { useToast } from "../../providers/ToastProvider";

const MyCompagnyForm: React.FC<any> = ({ company, setCompany }) => {
  const queryCache = useQueryCache();
  const toast = useToast();
  const [updateCompanyMutation, updateCompanyMutationState] = useMutation(CompanyGraphQL.createOrUpdateMyCompany, {
    onSuccess: (data) => {
      toast.show({ message: "Enregistrement effectué", variant: "success" });
      queryCache.setQueryData("my-company", data);
      queryCache.invalidateQueries("my-information");
    },
  });

  const inputChange = (field: string) => (e: any) => {
    const tmp = { ...company };
    tmp[field] = e.target.value;
    setCompany(tmp);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!updateCompanyMutationState.isLoading) {
      await updateCompanyMutation(company);
    }
  };

  return (
    <form className="w-full flex flex-col justify-center items-center" onSubmit={onSubmit}>
      <h1 className="text-lg font-bold border-b-2 pb-2">Mon entreprise</h1>
      <BaseInput divClassName="pt-2 w-full" placeholder="Nom" value={company.name} onChange={inputChange("name")} />
      <BaseInput divClassName="pt-2 w-full" placeholder="Adresse" value={company.address} onChange={inputChange("address")} />
      <BaseInput divClassName="pt-2 w-full" placeholder="Code Postal" value={company.postalCode} onChange={inputChange("postalCode")} />
      <BaseInput divClassName="pt-2 w-full" placeholder="Ville" value={company.city} onChange={inputChange("city")} />
      <BaseInput divClassName="pt-2 w-full" placeholder="SIRET" value={company.siret} onChange={inputChange("siret")} />
      <BaseInput divClassName="pt-2 w-full" placeholder="URL du logo" value={company.logo} onChange={inputChange("logo")} />
      <button className="w-full primary mt-5" onClick={onSubmit}>
        Enregister
      </button>
    </form>
  );
};

export default MyCompagnyForm;
