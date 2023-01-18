import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import Button from "@/components/ui/button";
import { MaskError, MaskLoader } from "@/components/ui/mask";
import Modal from "@/components/ui/modal";
import TextArea from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import Typography from "@/components/ui/typography/new_index";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { useGetTokenDetailsForProjectById, useSplitTokenForProjectByTokenId } from "./query";

type SplitTokenProps = {
  tokenId: number;
  projectId: number;
  onCancel: () => void;
  invalidateProjectViewQueriesCallback: () => Promise<void>;
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  justify-content: center;
`;

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const InlineButtonsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`;

const SPLIT_MARK = {
  FRONTEND: "✂️",
  BACKEND: "{scissors}",
};

const ERROR_FIELDS = ["project", "new_variants", "token"];

function SplitToken({
  tokenId,
  projectId,
  onCancel,
  invalidateProjectViewQueriesCallback,
}: SplitTokenProps) {
  const { t } = useTranslation();
  const fields = useRef<(HTMLTextAreaElement | null)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fieldsSplitMarkDeterminer, setFieldsSplitMarkDeterminer] = useState<boolean[]>([]);
  const { data, isError, isLoading, refetch } = useGetTokenDetailsForProjectById({
    projectId,
    tokenId,
  });

  const { mutate: splitToken, isLoading: isSplitTokenLoading } = useSplitTokenForProjectByTokenId({
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError) {
        if (apiError.error) {
          toast.error(<Typography>{apiError.error}</Typography>);
        }

        ERROR_FIELDS.forEach(field => {
          if (apiError[field]) {
            apiError[field].forEach(error => {
              toast.error(<Typography>{error}</Typography>);
            });
          }
        });
      }
    },
    onSuccess: async ({ data: { message } }) => {
      toast.success(<Typography>{message}</Typography>);
      await invalidateProjectViewQueriesCallback();
    },
  });

  useEffect(() => {
    // resets fieldsSplitMarkDeterminer when data changes
    if (!data?.variants) return;

    setFieldsSplitMarkDeterminer(data.variants.map(() => false));
  }, [data?.variants]);

  if (isLoading) {
    return <MaskLoader text={t("project.loader_text")} />;
  }

  if (isError) {
    return (
      <MaskError
        text={t("project.generic_error")}
        buttonText={t("project.refresh")}
        refetch={refetch}
      />
    );
  }

  const allFieldsHaveSplitMark = fieldsSplitMarkDeterminer.every(Boolean);

  const handleReset = () => {
    onCancel();
    setFieldsSplitMarkDeterminer([]);
    fields.current.map(() => null);
  };

  const handleSetValueOfSplitMarkDeterminerAtIndex = ({
    value,
    index,
  }: {
    value: boolean;
    index: number;
  }) => {
    setFieldsSplitMarkDeterminer(prev => {
      const newFieldsSplitMarkDeterminer = prev ? [...prev] : [];

      newFieldsSplitMarkDeterminer[index] = value;

      return newFieldsSplitMarkDeterminer;
    });
  };

  const handleToggleSplitMark = (index: number) => {
    const textAreaRef = fields.current[index];
    const hasSplitMark = textAreaRef?.value.includes(SPLIT_MARK.FRONTEND);

    if (!textAreaRef) return;

    if (hasSplitMark) {
      textAreaRef.value = textAreaRef.value.replace(SPLIT_MARK.FRONTEND, "");

      // mark as false in fieldsSplitMarkDeterminer at current index
      handleSetValueOfSplitMarkDeterminerAtIndex({
        value: false,
        index,
      });
    } else {
      textAreaRef.value =
        textAreaRef.value.slice(0, textAreaRef.selectionStart) +
        SPLIT_MARK.FRONTEND +
        textAreaRef.value.slice(textAreaRef.selectionEnd);

      // mark as true in fieldsSplitMarkDeterminer at current index
      handleSetValueOfSplitMarkDeterminerAtIndex({
        value: true,
        index,
      });
    }
  };

  return (
    <div>
      {data?.variants.map(({ t: value, witness }, index) => (
        <TextAreaWrapper key={`${witness}-${t}`}>
          <TextArea
            label={witness}
            defaultValue={value}
            ref={element => (fields.current[index] = element)}
            onKeyDown={event => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Tab") {
                return true;
              }

              event.preventDefault();

              return false;
            }}
          />
          <Button variant="tertiary" onClick={() => handleToggleSplitMark(index)}>
            {fieldsSplitMarkDeterminer[index]
              ? t("project.remove_split_mark")
              : t("project.insert_split_mark")}
          </Button>
        </TextAreaWrapper>
      ))}
      <div>
        <Typography>{t("project.split_token_info_text")}</Typography>
      </div>
      <InlineButtonsWrapper>
        <Button
          small
          disabled={isLoading || !allFieldsHaveSplitMark || isSplitTokenLoading}
          isLoading={isLoading || isSplitTokenLoading}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {t("project.save_token")}
        </Button>
        <Button
          variant="secondary"
          small
          onClick={handleReset}
          disabled={isLoading || isSplitTokenLoading}
          isLoading={isLoading || isSplitTokenLoading}
        >
          {t("project.cancel")}
        </Button>
      </InlineButtonsWrapper>
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <Typography>{t("project.token_before_split_warning")}</Typography>

          <InlineButtonsWrapper>
            <Button
              disabled={isSplitTokenLoading}
              isLoading={isSplitTokenLoading}
              onClick={async () => {
                if (!data?.variants) return;

                const variantsWithSplitMarkReplaced = fields.current.map(field => {
                  if (!field) return "";

                  return field.value.replace(SPLIT_MARK.FRONTEND, SPLIT_MARK.BACKEND);
                });

                const newVariants = data?.variants.map((variant, index) => ({
                  ...variant,
                  t: variantsWithSplitMarkReplaced[index],
                }));

                splitToken({
                  projectId,
                  tokenId,
                  data: {
                    variants: newVariants,
                  },
                });
                handleReset();
                setIsModalOpen(false);
              }}
            >
              {t("project.continue")}
            </Button>
            <Button
              disabled={isSplitTokenLoading}
              isLoading={isSplitTokenLoading}
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              {t("project.cancel")}
            </Button>
          </InlineButtonsWrapper>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SplitToken;
