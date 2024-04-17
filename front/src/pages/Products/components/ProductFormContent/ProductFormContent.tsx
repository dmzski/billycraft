import { useController, useFormContext } from "react-hook-form"
import { ProductFormValues } from "./types"
import { Input, Select, TextArea } from "@coco-ui/core"
import { ComponentProps, useMemo } from "react"
import { LINE_TYPE } from "@/constants/line"
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery"
import { useI18n } from "@/i18n"

export const ProductFormContent = () => {
  const { scopedT } = useI18n()
  const pageT = scopedT('products.components.formContent')
  const { control } = useFormContext<ProductFormValues>()
  const { data: suppliers } = useAllSuppliersQuery()

  const { field: nameField, fieldState: nameFieldState } = useController({ control, name: 'name', rules: { required: true, minLength: 3 } })
  const { field: typeField, fieldState: typeFieldState } = useController({ control, name: 'type', rules: { required: true } })
  const { field: descriptionField, fieldState: descriptionFieldState } = useController({ control, name: 'description' })
  const { field: priceField, fieldState: priceFieldState } = useController({ control, name: 'price', rules: { required: true } })
  const { field: supplierIdField, fieldState: supplierIdFieldState } = useController({ control, name: 'supplierId' })

  const typeOptions: ComponentProps<typeof Select>['options'] = useMemo(() => Object.values(LINE_TYPE).map(type => ({
    value: type.enum,
    label: type.name,
  })), [])

  const supplierOptions: ComponentProps<typeof Select>['options'] = useMemo(() => suppliers?.map(({ id, name }) => ({
    value: id,
    label: name
  })) ?? [], [suppliers])

  return (
    <div className="flex flex-col gap-3">
      <Select
        options={supplierOptions}
        name={supplierIdField.name}
        onChange={supplierIdField.onChange}
        ref={supplierIdField.ref}
        label={pageT('fields.supplierId.label')}
        error={supplierIdFieldState.invalid}
        value={supplierIdField.value ?? ""}
        isSearchable
      />
      <Select
        options={typeOptions}
        name={typeField.name}
        onChange={typeField.onChange}
        ref={typeField.ref}
        label={pageT('fields.type.label')}
        error={typeFieldState.invalid}
        value={typeField.value}
      />
      <div className="flex flex-col gap-2">
        <Input
          name={nameField.name}
          onChange={nameField.onChange}
          onBlur={nameField.onBlur}
          ref={nameField.ref}
          required
          minLength={3}
          label={pageT('fields.name.label')}
          error={nameFieldState.invalid}
          autoComplete="off"
          value={nameField.value}
        />
        <TextArea
          name={descriptionField.name}
          onChange={descriptionField.onChange}
          onBlur={descriptionField.onBlur}
          ref={descriptionField.ref}
          placeholder={pageT('fields.description.placeholder')}
          error={descriptionFieldState.invalid}
          value={descriptionField.value}
          rows={1}
        />
      </div>
      <Input
        name={priceField.name}
        onChange={priceField.onChange}
        onBlur={priceField.onBlur}
        ref={priceField.ref}
        label={pageT('fields.price.label')}
        error={priceFieldState.invalid}
        autoComplete="off"
        value={priceField.value}
      />

    </div>
  )
}
