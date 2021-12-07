import React from "react";
import { useMutation, useQueryCache } from "react-query";
import { useToast } from "providers/ToastProvider";
import useLoadingState from "hooks/useLoadingState";
import { CompanyApi } from "api/CompanyApi";
import { Button, TextInput } from "@coco-ui/core";
import Company from "models/Company";
import { ChangeEvent } from "react-router/node_modules/@types/react";
import { STRINGS } from "constants/strings";

type MyCompagnyFormProps = {
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
};
const MyCompagnyForm = ({
  company,
  setCompany,
}: MyCompagnyFormProps): JSX.Element => {
  const queryCache = useQueryCache();
  const toast = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const uploadLogoState = useLoadingState();
  const [updateCompanyMutation, updateCompanyMutationState] = useMutation(
    CompanyApi.createOrUpdate,
    {
      onSuccess: () => {
        toast.show({ message: STRINGS.SAVE_SUCCESS, variant: "success" });
        queryCache.invalidateQueries("my-information");
        queryCache.invalidateQueries("my-company");
      },
    }
  );

  const inputChange = (field: keyof Company) => (e: any) => {
    setCompany((current) => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!updateCompanyMutationState.isLoading) {
      updateCompanyMutation(company);
    }
  };

  const selectFileToUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadLogo = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      if (!uploadLogoState.isLoading && e.target?.files?.[0]) {
        uploadLogoState.update("loading");
        const url = await CompanyApi.uploadLogo(e.target.files[0]);
        setCompany({ ...company, logo: url });
        uploadLogoState.update("idle");
        toast.show({
          message: "Logo téléchargé avec succes. Enregistrer les modifications",
          variant: "success",
        });
      }
    } catch {
      toast.show({
        message: "Erreur lors de l'upload de l'image",
        variant: "error",
      });
      uploadLogoState.update("idle");
    }
  };

  return (
    <form
      className="w-full flex flex-col justify-center items-center"
      onSubmit={onSubmit}
    >
      <TextInput
        id="name"
        className="w-full"
        containerClassName="mt-2 w-full"
        variant="inside"
        label="Nom"
        placeholder="Nom"
        value={company.name}
        onChange={inputChange("name")}
      />
      <TextInput
        id="address"
        multiline
        rows={3}
        className="w-full"
        containerClassName="mt-2 w-full"
        variant="inside"
        label="Adresse"
        style={{ resize: "none" }}
        placeholder="Adresse"
        value={company.address}
        onChange={inputChange("address")}
      />
      <TextInput
        id="postal-code"
        className="w-full"
        containerClassName="mt-2 w-full"
        variant="inside"
        label="Code Postal"
        placeholder="Code Postal"
        value={company.postalCode}
        onChange={inputChange("postalCode")}
      />
      <TextInput
        id="city"
        className="w-full"
        containerClassName="mt-2 w-full"
        variant="inside"
        label="Ville"
        placeholder="Ville"
        value={company.city}
        onChange={inputChange("city")}
      />
      <TextInput
        id="phone-number"
        className="w-full"
        containerClassName="mt-2 w-full"
        variant="inside"
        label="Téléphone"
        placeholder="Téléphone"
        value={company.phoneNumber}
        onChange={inputChange("phoneNumber")}
      />
      <TextInput
        id="email"
        className="w-full"
        containerClassName="mt-2 w-full"
        variant="inside"
        label="Email"
        placeholder="Email"
        value={company.email}
        onChange={inputChange("email")}
      />
      <TextInput
        id="siret"
        className="w-full"
        containerClassName="mt-2 w-full"
        variant="inside"
        label="SIRET"
        placeholder="SIRET"
        value={company.siret}
        onChange={inputChange("siret")}
      />
      {company.id ? (
        <div className="flex w-full pt-2">
          <TextInput
            className=" w-4/5"
            placeholder="URL du logo"
            value={company.logo}
            onChange={inputChange("logo")}
          />
          <Button
            className="w-1/5 ml-2"
            type="button"
            onClick={selectFileToUpload}
            disabled={uploadLogoState.isLoading}
          >
            Télécharger une image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            name="logo-upload"
            className="sr-only opacity-5"
            onChange={uploadLogo}
          />
        </div>
      ) : (
        <div className="pt-2">
          Vous pourrez télécharger votre logo après la création de
          l&lsquo;entreprise dans vos paramètres
        </div>
      )}
      <Button size="md" className="w-full primary mt-5" onClick={onSubmit}>
        Enregister
      </Button>
    </form>
  );
};

export default MyCompagnyForm;
