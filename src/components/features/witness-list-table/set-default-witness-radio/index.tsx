import { useTranslation } from "next-i18next";

import Radio, { RadioProps } from "@/components/ui/radio";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useInvalidateGetWitnessListByProjectId, useUpdateWitnessById } from "../query";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
`;

export type SetDefaultWitnessRadioProps = RadioProps & {
  projectId: number;
  witness: API.Witness;
};

const DEFAULT_FIELD = "default";

function SetDefaultWitnessRadio({ projectId, witness, ...props }: SetDefaultWitnessRadioProps) {
  const { t } = useTranslation();
  const { invalidateGetWitnessListByProjectId } = useInvalidateGetWitnessListByProjectId();

  const { mutate: updateWitnessById, isLoading } = useUpdateWitnessById({
    onSuccess: () => {
      toast.success(
        <Typography>
          {t("witness_list.witness_set_default", { witnessName: witness.name })}
        </Typography>,
      );
      invalidateGetWitnessListByProjectId({ projectId });
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError) {
        if (apiError.error) {
          toast.error(<Typography>{apiError.error}</Typography>);
        }

        if (apiError[DEFAULT_FIELD]) {
          toast.error(<Typography>{apiError[DEFAULT_FIELD]}</Typography>);
        }
      }
    },
  });

  const handleChange = () => {
    updateWitnessById({
      data: {
        witness: { ...witness, [DEFAULT_FIELD]: true },
      },
      witnessId: witness.id,
      projectId,
    });
  };

  return (
    <Wrapper>
      <Radio {...props} onChange={handleChange} disabled={isLoading} />
    </Wrapper>
  );
}

export default SetDefaultWitnessRadio;
