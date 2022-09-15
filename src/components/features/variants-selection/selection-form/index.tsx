import { useState } from "react";
import { useTranslation } from "next-i18next";

import Button from "@/components/ui/button";
import Checkbox, { Wrapper as CheckboxWrapper } from "@/components/ui/checkbox";
import Radio, { Wrapper as RadioWrapper } from "@/components/ui/radio";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useUpdateGroupedVariantsForTokenById } from "./query";

export type SelectionFormProps = {
  projectId: number;
  tokenId: number;
  groupedVariants: API.GroupedVariant[];
  onGroupedVariantSelectionSubmit?: () => Promise<void>;
};

const RowWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 12px;

  ${RadioWrapper}, ${CheckboxWrapper} {
    width: 24px;
    flex-shrink: 0;
  }
`;

const NoSelectionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
`;

const ERROR_FIELDS = ["grouped_variants"];

const getFormattedWitnesses = (witnesses: string[]) => witnesses.join(", ").concat(": ");

const getGroupedVariantsWithNoSelection = (groupedVariants: API.GroupedVariant[]) =>
  groupedVariants.map(variant => ({
    ...variant,
    possible: false,
    selected: false,
  }));

const updateVariantInGroupedVariants = (
  updatedVariant: API.GroupedVariant,
  groupedVariants: API.GroupedVariant[],
) => groupedVariants.map(variant => (updatedVariant.id === variant.id ? updatedVariant : variant));

const updateSelectedVariantInGroupedVariants = (
  updatedVariant: API.GroupedVariant,
  groupedVariants: API.GroupedVariant[],
) =>
  updateVariantInGroupedVariants(
    updatedVariant,
    groupedVariants.map(variant => ({ ...variant, selected: false })),
  );

/** Exception to react-hook-form rule from the README.
 * This component uses controlled inputs and doesn't use react-hook-form.
 * The reason for this is that the inputs are dynamic and interdependent.
 * The purpose of the library is to make it easier to handle forms, here it wouldn't be the case.
 */
function SelectionForm({
  tokenId,
  projectId,
  groupedVariants,
  onGroupedVariantSelectionSubmit,
}: SelectionFormProps) {
  const { t } = useTranslation();
  const [groupedVariantsData, setGroupedVariantsData] = useState(groupedVariants);
  const { mutate: updateGroupedVariantsForTokenById, isLoading } =
    useUpdateGroupedVariantsForTokenById({
      onSuccess: async () => {
        if (onGroupedVariantSelectionSubmit) await onGroupedVariantSelectionSubmit();
      },
      onError: axiosError => {
        const apiError = unwrapAxiosError(axiosError);

        if (apiError) {
          if (apiError.error) {
            toast.error(<Typography>{apiError.error}</Typography>);
          }

          // grouped_variants error
          if (apiError[ERROR_FIELDS[0]]) {
            toast.error(<Typography>{apiError[ERROR_FIELDS[0]]}</Typography>);
          }
        }
      },
    });

  const isNoSelection = groupedVariantsData.every(variant => !variant.selected);
  const isFormSubmissionDisabled =
    isNoSelection && groupedVariantsData.some(variant => variant.possible);

  const handleGroupedVariantsUpdate = (groupedVariants: API.GroupedVariant[]) => {
    setGroupedVariantsData(groupedVariants);
  };

  return (
    <form
      onSubmit={async e => {
        e.stopPropagation();
        e.preventDefault();
        updateGroupedVariantsForTokenById({
          projectId,
          tokenId,
          data: {
            token: {
              grouped_variants: groupedVariantsData.map(({ id, selected, possible }) => ({
                id,
                possible,
                selected,
              })),
            },
          },
        });
      }}
    >
      <NoSelectionWrapper>
        <Radio
          id={t("project.no_selection")}
          name={String(tokenId)}
          label={t("project.no_selection")}
          checked={isNoSelection}
          onChange={() => {
            handleGroupedVariantsUpdate(getGroupedVariantsWithNoSelection(groupedVariantsData));
          }}
        />
      </NoSelectionWrapper>
      {groupedVariantsData.map((variant, index) => (
        <RowWrapper key={index}>
          <Radio
            data-testid="selected"
            name={String(tokenId)}
            checked={variant.selected}
            onChange={event => {
              const checked = event.target.checked;

              handleGroupedVariantsUpdate(
                updateSelectedVariantInGroupedVariants(
                  { ...variant, selected: checked, possible: checked },
                  groupedVariantsData,
                ),
              );
            }}
          />
          <Checkbox
            data-testid="possible"
            disabled={variant.selected}
            checked={variant.possible}
            onChange={event => {
              handleGroupedVariantsUpdate(
                updateVariantInGroupedVariants(
                  { ...variant, possible: event.target.checked },
                  groupedVariantsData,
                ),
              );
            }}
          />
          <div>
            <Typography variant="body-bold">{getFormattedWitnesses(variant.witnesses)}</Typography>
            <Typography>{variant.t}</Typography>
          </div>
        </RowWrapper>
      ))}
      <Button disabled={isFormSubmissionDisabled || isLoading} isLoading={isLoading} small>
        {t("project.save")}
      </Button>
    </form>
  );
}

export default SelectionForm;
