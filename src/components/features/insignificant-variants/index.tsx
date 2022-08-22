import { ComponentPropsWithoutRef, useState } from "react";
import { useTranslation } from "next-i18next";

import ListPointersIcon from "@/assets/images/icons/list-pointers.svg";
import ListRightIcon from "@/assets/images/icons/list-right.svg";
import SpinnerIcon from "@/assets/images/icons/spinner.svg";
import Button from "@/components/ui/button";
import { MaskError, MaskLoader } from "@/components/ui/mask";
import BasePanel from "@/components/ui/panel";
import Toggle from "@/components/ui/toggle";
import Typography from "@/components/ui/typography";
import styled from "styled-components";

import { useGetInsignificantVariantsForProjectById } from "./query";

type InsignificantVariantsProps = ComponentPropsWithoutRef<"div"> & {
  projectId?: number;
  isOpen: boolean;
  togglePanelVisibility: () => void;
  isRotatedWhenClosed?: boolean;
};

type MaskProps = {
  variant: "loader" | "error";
  text: string;
  refetch?: () => void;
};

type ViewProps = InsignificantVariantsProps & {
  isLoading: boolean;
  isError: boolean;
  refetch?: () => void;
  insignificantVariants: API.InsignificantVariant[];
  isRotatedWhenClosed?: boolean;
};

type DisplayMode = "text" | "list";

type PanelContentProps = {
  displayMode: DisplayMode;
  insignificantVariants: API.InsignificantVariant[];
};

const Panel = styled(BasePanel)`
  height: 100%;
  width: 100%;
`;

const VariantListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const VariantAsText = styled(Typography).attrs({ variant: "small-regular" })`
  word-break: break-all;
  margin-right: 4px;
`;

const Index = styled(Typography).attrs({ variant: "small-bold" })`
  margin-right: 4px;
`;

const MaskWrapper = styled.div`
  position: relative;
  height: 50%;
  overflow-y: scroll;
`;

function Mask({ text, variant, refetch }: MaskProps) {
  const { t } = useTranslation();

  return (
    <Panel
      headerSlots={{
        actionNode: (
          <Button type="button" mode="icon" variant="secondary" small>
            <SpinnerIcon />
          </Button>
        ),
        mainNodes: {
          action: <Toggle disabled />,
          text: <Typography>{t("project.insignificant_variants")}</Typography>,
        },
      }}
      isOpen={true}
    >
      {variant === "loader" && <MaskLoader text={text} />}
      {variant === "error" && refetch && (
        <MaskError text={text} buttonText={t("project.refresh")} refetch={refetch} />
      )}
    </Panel>
  );
}

function PanelContent({ insignificantVariants, displayMode }: PanelContentProps) {
  const { t } = useTranslation();

  if (insignificantVariants.length === 0)
    return <Typography>{t("project.no_insignificant_variants_message")}</Typography>;

  if (displayMode === "list") {
    return (
      <>
        {insignificantVariants.map(variant => (
          <VariantAsText key={variant.index}>
            <Index>({variant.index})</Index>
            {variant.value.details}
          </VariantAsText>
        ))}
      </>
    );
  }

  if (displayMode === "text") {
    return (
      <VariantListWrapper>
        {insignificantVariants.map(variant => (
          <Typography key={variant.index} variant="small-regular">
            <Index>({variant.index})</Index>
            {variant.value.details}
          </Typography>
        ))}
      </VariantListWrapper>
    );
  }

  return null;
}

function View({
  insignificantVariants,
  isLoading,
  isError,
  togglePanelVisibility,
  isOpen,
  isRotatedWhenClosed,
  refetch,
  ...props
}: ViewProps) {
  const { t } = useTranslation();
  const [displayMode, setDisplayMode] = useState<DisplayMode>("text");

  const toggleDisplayMode = () =>
    setDisplayMode(previousState => {
      if (previousState === "text") return "list";

      return "text";
    });

  return (
    <Panel
      headerSlots={{
        actionNode: (
          <Button type="button" mode="icon" variant="secondary" small onClick={toggleDisplayMode}>
            {displayMode === "text" ? <ListRightIcon /> : <ListPointersIcon />}
          </Button>
        ),
        mainNodes: {
          action: (
            <Toggle value={String(isOpen)} checked={isOpen} onChange={togglePanelVisibility} />
          ),
          text: <Typography>{t("project.insignificant_variants")}</Typography>,
        },
      }}
      isRotatedWhenClosed={isRotatedWhenClosed}
      isOpen={isOpen}
      {...props}
    >
      {isLoading || isError ? (
        <MaskWrapper>
          {isLoading && <MaskLoader text={t("project.loader_text")} withBackgroundMask />}
          {isError && refetch && (
            <MaskError
              text={t("project.generic_error")}
              buttonText={t("project.refresh")}
              refetch={refetch}
              withBackgroundMask
            />
          )}
          <PanelContent displayMode={displayMode} insignificantVariants={insignificantVariants} />
        </MaskWrapper>
      ) : (
        <PanelContent displayMode={displayMode} insignificantVariants={insignificantVariants} />
      )}
    </Panel>
  );
}

function InsignificantVariants({
  isOpen,
  projectId,
  togglePanelVisibility,
  isRotatedWhenClosed,
  ...props
}: InsignificantVariantsProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, isRefetching, isFetching, refetch } =
    useGetInsignificantVariantsForProjectById({
      projectId,
    });
  const insignificantVariants = data?.records;

  if (isLoading && !insignificantVariants)
    return <Mask variant="loader" text={t("project.loader_text")} />;

  if (isError && !insignificantVariants)
    return <Mask variant="error" text={t("project.generic_error")} refetch={refetch} />;

  if (insignificantVariants) {
    return (
      <View
        isRotatedWhenClosed={isRotatedWhenClosed}
        projectId={projectId}
        isLoading={isRefetching || isFetching}
        isError={isError && !isRefetching}
        insignificantVariants={insignificantVariants}
        isOpen={isOpen}
        togglePanelVisibility={togglePanelVisibility}
        refetch={refetch}
        {...props}
      />
    );
  }

  return null;
}

export { Mask };
export default InsignificantVariants;
