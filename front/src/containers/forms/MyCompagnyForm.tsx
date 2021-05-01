import React from "react";
import BaseInput from "../../components/inputs/BaseInput";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import { useMutation, useQueryCache } from "react-query";
import { CompanyGraphQL } from "../../graphql/CompanyGraphQL";
import { useToast } from "../../providers/ToastProvider";
import useLoadingState from "../../hooks/useLoadingState";
import { CompanyApi } from "../../api/CompanyApi";
import { Button, TextInput } from "@coco-ui/core";

const MyCompagnyForm: React.FC<any> = ({ company, setCompany }) => {
  const queryCache = useQueryCache();
  const toast = useToast();
  const fileInputRef = React.useRef<any>(null);
  const uploadLogoState = useLoadingState();
  const [updateCompanyMutation, updateCompanyMutationState] = useMutation(CompanyGraphQL.createOrUpdateMyCompany, {
    onSuccess: (data) => {
      toast.show({ message: "Enregistrement effectué", variant: "success" });
      queryCache.invalidateQueries("my-information");
      queryCache.invalidateQueries("my-company");
    },
  });

  const inputChange = (field: string) => (e: any) => {
    const tmp = { ...company };
    tmp[field] = e.target.value;
    setCompany(tmp);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!updateCompanyMutationState.isLoading) {
      updateCompanyMutation(company);
    }
  };

  const selectFileToUpload = (e: any) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadLogo = async (e: any) => {
    try {
      if (!uploadLogoState.isLoading) {
        uploadLogoState.update("loading");
        const url = await CompanyApi.uploadLogo(e.target.files[0]);
        setCompany({ ...company, logo: url });
        uploadLogoState.update("idle");
        toast.show({ message: "Logo téléchargé avec succes. Enregistrer les modifications", variant: "success" });
      }
    } catch (error) {
      toast.show({ message: "Erreur lors de l'upload de l'image", variant: "error" });
      console.error(error);
      setTimeout(() => {
        uploadLogoState.update("idle");
      }, 1000);
    }
  };

  return (
    <form className="w-full flex flex-col justify-center items-center" onSubmit={onSubmit}>
      <TextInput className="mt-2 w-full" placeholder="Nom" value={company.name} onChange={inputChange("name")} />
      <TextInput multiline className="mt-2 w-full" style={{ resize: "none" }} placeholder="Adresse" value={company.address} onChange={inputChange("address")} />
      <TextInput className="mt-2 w-full" placeholder="Code Postal" value={company.postalCode} onChange={inputChange("postalCode")} />
      <TextInput className="mt-2 w-full" placeholder="Ville" value={company.city} onChange={inputChange("city")} />
      <TextInput className="mt-2 w-full" placeholder="Téléphone" value={company.phoneNumber} onChange={inputChange("phoneNumber")} />
      <TextInput className="mt-2 w-full" placeholder="Email" value={company.email} onChange={inputChange("email")} />
      <TextInput className="mt-2 w-full" placeholder="SIRET" value={company.siret} onChange={inputChange("siret")} />
      {company.id ? (
        <div className="flex w-full pt-2">
          <BaseInput divClassName=" w-4/5" placeholder="URL du logo" value={company.logo} onChange={inputChange("logo")} />
          <button className="w-1/5 button secondary ml-2" type="button" onClick={selectFileToUpload} disabled={uploadLogoState.isLoading}>
            Télécharger une image
          </button>
          <input ref={fileInputRef} type="file" name="logo-upload" style={{ display: "none" }} onChange={uploadLogo} />
        </div>
      ) : (
        <div className="pt-2">Vous pourrez télécharger votre logo après la création de l'entreprise dans vos paramètres</div>
      )}
      <Button className="w-full primary mt-5" onClick={onSubmit}>
        Enregister
      </Button>
    </form>
  );
};

export default MyCompagnyForm;
