import { useTranslation } from "next-i18next";

import BaseButton from "@/components/ui/button";
import { MaskError, MaskLoader } from "@/components/ui/mask";
import { toast } from "@/components/ui/toast";
import Token from "@/components/ui/token";
import NewTypography from "@/components/ui/typography/new_index";
import { isEmptyString } from "@/utils/is-empty-string";
import { unwrapAxiosError } from "@/utils/unwrap-axios-error";
import styled from "styled-components";

import { stringifyTokenIdForSelection, useTokenSelection } from "../use-token-selection";
import { useEditTokensByProjectId } from "./query";

type WrapperProps = {
  $withPadding: boolean;
};

type TokensTabErrorPros = {
  refetch: () => Promise<any>;
};

type UseTokensTabSelectionProps = {
  projectId: number;
  refetch: () => Promise<void>;
  tokens?: API.Token[];
};

export type TokensTabProps = {
  projectId: number;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isFetching: boolean;
  tokens?: API.Token[];
  refetch: () => Promise<any>;
};

const ERROR_FIELDS = ["project", "selected_text", "selected_token_ids", "tokens_with_offsets"];

const Wrapper = styled.div<WrapperProps>`
  overflow-x: hidden;
  // Every tab handles it's own padding because it's relevant for selection that the padding is in the scope of selection parent
  padding: 24px 24px 0px 24px;
  z-index: 0;
  height: 100%;
  ${({ $withPadding }) => $withPadding && "padding-bottom: 72px"};
`;

const Button = styled(BaseButton)`
  user-select: none;
`;

const FixedPanel = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  padding: 16px;
  gap: 16px;
  justify-content: flex-end;
  height: 72px;
  left: 0;
  bottom: 0;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundPrimary};
  box-shadow: 12px 12px 24px rgba(0, 0, 0, 0.08);
`;

function TokensTabLoader() {
  const { t } = useTranslation();

  return <MaskLoader text={t("project.loader_text")} withBackgroundMask />;
}

function TokensTabError({ refetch }: TokensTabErrorPros) {
  const { t } = useTranslation();

  return (
    <MaskError
      text={t("project.generic_error")}
      buttonText={t("project.refresh")}
      refetch={refetch}
      withBackgroundMask
    />
  );
}

function useTokensTabSelection({ projectId, refetch, tokens }: UseTokensTabSelectionProps) {
  const {
    selectionState,
    handleCancel,
    handleSave: handleSelectionSave,
    handleUpdateSelection,
  } = useTokenSelection({ tokens, withValidation: true });
  const { mutate: editTokensByProjectId } = useEditTokensByProjectId({
    onSuccess: async ({ data: { message } }) => {
      toast.success(<NewTypography>{message}</NewTypography>);
      await refetch();
    },
    onError: axiosError => {
      const apiError = unwrapAxiosError(axiosError);

      if (apiError) {
        if (apiError.error) {
          toast.error(<NewTypography>{apiError.error}</NewTypography>);
        }

        ERROR_FIELDS.forEach(field => {
          if (apiError[field]) {
            apiError[field].forEach(error => {
              toast.error(<NewTypography>{error}</NewTypography>);
            });
          }
        });
      }
    },
  });

  const handleSave = () => {
    handleSelectionSave(() =>
      editTokensByProjectId({
        projectId,
        data: {
          token: {
            selected_text: selectionState.selectedText,
            selected_token_ids: selectionState.selectedTokens.map(token => token.id),
            tokens_with_offsets: selectionState.boundaryTokens.map(token => ({
              token_id: token.id,
              offset: token.offset,
            })),
          },
        },
      }),
    );
  };

  return {
    selectionState,
    handleSave,
    handleCancel,
    handleUpdateSelection,
  };
}

function TokensTab({
  projectId,
  tokens,
  isError,
  isLoading,
  isRefetching,
  isFetching,
  refetch,
}: TokensTabProps) {
  const { t } = useTranslation();
  const { selectionState, handleCancel, handleSave, handleUpdateSelection } = useTokensTabSelection(
    {
      projectId,
      refetch,
      tokens,
    },
  );

  if (isLoading && !tokens) return <TokensTabLoader />;

  if (isError && !isRefetching) return <TokensTabError refetch={refetch} />;

  if (!tokens) return null;

  const isSelecting = !isEmptyString(selectionState.selectedText);

  return (
    <>
      <Wrapper onMouseUp={handleUpdateSelection} $withPadding={isSelecting}>
        {(isFetching || isRefetching) && <TokensTabLoader />}
        {isError && !isRefetching && <TokensTabError refetch={refetch} />}
        {tokens.map(token => (
          <Token
            data-testid="token"
            key={token.id}
            token={token}
            // Used to find elements in the DOM by id to read the selection anchor node and focus node
            id={stringifyTokenIdForSelection(token.id)}
            apparatusIndexVisible={false}
            forcedState={token.state === "one_variant" ? "one_variant" : "evaluated_with_multiple"}
            mode={"EDIT"}
            highlighted
          />
        ))}
      </Wrapper>

      {isSelecting && (
        <FixedPanel>
          <Button onClick={handleSave}>{t("project.create_token")}</Button>
          <Button variant="secondary" onClick={handleCancel}>
            {t("project.cancel")}
          </Button>
        </FixedPanel>
      )}
    </>
  );
}

export default TokensTab;
